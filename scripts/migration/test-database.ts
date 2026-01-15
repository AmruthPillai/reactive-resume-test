import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";

const client = new Bun.SQL({ url: Bun.env.DATABASE_URL });
const db = drizzle({ client });

try {
	const result = await db.execute(sql`SELECT 1 as connected`);
	console.log("✓ Database connection successful", JSON.stringify(result));
	process.exit(0);
} catch (error) {
	console.error("✗ Database connection failed:", error);
	process.exit(1);
} finally {
	await client.end();
}
