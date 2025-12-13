import { ORPCError } from "@orpc/server";
import { env } from "@/utils/env";
import { generatePrinterToken } from "@/utils/printer-token";
import { resumeService } from "./resume";
import { LocalStorageService } from "./storage";

const pageDimensions = {
	a4: {
		width: "210mm",
		height: "297mm",
	},
	letter: {
		width: "8.5in",
		height: "11in",
	},
} as const;

const SCREENSHOT_TTL = 1000 * 60 * 10; // 10 minutes

export const printerService = {
	printResumeAsPDF: async (input: { id: string }): Promise<File> => {
		const resume = await resumeService.getByIdForPrinter({ id: input.id });
		const format = resume.data.metadata.page.format;
		const locale = resume.data.metadata.page.locale;

		const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;
		const domain = new URL(baseUrl).hostname;

		const token = generatePrinterToken(input.id);
		const url = `${baseUrl}/printer/${input.id}?token=${token}`;

		const formData = new FormData();
		const cookies = [{ name: "locale", value: locale, domain }];

		formData.append("url", url);
		formData.append("marginTop", "0");
		formData.append("marginLeft", "0");
		formData.append("marginRight", "0");
		formData.append("marginBottom", "0");
		formData.append("printBackground", "true");
		formData.append("skipNetworkIdleEvent", "false");
		formData.append("cookies", JSON.stringify(cookies));
		formData.append("paperWidth", pageDimensions[format].width);
		formData.append("paperHeight", pageDimensions[format].height);

		const headers = new Headers();

		if (env.GOTENBERG_USERNAME && env.GOTENBERG_PASSWORD) {
			const credentials = `${env.GOTENBERG_USERNAME}:${env.GOTENBERG_PASSWORD}`;
			const encodedCredentials = btoa(credentials);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
		}

		const response = await fetch(`${env.GOTENBERG_ENDPOINT}/forms/chromium/convert/url`, {
			headers,
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new ORPCError("UNAUTHORIZED", {
				status: response.status,
				message: response.statusText,
			});
		}

		const pdfBuffer = await response.arrayBuffer();
		return new File([new Uint8Array(pdfBuffer)], `resume-${input.id}.pdf`, { type: "application/pdf" });
	},

	getResumeScreenshot: async (input: { id: string }): Promise<File> => {
		const localStorageService = new LocalStorageService();
		const prefix = `screenshots/${input.id}`;

		const existingScreenshots = await localStorageService.list(prefix);
		const now = Date.now();

		if (existingScreenshots.length > 0) {
			const sortedFiles = existingScreenshots
				.map((path) => {
					const filename = path.split("/").pop();
					const match = filename?.match(/^(\d+)\.webp$/);
					return match ? { path, timestamp: Number(match[1]) } : null;
				})
				.filter((item): item is { path: string; timestamp: number } => item !== null)
				.sort((a, b) => b.timestamp - a.timestamp);

			if (sortedFiles.length > 0) {
				const latest = sortedFiles[0];
				const age = now - latest.timestamp;

				if (age < SCREENSHOT_TTL) {
					const result = await localStorageService.read(latest.path);

					if (result) {
						return new File([result.data.slice()], `resume-${input.id}.webp`, {
							type: result.contentType ?? "image/webp",
						});
					}
				}

				await Promise.all(sortedFiles.map((file) => localStorageService.delete(file.path)));
			}
		}

		const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;

		const token = generatePrinterToken(input.id);
		const url = `${baseUrl}/printer/${input.id}?token=${token}`;

		const formData = new FormData();

		formData.append("url", url);
		formData.append("clip", "true");
		formData.append("width", "794");
		formData.append("height", "1123");
		formData.append("format", "webp");
		formData.append("optimizeForSpeed", "true");
		formData.append("skipNetworkIdleEvent", "false");

		const headers = new Headers();

		if (env.GOTENBERG_USERNAME && env.GOTENBERG_PASSWORD) {
			const credentials = `${env.GOTENBERG_USERNAME}:${env.GOTENBERG_PASSWORD}`;
			const encodedCredentials = btoa(credentials);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
		}

		const response = await fetch(`${env.GOTENBERG_ENDPOINT}/forms/chromium/screenshot/url`, {
			headers,
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new ORPCError("UNAUTHORIZED", {
				status: response.status,
				message: response.statusText,
			});
		}

		const imageBuffer = await response.arrayBuffer();
		const imageData = new Uint8Array(imageBuffer);

		const timestamp = now;
		const storageKey = `${prefix}/${timestamp}.webp`;

		await localStorageService.write({
			key: storageKey,
			data: imageData,
			contentType: "image/webp",
		});

		const result = await localStorageService.read(storageKey);

		if (!result) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to read screenshot from storage after writing",
			});
		}

		return new File([result.data.slice()], `resume-${input.id}.webp`, { type: result.contentType ?? "image/webp" });
	},
};
