import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { env } from "@/utils/env";

export async function migrateDatabase() {
	console.log("⌛ Running database migrations...");

	const client = new Bun.SQL(env.DATABASE_URL);
	const db = drizzle(client);

	try {
		await migrate(db, { migrationsFolder: "./migrations" });
	} catch (error) {
		console.error("🚨 Database migrations failed:", error);
	} finally {
		await client.end();
	}
}

if (import.meta.main) {
	await migrateDatabase();
}
