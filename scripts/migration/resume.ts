import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";
import { schema } from "@/integrations/drizzle";
import { ReactiveResumeV4JSONImporter } from "@/integrations/import/reactive-resume-v4-json";
import { defaultResumeData } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

// Types for the production database
type Visibility = "public" | "private";

interface ProductionResume {
	id: string;
	title: string;
	slug: string;
	data: unknown; // JSON data
	visibility: Visibility;
	locked: boolean;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

interface ProductionStatistics {
	id: string;
	views: number;
	downloads: number;
	resumeId: string;
	createdAt: Date;
	updatedAt: Date;
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

export async function migrateResumes() {
	const migrationStart = performance.now();
	console.log("⌛ Starting resume migration...");

	// Connect to both databases
	const productionDb = drizzle({ client: productionClient, connection: productionUrl });
	const localDb = drizzle({ client: localClient, connection: localUrl, schema });

	let hasMore = true;
	let currentOffset = 0;

	// Load persistent userIdMap from file
	const userIdMap = await loadUserIdMapFromFile();

	// Track migration stats
	let resumesCreated = 0;
	let statisticsCreated = 0;
	let skipped = 0;
	let totalResumesProcessed = 0;
	let errors = 0;

	// Initialize the importer
	const importer = new ReactiveResumeV4JSONImporter();

	while (hasMore) {
		console.log(`📥 Fetching resumes batch from production database (OFFSET ${currentOffset})...`);

		const resumes = (await productionDb.execute(sql`
			SELECT id, title, slug, data, visibility, locked, "userId", "createdAt", "updatedAt"
			FROM "Resume"
			ORDER BY "id" ASC
			LIMIT ${BATCH_SIZE} OFFSET ${currentOffset}
		`)) as unknown as ProductionResume[];

		console.log(`📋 Found ${resumes.length} resumes in this batch.`);

		if (resumes.length === 0) {
			hasMore = false;
			break;
		}

		// Fetch statistics only for these resumes in this batch
		const resumeIds = resumes.map((r) => r.id);

		// Drizzle does not interpolate arrays, so we join and use a custom SQL string
		const resumeIdsForSql = resumeIds.map((id) => `'${id}'`).join(", ");

		const statistics = (await productionDb.execute(sql`
			SELECT id, views, downloads, "resumeId", "createdAt", "updatedAt"
			FROM "Statistics"
			WHERE "resumeId" IN (${sql.raw(resumeIdsForSql)})
		`)) as unknown as ProductionStatistics[];

		// Create a map of resumeId -> statistics for quick lookup
		const statisticsMap = new Map<string, ProductionStatistics>();
		for (const stat of statistics) {
			statisticsMap.set(stat.resumeId, stat);
		}

		for (let i = 0; i < resumes.length; i++) {
			const resume = resumes[i];
			const resumeStart = performance.now();

			// The (global) processed resume index for logging (1-based)
			const runningIndex = totalResumesProcessed + i + 1;

			try {
				// Get the new userId from the mapping
				const newUserId = userIdMap.get(resume.userId);
				if (!newUserId) {
					console.log(`⏭️  Skipping resume at index ${runningIndex} (userId ${resume.userId} not found in userIdMap)`);
					skipped++;
					continue;
				}

				// Check if the user exists in the local database
				const existingUser = await localDb.select().from(schema.user).where(eq(schema.user.id, newUserId)).limit(1);

				if (existingUser.length === 0) {
					console.log(`⏭️  Skipping resume at index ${runningIndex} (userId ${newUserId} not found in local database)`);
					skipped++;
					continue;
				}

				// Check if resume with this slug and userId already exists
				const existingResume = await localDb
					.select()
					.from(schema.resume)
					.where(and(eq(schema.resume.slug, resume.slug), eq(schema.resume.userId, newUserId)))
					.limit(1);

				if (existingResume.length > 0) {
					console.log(`⏭️  Skipping resume at index ${runningIndex} (already exists in target DB)`);
					skipped++;
					continue;
				}

				// Generate a new UUID for the resume
				const newResumeId = generateId();

				// Transform the data using the V4 importer
				let transformedData = defaultResumeData;
				try {
					const dataJson = typeof resume.data === "string" ? resume.data : JSON.stringify(resume.data);
					transformedData = importer.parse(dataJson);
				} catch (error) {
					console.error(`⚠️  Failed to parse resume data at index ${runningIndex}, using default data:`, error);
					// Use default data if parsing fails
					transformedData = defaultResumeData;
				}

				// Map visibility to isPublic (visibility === "public" -> isPublic = true)
				const isPublic = resume.visibility === "public";

				// Insert resume into the new database
				await localDb.insert(schema.resume).values({
					id: newResumeId,
					name: resume.title,
					slug: resume.slug,
					tags: [], // Default empty array
					isPublic: isPublic,
					isLocked: resume.locked,
					password: null, // No password in old schema
					data: transformedData,
					userId: newUserId,
					createdAt: resume.createdAt,
					updatedAt: resume.updatedAt,
				});
				resumesCreated++;

				// Get the resume's statistics
				const resumeStatistics = statisticsMap.get(resume.id);

				// Create statistics entry if it exists
				if (resumeStatistics) {
					await localDb.insert(schema.resumeStatistics).values({
						id: generateId(),
						views: resumeStatistics.views,
						downloads: resumeStatistics.downloads,
						lastViewedAt: null, // Not available in old schema
						lastDownloadedAt: null, // Not available in old schema
						resumeId: newResumeId,
						createdAt: resumeStatistics.createdAt,
						updatedAt: resumeStatistics.updatedAt,
					});
					statisticsCreated++;
				}

				const resumeEnd = performance.now();
				const resumeTimeMs = resumeEnd - resumeStart;

				console.log(`✅ Migrated resume at index ${runningIndex} (took ${resumeTimeMs.toFixed(1)} ms)`);
			} catch (error) {
				console.error(`🚨 Failed to migrate resume at index ${runningIndex}:`, error);
				errors++;
			}
		}

		currentOffset += resumes.length;
		totalResumesProcessed += resumes.length;
		console.log(`📦 Processed ${totalResumesProcessed} resumes so far...\n`);
	}

	const migrationEnd = performance.now();
	const migrationDurationMs = migrationEnd - migrationStart;

	console.log("\n📊 Migration Summary:");
	console.log(`   Resumes created: ${resumesCreated}`);
	console.log(`   Statistics created: ${statisticsCreated}`);
	console.log(`   Skipped (userId not found or already exist): ${skipped}`);
	console.log(`   Errors: ${errors}`);
	console.log(
		`⏱️  Total migration time: ${migrationDurationMs.toFixed(1)} ms (${(migrationDurationMs / 1000).toFixed(2)} seconds)`,
	);

	console.log("✅ Resume migration complete!");
}

if (import.meta.main) {
	try {
		await migrateResumes();
	} finally {
		await productionClient.close();
		await localClient.close();
	}
}
