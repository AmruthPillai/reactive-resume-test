import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";

import { definePlugin } from "nitro";

export default definePlugin(async () => {
	console.log("⌛ Running database migrations...");

	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const client = new Bun.SQL(process.env.DATABASE_URL);
	const db = drizzle(client);

	try {
		await migrate(db, { migrationsFolder: "./migrations" });
		console.log("✅ Database migrations completed");
	} catch (error) {
		console.error("🚨 Database migrations failed:", error);
	} finally {
		await client.end();
	}
});
