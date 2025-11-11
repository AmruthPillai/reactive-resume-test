import { ORPCError } from "@orpc/client";
import { and, arrayContains, asc, desc, eq } from "drizzle-orm";
import { match } from "ts-pattern";
import z from "zod";
import { schema } from "@/integrations/drizzle";
import { db } from "@/integrations/drizzle/client";
import { resumeSchema } from "@/integrations/drizzle/schema";
import { defaultResumeData, resumeDataSchema, sampleResumeData } from "@/schema/resume/data";
import { generateId } from "@/utils/string";
import { protectedProcedure } from "../context";

const tagsRouter = {
	list: protectedProcedure.handler(async ({ context }) => {
		const result = await db
			.select({ tags: schema.resume.tags })
			.from(schema.resume)
			.where(eq(schema.resume.userId, context.user.id));

		const uniqueTags = new Set(result.flatMap((tag) => tag.tags));
		const sortedTags = Array.from(uniqueTags).sort((a, b) => a.localeCompare(b));

		return sortedTags;
	}),
};

export const resumeRouter = {
	tags: tagsRouter,

	list: protectedProcedure
		.input(
			z.object({
				tags: z.array(z.string()).catch([]),
				sort: z.enum(["lastUpdatedAt", "createdAt", "name"]).catch("lastUpdatedAt"),
			}),
		)
		.handler(({ input, context }) => {
			return db
				.select({
					id: schema.resume.id,
					name: schema.resume.name,
					slug: schema.resume.slug,
					tags: schema.resume.tags,
					isPublic: schema.resume.isPublic,
					isLocked: schema.resume.isLocked,
					createdAt: schema.resume.createdAt,
					updatedAt: schema.resume.updatedAt,
				})
				.from(schema.resume)
				.where(
					and(
						eq(schema.resume.userId, context.user.id),
						match(input.tags.length)
							.with(0, () => undefined)
							.otherwise(() => arrayContains(schema.resume.tags, input.tags)),
					),
				)
				.orderBy(
					match(input.sort)
						.with("lastUpdatedAt", () => desc(schema.resume.updatedAt))
						.with("createdAt", () => asc(schema.resume.createdAt))
						.with("name", () => asc(schema.resume.name))
						.exhaustive(),
				);
		}),

	getById: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ context, input }) => {
		const resume = await db.query.resume.findFirst({
			where: and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)),
		});

		if (!resume) throw new ORPCError("NOT_FOUND");

		return resume;
	}),

	create: protectedProcedure
		.input(resumeSchema.omit({ id: true }).extend({ withSampleData: z.boolean().default(false) }))
		.handler(async ({ context, input }) => {
			const id = generateId();

			await db.insert(schema.resume).values({
				id,
				name: input.name,
				slug: input.slug,
				tags: input.tags,
				userId: context.user.id,
				data: input.withSampleData ? sampleResumeData : defaultResumeData,
			});

			return id;
		}),

	update: protectedProcedure.input(resumeSchema).handler(async ({ context, input }) => {
		await db
			.update(schema.resume)
			.set({ name: input.name, slug: input.slug, tags: input.tags })
			.where(
				and(
					eq(schema.resume.id, input.id),
					eq(schema.resume.isLocked, false),
					eq(schema.resume.userId, context.user.id),
				),
			);
	}),

	updateData: protectedProcedure
		.input(z.object({ id: z.string(), data: resumeDataSchema }))
		.handler(async ({ context, input }) => {
			await db
				.update(schema.resume)
				.set({ data: input.data })
				.where(and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)));
		}),

	setLocked: protectedProcedure
		.input(z.object({ id: z.string(), isLocked: z.boolean() }))
		.handler(async ({ context, input }) => {
			await db
				.update(schema.resume)
				.set({ isLocked: input.isLocked })
				.where(and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)));
		}),

	duplicate: protectedProcedure
		.input(resumeSchema.partial().extend({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const result = await db
				.select({
					name: schema.resume.name,
					slug: schema.resume.slug,
					tags: schema.resume.tags,
					data: schema.resume.data,
				})
				.from(schema.resume)
				.where(and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)));

			if (result.length === 0) throw new ORPCError("NOT_FOUND");

			const original = result[0];
			const id = generateId();

			await db.insert(schema.resume).values({
				id,
				name: input.name ?? original.name,
				slug: input.slug ?? original.slug,
				tags: input.tags ?? original.tags,
				data: original.data,
				userId: context.user.id,
			});

			return id;
		}),

	delete: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ context, input }) => {
		await db
			.delete(schema.resume)
			.where(
				and(
					eq(schema.resume.id, input.id),
					eq(schema.resume.isLocked, false),
					eq(schema.resume.userId, context.user.id),
				),
			);
	}),
};
