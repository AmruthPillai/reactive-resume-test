import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { Template } from "@/schema/templates";

export type TemplateMetadata = {
	name: string;
	description: MessageDescriptor;
	imageUrl: string;
	tags: string[];
};

export const templates = {
	azurill: {
		name: "Azurill",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/azurill.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	bronzor: {
		name: "Bronzor",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/bronzor.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	chikorita: {
		name: "Chikorita",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/chikorita.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	ditto: {
		name: "Ditto",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/ditto.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	gengar: {
		name: "Gengar",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/gengar.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	glalie: {
		name: "Glalie",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/glalie.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	kakuna: {
		name: "Kakuna",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/kakuna.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	lapras: {
		name: "Lapras",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/lapras.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	leafish: {
		name: "Leafish",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/leafish.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	onyx: {
		name: "Onyx",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/onyx.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	pikachu: {
		name: "Pikachu",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/pikachu.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
	rhyhorn: {
		name: "Rhyhorn",
		description: msg`Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt.`,
		imageUrl: "/templates/jpg/rhyhorn.jpg",
		tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
	},
} as const satisfies Record<Template, TemplateMetadata>;
