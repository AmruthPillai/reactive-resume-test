import { eq, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";
import { schema } from "@/integrations/drizzle";
import { generateId, toUsername } from "@/utils/string";

type Provider = "credential" | "google" | "github" | "custom";

// Types for the production database
type ProductionProvider = "email" | "github" | "google" | "openid";

interface ProductionUser {
	id: string;
	name: string;
	picture: string | null;
	username: string;
	email: string;
	locale: string;
	emailVerified: boolean;
	twoFactorEnabled: boolean;
	createdAt: Date;
	updatedAt: Date;
	provider: ProductionProvider;
}

interface ProductionSecrets {
	id: string;
	password: string | null;
	lastSignedIn: Date;
	verificationToken: string | null;
	twoFactorSecret: string | null;
	twoFactorBackupCodes: string[];
	refreshToken: string | null;
	resetToken: string | null;
	userId: string;
}

// Map old provider to new providerId
function mapProviderId(provider: ProductionProvider): Provider {
	switch (provider) {
		case "email":
			return "credential";
		case "google":
			return "google";
		case "github":
			return "github";
		default:
			return "custom";
	}
}

const productionUrl = process.env.PRODUCTION_DATABASE_URL;
const localUrl = process.env.DATABASE_URL;

if (!productionUrl) throw new Error("PRODUCTION_DATABASE_URL is not set");
if (!localUrl) throw new Error("DATABASE_URL is not set");

const productionClient = new Bun.SQL({ url: productionUrl });
const localClient = new Bun.SQL({ url: localUrl });

// == Persistent mapping file path ==
const USER_ID_MAP_FILE = "./scripts/migration/.user-id-map.json";

// You may tune this for your use case
const BATCH_SIZE = 1000;

async function loadUserIdMapFromFile(): Promise<Map<string, string>> {
	try {
		const file = Bun.file(USER_ID_MAP_FILE);
		if (await file.exists()) {
			const text = await file.text();
			const obj = JSON.parse(text);
			return new Map(Object.entries(obj));
		}
	} catch (e) {
		console.warn("⚠️  Failed to load userIdMap from disk, continuing with empty map.", e);
	}
	return new Map<string, string>();
}

async function saveUserIdMapToFile(userIdMap: Map<string, string>) {
	const obj: Record<string, string> = Object.fromEntries(userIdMap.entries());
	await Bun.write(USER_ID_MAP_FILE, JSON.stringify(obj, null, "\t"));
}

export async function migrateUsers() {
	const migrationStart = performance.now();
	console.log("⌛ Starting user migration...");

	// Connect to both databases
	const productionDb = drizzle({ client: productionClient, connection: productionUrl });
	const localDb = drizzle({ client: localClient, connection: localUrl });

	let hasMore = true;
	let currentOffset = 0;

	// Load persistent userIdMap from file
	const userIdMap = await loadUserIdMapFromFile();

	// Track migration stats
	let usersCreated = 0;
	let accountsCreated = 0;
	let twoFactorCreated = 0;
	let skipped = 0;
	let totalUsersProcessed = 0;

	while (hasMore) {
		console.log(`📥 Fetching users batch from production database (OFFSET ${currentOffset})...`);

		const users = (await productionDb.execute(sql`
			SELECT id, name, picture, username, email, locale, "emailVerified", "twoFactorEnabled", "createdAt", "updatedAt", provider
			FROM "User"
      WHERE "email" = 'amruthpillai.de@gmail.com'
			ORDER BY "id" ASC
			LIMIT ${BATCH_SIZE} OFFSET ${currentOffset}
		`)) as unknown as ProductionUser[];

		console.log(`📋 Found ${users.length} users in this batch.`);

		if (users.length === 0) {
			hasMore = false;
			break;
		}

		// Fetch secrets only for these users in this batch
		const userIds = users.map((u) => u.id);

		// Drizzle does not interpolate arrays, so we join and use a custom SQL string
		const userIdsForSql = userIds.map((id) => `'${id}'`).join(", ");

		const secrets = (await productionDb.execute(sql`
			SELECT id, password, "lastSignedIn", "verificationToken", "twoFactorSecret", "twoFactorBackupCodes", "refreshToken", "resetToken", "userId"
			FROM "Secrets"
			WHERE "userId" IN (${sql.raw(userIdsForSql)})
		`)) as unknown as ProductionSecrets[];

		// Create a map of userId -> secrets for quick lookup
		const secretsMap = new Map<string, ProductionSecrets>();
		for (const secret of secrets) {
			secretsMap.set(secret.userId, secret);
		}

		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			const userStart = performance.now();

			// The (global) processed user index for logging (1-based)
			const runningIndex = totalUsersProcessed + i + 1;

			// If this user was previously migrated (exists in our mapping), skip re-inserting them
			if (userIdMap.has(user.id)) {
				console.log(`⏭️  Skipping user at index ${runningIndex} (already in userIdMap, likely already migrated)`);
				skipped++;
				continue;
			}

			try {
				// Generate a new UUID v7 for the user
				const newUserId = generateId();
				userIdMap.set(user.id, newUserId);

				// Prepare username (lowercase, valid characters only)
				const username = toUsername(user.username);
				const displayUsername = user.username;

				// Check if user with this email or username already exists
				const existingUser = await localDb
					.select()
					.from(schema.user)
					.where(or(eq(schema.user.email, user.email), eq(schema.user.username, username)))
					.limit(1);

				if (existingUser.length > 0) {
					console.log(`⏭️  Skipping user at index ${runningIndex} (already exists in target DB)`);
					skipped++;
					// Save userIdMap immediately—important for resuming!
					await saveUserIdMapToFile(userIdMap);
					continue;
				}

				// Insert user into the new database
				await localDb.insert(schema.user).values({
					id: newUserId,
					name: user.name,
					email: user.email,
					image: user.picture,
					username: username,
					displayUsername: displayUsername,
					emailVerified: user.emailVerified,
					twoFactorEnabled: user.twoFactorEnabled,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				});
				usersCreated++;

				// Get the user's secrets
				const userSecrets = secretsMap.get(user.id);

				// Create account entry
				const providerId = mapProviderId(user.provider);
				const accountId = providerId === "credential" ? newUserId : user.id; // For OAuth, we'd use the provider's account ID

				await localDb.insert(schema.account).values({
					id: generateId(),
					userId: newUserId,
					accountId: accountId,
					providerId: providerId,
					password: userSecrets?.password ?? null,
					refreshToken: userSecrets?.refreshToken ?? null,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				});

				accountsCreated++;

				// Create two-factor entry if user has 2FA enabled and has secrets
				if (user.twoFactorEnabled && userSecrets?.twoFactorSecret) {
					await localDb.insert(schema.twoFactor).values({
						id: generateId(),
						userId: newUserId,
						secret: userSecrets.twoFactorSecret,
						backupCodes: userSecrets.twoFactorBackupCodes.join(","), // Convert array to comma-separated string
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					});
					twoFactorCreated++;
				}

				const userEnd = performance.now();
				const userTimeMs = userEnd - userStart;

				console.log(`✅ Migrated user at index ${runningIndex} (took ${userTimeMs.toFixed(1)} ms)`);

				// Save progress after each successfully migrated user
				await saveUserIdMapToFile(userIdMap);
			} catch (error) {
				console.error(`🚨 Failed to migrate user at index ${runningIndex}:`, error);
				// Still save mapping so we can resume/max safety
				await saveUserIdMapToFile(userIdMap);
			}
		}

		currentOffset += users.length;
		totalUsersProcessed += users.length;
		console.log(`📦 Processed ${totalUsersProcessed} users so far...\n`);
	}

	const migrationEnd = performance.now();
	const migrationDurationMs = migrationEnd - migrationStart;

	console.log("\n📊 Migration Summary:");
	console.log(`   Users created: ${usersCreated}`);
	console.log(`   Accounts created: ${accountsCreated}`);
	console.log(`   Two-factor entries created: ${twoFactorCreated}`);
	console.log(`   Skipped (already exist): ${skipped}`);
	console.log(
		`⏱️  Total migration time: ${migrationDurationMs.toFixed(1)} ms (${(migrationDurationMs / 1000).toFixed(2)} seconds)`,
	);

	console.log("✅ User migration complete!");

	// Final save of the mapping (ensures up-to-date state)
	await saveUserIdMapToFile(userIdMap);

	// Return the ID mapping for use in other migrations (e.g., resumes)
	return userIdMap;
}

if (import.meta.main) {
	try {
		await migrateUsers();
	} finally {
		await productionClient.close();
		await localClient.close();
	}
}
