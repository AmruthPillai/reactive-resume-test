import z from "zod";
import { protectedProcedure, publicProcedure } from "../context";
import { authService, type ProviderList } from "../services/auth";

export const authRouter = {
	providers: {
		list: publicProcedure.handler(async (): Promise<ProviderList> => {
			return authService.providers.list();
		}),
	},

	// TODO: add rate limiting
	verifyResumePassword: publicProcedure
		.input(
			z.object({
				slug: z.string().min(1),
				username: z.string().min(1),
				password: z.string().min(1),
			}),
		)
		.handler(async ({ input }): Promise<boolean> => {
			return authService.verifyResumePassword({
				slug: input.slug,
				username: input.username,
				password: input.password,
			});
		}),

	deleteAccount: protectedProcedure.handler(async ({ context }): Promise<void> => {
		await authService.deleteAccount({ userId: context.user.id });
	}),
};
