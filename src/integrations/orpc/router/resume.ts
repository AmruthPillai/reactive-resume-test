import { randomBytes, timingSafeEqual } from "node:crypto";
import { ORPCError } from "@orpc/client";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { and, arrayContains, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
import { match } from "ts-pattern";
import z from "zod";
import { schema } from "@/integrations/drizzle";
import { db } from "@/integrations/drizzle/client";
import { defaultResumeData, resumeDataSchema, sampleResumeData } from "@/schema/resume/data";
import { env } from "@/utils/env";
import { generateId } from "@/utils/string";
import { protectedProcedure, publicProcedure } from "../context";

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

const RESUME_ACCESS_COOKIE_PREFIX = "__Host-resume_access";
const RESUME_ACCESS_TTL_SECONDS = 60 * 10; // 10 minutes

const getResumeAccessCookieName = (resumeId: string) => `${RESUME_ACCESS_COOKIE_PREFIX}_${resumeId}`;

const signResumeAccessToken = (resumeId: string, passwordHash: string): string => {
	const timestamp = Date.now();
	const random = randomBytes(16).toString("hex");
	const signature = new Bun.CryptoHasher("sha256")
		.update(`${resumeId}:${passwordHash}:${timestamp}:${random}`)
		.digest("hex");

	return `${timestamp}.${random}.${signature}`;
};

const safeEquals = (value: string, expected: string) => {
	const valueBuffer = Buffer.from(value);
	const expectedBuffer = Buffer.from(expected);
	if (valueBuffer.length !== expectedBuffer.length) return false;
	return timingSafeEqual(valueBuffer, expectedBuffer);
};

const hasResumeAccess = (resumeId: string, passwordHash: string | null) => {
	if (!passwordHash) return false;
	const cookieName = getResumeAccessCookieName(resumeId);
	const cookieValue = getCookie(cookieName);
	if (!cookieValue) return false;
	const expected = signResumeAccessToken(resumeId, passwordHash);
	return safeEquals(cookieValue, expected);
};

const grantResumeAccess = (resumeId: string, passwordHash: string) =>
	setCookie(getResumeAccessCookieName(resumeId), signResumeAccessToken(resumeId, passwordHash), {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: env.APP_URL.startsWith("https"),
		maxAge: RESUME_ACCESS_TTL_SECONDS,
	});

const publicResumeRouter = {
	getBySlug: publicProcedure.input(z.object({ username: z.string(), slug: z.string() })).handler(async ({ input }) => {
		const [resume] = await db
			.select({
				id: schema.resume.id,
				data: schema.resume.data,
				hasPassword: sql<boolean>`${schema.resume.password} IS NOT NULL`,
				passwordHash: schema.resume.password,
			})
			.from(schema.resume)
			.innerJoin(schema.user, eq(schema.resume.userId, schema.user.id))
			.where(
				and(
					eq(schema.user.username, input.username),
					eq(schema.resume.isPublic, true),
					eq(schema.resume.slug, input.slug),
				),
			);

		if (!resume) throw new ORPCError("NOT_FOUND");

		if (!resume.hasPassword) {
			return {
				id: resume.id,
				data: resume.data,
				hasPassword: false,
			};
		}

		if (hasResumeAccess(resume.id, resume.passwordHash)) {
			return {
				id: resume.id,
				data: resume.data,
				hasPassword: true,
			};
		}

		throw new ORPCError("NEED_PASSWORD", {
			status: 401,
			data: { username: input.username, slug: input.slug },
		});
	}),

	verifyPassword: publicProcedure
		.input(z.object({ username: z.string(), slug: z.string(), password: z.string() }))
		.handler(async ({ input }) => {
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
		}),
};

export const resumeRouter = {
	tags: tagsRouter,
	public: publicResumeRouter,

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
		const [resume] = await db
			.select({
				id: schema.resume.id,
				name: schema.resume.name,
				slug: schema.resume.slug,
				tags: schema.resume.tags,
				data: schema.resume.data,
				isPublic: schema.resume.isPublic,
				isLocked: schema.resume.isLocked,
				hasPassword: sql<boolean>`${schema.resume.password} IS NOT NULL`,
			})
			.from(schema.resume)
			.where(and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)));

		if (!resume) throw new ORPCError("NOT_FOUND");

		return resume;
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
			let hashedPassword: string | null | undefined;
			if (input.password !== undefined) {
				hashedPassword = input.password ? await Bun.password.hash(input.password) : null;
			}

			const [resume] = await db
				.select({ isLocked: schema.resume.isLocked })
				.from(schema.resume)
				.where(and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)));

			if (resume?.isLocked) throw new ORPCError("RESUME_LOCKED");

			const updateData: Partial<typeof schema.resume.$inferSelect> = {
				name: input.name,
				slug: input.slug,
				tags: input.tags,
				isPublic: input.isPublic,
				isLocked: input.isLocked,
			};

			if (input.password !== undefined) {
				updateData.password = hashedPassword;
			}

			await db
				.update(schema.resume)
				.set(updateData)
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
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				slug: z.string().optional(),
				tags: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const [original] = await db
				.select({
					name: schema.resume.name,
					slug: schema.resume.slug,
					tags: schema.resume.tags,
					data: schema.resume.data,
				})
				.from(schema.resume)
				.where(and(eq(schema.resume.id, input.id), eq(schema.resume.userId, context.user.id)));

			if (!original) throw new ORPCError("NOT_FOUND");

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
