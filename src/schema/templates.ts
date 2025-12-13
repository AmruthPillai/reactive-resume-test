import z from "zod";

export const templateSchema = z.enum([
	"azurill",
	"bronzor",
	"chikorita",
	"ditto",
	"gengar",
	"glalie",
	"kakuna",
	"lapras",
	"leafish",
	"onyx",
	"pikachu",
	"rhyhorn",
]);

export type Template = z.infer<typeof templateSchema>;
