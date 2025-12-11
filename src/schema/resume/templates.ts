import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import z from "zod";

export const templateSchema = z.enum([
	"azurill",
	"bronzor",
	"chikorita",
	"ditto",
	"gengar",
	// "glalie",
	// "kakuna",
	// "leafish",
	// "nosepass",
	"onyx",
	// "pikachu",
	// "rhyhorn"
]);

export type Template = z.infer<typeof templateSchema>;

export type TemplateMetadata = {
	name: string;
	description: MessageDescriptor;
	imageUrl: string;
	tags: string[];
};

export const templates = {
	onyx: {
		name: "Onyx",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "https://picsum.photos/800/1201",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	ditto: {
		name: "Ditto",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "https://picsum.photos/800/1202",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	bronzor: {
		name: "Bronzor",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "https://picsum.photos/800/1203",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	chikorita: {
		name: "Chikorita",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "https://picsum.photos/800/1204",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	gengar: {
		name: "Gengar",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "https://picsum.photos/800/1205",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	azurill: {
		name: "Azurill",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "https://picsum.photos/800/1206",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
} as const satisfies Record<Template, TemplateMetadata>;
