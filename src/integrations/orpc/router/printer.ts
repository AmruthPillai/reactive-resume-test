import { ORPCError } from "@orpc/server";
import puppeteer from "puppeteer-core";
import z from "zod";
import { env } from "@/utils/env";
import { generatePrinterToken } from "@/utils/printer-token";
import { publicProcedure } from "../context";

export const printerRouter = {
	printResumeAsPDF: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }): Promise<File> => {
		try {
			const token = generatePrinterToken(input.id);

			const browser = await puppeteer.connect({
				browserURL: env.PRINTER_ENDPOINT,
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
