import { Buffer } from "node:buffer";
import { ORPCError } from "@orpc/server";
import sharp from "sharp";
import z from "zod";
import { buildStorageKey, getStorageService, inferContentType } from "@/integrations/storage";
import { env } from "@/utils/env";
import { generateId } from "@/utils/string";
import { protectedProcedure } from "../context";

const storageService = getStorageService();

const fileSchema = z.file().max(10 * 1024 * 1024, "File size must be less than 10MB");

const filenameSchema = z.object({ filename: z.string().min(1) });

function buildPublicUrl(path: string): string {
	return new URL(path, env.APP_URL).toString();
}

export const storageRouter = {
	uploadFile: protectedProcedure.input(fileSchema).handler(async ({ context, input: file }) => {
		const id = generateId();
		const fileBuffer = await file.arrayBuffer();
		const originalMimeType = file.type;

		let key: string;
		let filename: string;
		let contentType: string;
		let finalBuffer: Buffer | Uint8Array;

		const imageMimeTypes = ["image/gif", "image/png", "image/jpeg", "image/webp"];
		const isImage = imageMimeTypes.includes(originalMimeType);

		if (isImage) {
			filename = `${id}.webp`;
			key = buildStorageKey(context.user.id, filename);
			contentType = "image/webp";
			finalBuffer = await sharp(fileBuffer)
				.resize(800, 800, { fit: "inside", withoutEnlargement: true })
				.webp({ preset: "picture" })
				.toBuffer();
		} else {
			filename = `${id}`;
			key = buildStorageKey(context.user.id, filename);
			contentType = originalMimeType;
			finalBuffer = new Uint8Array(fileBuffer);
		}

		await storageService.write({
			key,
			contentType,
			data: new Uint8Array(finalBuffer),
		});

		return {
			filename,
			url: buildPublicUrl(key),
			path: key,
			contentType,
		};
	}),

	readFile: protectedProcedure.input(filenameSchema).handler(async ({ context, input }) => {
		const key = buildStorageKey(context.user.id, input.filename);
		const result = await storageService.read(key);

		if (!result) throw new ORPCError("NOT_FOUND");

		const contentType = result.contentType ?? inferContentType(input.filename);
		const data = Buffer.from(result.data).toString("base64");

		return {
			filename: input.filename,
			url: buildPublicUrl(key),
			contentType,
			size: result.size,
			etag: result.etag,
			lastModified: result.lastModified?.toISOString(),
			data,
		};
	}),

	deleteFile: protectedProcedure.input(filenameSchema).handler(async ({ context, input }) => {
		const key = buildStorageKey(context.user.id, input.filename);
		const deleted = await storageService.delete(key);

		if (!deleted) throw new ORPCError("NOT_FOUND");
	}),
};
