import z from "zod";
import { resumeDataSchema } from "@/schema/resume/data";
import { protectedProcedure, publicProcedure } from "../context";
import { resumeService } from "../services/resume";

const tagsRouter = {
	list: protectedProcedure.handler(async ({ context }) => {
		return resumeService.tags.list({ userId: context.user.id });
	}),
};

const publicRouter = {
	getBySlug: publicProcedure.input(z.object({ username: z.string(), slug: z.string() })).handler(async ({ input }) => {
		return resumeService.public.getBySlug(input);
	}),
};

const statisticsRouter = {
	getById: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ context, input }) => {
		return resumeService.statistics.getById({ id: input.id, userId: context.user.id });
	}),

	increment: publicProcedure
		.input(z.object({ id: z.string(), views: z.boolean().default(false), downloads: z.boolean().default(false) }))
		.handler(async ({ input }) => {
			return resumeService.statistics.increment(input);
		}),
};

export const resumeRouter = {
	tags: tagsRouter,
	public: publicRouter,
	statistics: statisticsRouter,

	list: protectedProcedure
		.input(
			z.object({
				tags: z.array(z.string()).catch([]),
				sort: z.enum(["lastUpdatedAt", "createdAt", "name"]).catch("lastUpdatedAt"),
			}),
		)
		.handler(async ({ input, context }) => {
			return resumeService.list({
				userId: context.user.id,
				tags: input.tags,
				sort: input.sort,
			});
		}),

	getById: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ context, input }) => {
		return resumeService.getById({ id: input.id, userId: context.user.id });
	}),

	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				slug: z.string(),
				tags: z.array(z.string()),
				withSampleData: z.boolean().default(false),
			}),
		)
		.handler(async ({ context, input }) => {
			return resumeService.create({
				userId: context.user.id,
				name: input.name,
				slug: input.slug,
				tags: input.tags,
				withSampleData: input.withSampleData,
			});
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				slug: z.string().optional(),
				tags: z.array(z.string()).optional(),
				isPublic: z.boolean().optional(),
				isLocked: z.boolean().optional(),
				password: z.string().min(6).max(64).nullable().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			return resumeService.update({
				id: input.id,
				userId: context.user.id,
				name: input.name,
				slug: input.slug,
				tags: input.tags,
				isPublic: input.isPublic,
				isLocked: input.isLocked,
				password: input.password,
			});
		}),

	updateData: protectedProcedure
		.input(z.object({ id: z.string(), data: resumeDataSchema }))
		.handler(async ({ context, input }) => {
			return resumeService.updateData({
				id: input.id,
				userId: context.user.id,
				data: input.data,
			});
		}),

	setLocked: protectedProcedure
		.input(z.object({ id: z.string(), isLocked: z.boolean() }))
		.handler(async ({ context, input }) => {
			return resumeService.setLocked({
				id: input.id,
				userId: context.user.id,
				isLocked: input.isLocked,
			});
		}),

	duplicate: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				slug: z.string().optional(),
				tags: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			return resumeService.duplicate({
				id: input.id,
				userId: context.user.id,
				name: input.name,
				slug: input.slug,
				tags: input.tags,
			});
		}),

	delete: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ context, input }) => {
		return resumeService.delete({ id: input.id, userId: context.user.id });
	}),
};
