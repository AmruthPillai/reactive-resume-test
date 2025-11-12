import { ORPCError } from "@orpc/server";
import sharp from "sharp";
import z from "zod";
import { env } from "@/utils/env";
import { generateId } from "@/utils/string";
import { protectedProcedure } from "../context";

const imageFileSchema = z
	.file()
	.min(10 * 1024, "File size must be greater than 10KB") // 10KB
	.max(10 * 1024 * 1024, "File size must be less than 10MB") // 10MB
	.mime(["image/png", "image/jpeg", "image/webp"], "File must be an image (HEIC is not supported)");

export const storageRouter = {
	uploadImage: protectedProcedure.input(imageFileSchema).handler(async ({ context, input: file }) => {
		const id = generateId();
		const imageBuffer = await file.arrayBuffer();

		const filename = `${id}.webp`;
		const path = `uploads/${context.user.id}/${filename}`;
		const fileObject = Bun.file(`./data/${path}`);

		const resizedImageBuffer = await sharp(imageBuffer).resize(800, 800).webp({ preset: "picture" }).toBuffer();
		await fileObject.write(resizedImageBuffer);

		return `${env.APP_URL}/${path}`;
	}),

	deleteFile: protectedProcedure.input(z.object({ filename: z.string() })).handler(async ({ context, input }) => {
		const path = `uploads/${context.user.id}/${input.filename}`;
		const file = Bun.file(`./data/${path}`);

		try {
			await file.delete();
		} catch {
			throw new ORPCError("NOT_FOUND");
		}
	}),
};
