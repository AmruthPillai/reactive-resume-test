import z from "zod";
import { protectedProcedure, publicProcedure } from "../context";
import { printerService } from "../services/printer";

export const printerRouter = {
	printResumeAsPDF: publicProcedure
		.route({
			method: "GET",
			path: "/printer/resume/{id}/pdf",
			tags: ["Resume", "Printer"],
			description: "Export a resume as a PDF.",
		})
		.input(z.object({ id: z.string() }))
		.output(z.instanceof(File))
		.handler(async ({ input }) => {
			return await printerService.printResumeAsPDF({ id: input.id });
		}),

	getResumeScreenshot: protectedProcedure
		.route({
			method: "GET",
			path: "/printer/resume/{id}/screenshot",
			tags: ["Resume", "Printer"],
			description: "Get a screenshot of a resume.",
		})
		.input(z.object({ id: z.string() }))
		.output(z.instanceof(File))
		.handler(async ({ input }) => {
			return await printerService.getResumeScreenshot({ id: input.id });
		}),
};
