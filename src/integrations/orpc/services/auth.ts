import { ORPCError } from "@orpc/client";
import { and, eq, isNotNull } from "drizzle-orm";
import type { AuthProvider } from "@/integrations/auth/types";
import { schema } from "@/integrations/drizzle";
import { db } from "@/integrations/drizzle/client";
import { env } from "@/utils/env";
import { grantResumeAccess } from "../helpers/resume-access";
import { getStorageService } from "./storage";

export type ProviderList = Partial<Record<AuthProvider, string>>;

const providers = {
	list: (): ProviderList => {
		const providers: ProviderList = { credential: "Password" };

		if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) providers.google = "Google";
		if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) providers.github = "GitHub";
		if (env.OAUTH_CLIENT_ID && env.OAUTH_CLIENT_SECRET) providers.custom = env.OAUTH_PROVIDER_NAME ?? "Custom OAuth";

		return providers;
	},
};

export const authService = {
	providers,

	verifyResumePassword: async (input: { slug: string; username: string; password: string }): Promise<boolean> => {
		const [resume] = await db
			.select({ id: schema.resume.id, password: schema.resume.password })
			.from(schema.resume)
			.innerJoin(schema.user, eq(schema.resume.userId, schema.user.id))
			.where(
				and(
					isNotNull(schema.resume.password),
					eq(schema.resume.slug, input.slug),
					eq(schema.user.username, input.username),
				),
			);

		if (!resume) throw new ORPCError("NOT_FOUND");

		const passwordHash = resume.password as string;
		const isValid = await Bun.password.verify(input.password, passwordHash);

		if (!isValid) throw new ORPCError("INVALID_PASSWORD");

		grantResumeAccess(resume.id, passwordHash);

		return true;
	},

	deleteAccount: async (input: { userId: string }): Promise<void> => {
		if (!input.userId || input.userId.length === 0) return;

		const storageService = getStorageService();
		let files: string[] = [];

		try {
			files = await storageService.list(`uploads/${input.userId}`);
		} catch {
			// ignore error, and proceed with deleting user
		}

		await Promise.allSettled(files.map((file) => storageService.delete(file)));

		try {
			await db.delete(schema.user).where(eq(schema.user.id, input.userId));
		} catch (err) {
			console.error(`Failed to delete user record for userId=${input.userId}:`, err);

			throw new ORPCError("INTERNAL_SERVER_ERROR");
		}
	},
};
