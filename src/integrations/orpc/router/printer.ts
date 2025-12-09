import z from "zod";
import { protectedProcedure, publicProcedure } from "../context";
import { printerService } from "../services/printer";

export const printerRouter = {
	printResumeAsPDF: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
		return printerService.printResumeAsPDF({ id: input.id });
	}),

	getResumeScreenshot: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
		return printerService.getResumeScreenshot({ id: input.id });
	}),
};
