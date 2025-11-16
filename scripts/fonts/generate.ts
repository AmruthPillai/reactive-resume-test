/**
 * This script is responsible for generating a JSON file containing the fonts served by Google Fonts.
 * The JSON file will be used to populate the typography options in the resume builder.
 *
 * Information about the Google Fonts Developer API can be found here: https://developers.google.com/fonts/docs/developer_api
 */

type Category = "display" | "handwriting" | "monospace" | "serif" | "sans-serif";

type Variant =
	| "100"
	| "100italic"
	| "200"
	| "200italic"
	| "300"
	| "300italic"
	| "regular"
	| "italic"
	| "500"
	| "500italic"
	| "600"
	| "600italic"
	| "700"
	| "700italic"
	| "800"
	| "800italic"
	| "900"
	| "900italic";

type Item = {
	kind: "webfonts#webfont";
	menu: string;
	family: string;
	version: string;
	category: Category;
	lastModified: string;
	subsets: string[];
	variants: Variant[];
	colorCapabilities?: string[];
	files: Record<Variant, string>;
};

type APIResponse = {
	kind: "webfonts#webfontList";
	items: Item[];
};

type Weight = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
type FileWeight = Weight | `${Weight}italic`;

type WebFont = {
	category: Category;
	family: string;
	weights: Weight[];
	preview: string;
	files: Record<FileWeight, string>;
};

const args = Bun.argv.slice(2);
const argForce = args.includes("--force");
const argCompress = args.includes("--compress");
const argLimit = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1], 10) : 500;

const blacklistedFonts = ["Material Icons", "Material Symbols", "Noto Color Emoji"];

async function getGoogleFontsJSON() {
	const file = Bun.file("data/fonts/response.json");

	if (!argForce && (await file.exists())) return (await file.json()) as APIResponse;

	const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
	if (!apiKey) throw new Error("GOOGLE_CLOUD_API_KEY is not set");

	const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;
	const response = await fetch(url);
	const data = (await response.json()) as APIResponse;

	const jsonString = argCompress ? JSON.stringify(data) : JSON.stringify(data, null, 2);
	await file.write(jsonString);

	return data;
}

function variantToWeight(variant: Variant): Weight | null {
	if (["100", "200", "300", "500", "600", "700", "800", "900"].includes(variant)) return variant as Weight;
	if (variant === "regular") return "400";
	return null;
}

export async function generateFonts() {
	const response = await getGoogleFontsJSON();
	console.log(`Found ${response.items.length} fonts in total.`);

	const filteredItems = response.items.filter(
		(item) => !blacklistedFonts.some((blacklist) => item.family.includes(blacklist)),
	);

	const result: WebFont[] = filteredItems.slice(0, argLimit).map((item) => {
		// 1. weights: Only non-italic, convert "regular" to "400"
		const weights: Weight[] = item.variants.map((v) => variantToWeight(v)).filter((w): w is Weight => !!w);

		// 2. files: all files, but change "regular"->"400", "italic"->"400italic"
		const files: Record<string, string> = {};
		for (const [variant, url] of Object.entries(item.files)) {
			let key = variant;
			if (variant === "regular") key = "400";
			else if (variant === "italic") key = "400italic";
			files[key] = url;
		}

		return {
			category: item.category,
			family: item.family,
			weights,
			preview: item.menu,
			files,
		};
	});

	const jsonString = argCompress ? JSON.stringify(result) : JSON.stringify(result, null, 2);
	await Bun.write("data/fonts/webfontlist.json", jsonString);

	console.log(`Generated ${result.length} fonts in the list.`);
}

if (import.meta.main) {
	await generateFonts();
}
