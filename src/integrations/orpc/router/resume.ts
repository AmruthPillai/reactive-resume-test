import { ORPCError } from "@orpc/server";
import puppeteerCore from "puppeteer-core";
import z from "zod";
import { resumeDataSchema, sampleResumeData } from "@/schema/resume/data";
import { env } from "@/utils/env";
import { generatePrinterToken } from "@/utils/printer-token";
import { protectedProcedure, publicProcedure, serverOnlyProcedure } from "../context";
import { resumeService } from "../services/resume";

const tagsRouter = {
	list: protectedProcedure.handler(async ({ context }) => {
		return resumeService.tags.list({ userId: context.user.id });
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

const printer = {
	printAsPDF: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
		try {
			// Generate a time-limited token for printer route access
			const token = generatePrinterToken(input.id);

			const browser = await puppeteerCore.connect({
				browserURL: "http://localhost:9222",
				defaultViewport: { width: 794, height: 1123 },
			});

			const page = await browser.newPage();

			const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;

			await page.goto(`${baseUrl}/printer/${input.id}?token=${token}`, { waitUntil: "networkidle0", timeout: 25000 });

			const pdfBuffer = await page.pdf({
				format: "A4",
				waitForFonts: true,
				printBackground: true,
				displayHeaderFooter: false,
				margin: { top: 0, right: 0, bottom: 0, left: 0 },
			});

			await page.close();

			return new File([new Uint8Array(pdfBuffer)], `resume-${input.id}.pdf`, { type: "application/pdf" });
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR");
		}
	}),
};

export const resumeRouter = {
	printer: printer,
	tags: tagsRouter,
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

	getByIdForPrinter: serverOnlyProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
		return resumeService.getByIdForPrinter({ id: input.id });
	}),

	getBySlug: publicProcedure
		.input(z.object({ username: z.string(), slug: z.string() }))
		.handler(async ({ input, context }) => {
			return resumeService.getBySlug({ ...input, currentUserId: context.user?.id });
		}),

	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(64),
				slug: z.string().min(1).max(64),
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
				data: input.withSampleData ? sampleResumeData : undefined,
			});
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				slug: z.string().optional(),
				tags: z.array(z.string()).optional(),
				data: resumeDataSchema.optional(),
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
				data: input.data,
				isPublic: input.isPublic,
				isLocked: input.isLocked,
				password: input.password,
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
			const original = await resumeService.getById({ id: input.id, userId: context.user.id });

			return await resumeService.create({
				userId: context.user.id,
				name: input.name ?? original.name,
				slug: input.slug ?? original.slug,
				tags: input.tags ?? original.tags,
				data: original.data,
			});
		}),

	delete: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ context, input }) => {
		return resumeService.delete({ id: input.id, userId: context.user.id });
	}),
};
