type Category = "display" | "handwriting" | "monospace" | "serif" | "sans-serif";
type Weight = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
type FileWeight = Weight | `${Weight}italic`;

export type LocalFont = {
	category: Category;
	family: string;
	weights: Weight[];
};

export type WebFont = {
	category: Category;
	family: string;
	weights: Weight[];
	preview: string;
	files: Record<FileWeight, string>;
};
