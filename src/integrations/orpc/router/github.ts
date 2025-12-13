import z from "zod";
import { publicProcedure } from "../context";
import { githubService } from "../services/github";

export const githubRouter = {
	getStarCount: publicProcedure
		.route({
			method: "GET",
			path: "/github/get-star-count",
			tags: ["GitHub"],
			description: "Get the star count for the Reactive Resume GitHub repository, at the time of writing.",
		})
		.output(z.number().default(34_073))
		.handler(async (): Promise<number> => {
			return await githubService.getStarCount();
		}),
};
