import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/bun-sql";
import type { BunSQLDatabase } from "drizzle-orm/bun-sql/postgres/driver";
import { schema } from "@/integrations/drizzle";
import { env } from "@/utils/env";

declare global {
	var __databaseClient: Bun.SQL | undefined;
	var __drizzleClient: BunSQLDatabase<typeof schema> | undefined;
}

function makeDatabaseClient() {
	return new Bun.SQL(env.DATABASE_URL);
}

function makeDrizzleClient(client: Bun.SQL) {
	return drizzle({ client, schema });
}

const getDatabaseServerFn = createServerOnlyFn(() => {
	const client = globalThis.__databaseClient ?? makeDatabaseClient();
	globalThis.__databaseClient = client;

	const db = globalThis.__drizzleClient ?? makeDrizzleClient(client);
	globalThis.__drizzleClient = db;

	return db;
});

export const db = getDatabaseServerFn();
