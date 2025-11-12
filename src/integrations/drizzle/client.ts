import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/bun-sql";
import { schema } from "@/integrations/drizzle";
import { env } from "@/utils/env";

const getDatabaseServerFn = createServerOnlyFn(() => {
	const client = new Bun.SQL(env.DATABASE_URL);

	return drizzle({ client, schema });
});

export const db = getDatabaseServerFn();
