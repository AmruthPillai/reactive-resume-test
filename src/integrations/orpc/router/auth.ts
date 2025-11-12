import { eq } from "drizzle-orm";
import type { AuthProvider } from "@/integrations/auth/types";
import { schema } from "@/integrations/drizzle";
import { db } from "@/integrations/drizzle/client";
import { env } from "@/utils/env";
import { protectedProcedure, publicProcedure } from "../context";

export const authRouter = {
	listProviders: publicProcedure.handler(async () => {
		const providers: Partial<Record<AuthProvider, string>> = { credential: "Password" };

		if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) providers.google = "Google";
		if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) providers.github = "GitHub";
		if (env.OAUTH_CLIENT_ID && env.OAUTH_CLIENT_SECRET) providers.custom = env.OAUTH_PROVIDER_NAME ?? "Custom OAuth";

		return providers;
	}),

	deleteAccount: protectedProcedure.handler(async ({ context }) => {
		await db.delete(schema.user).where(eq(schema.user.id, context.user.id));
	}),
};
