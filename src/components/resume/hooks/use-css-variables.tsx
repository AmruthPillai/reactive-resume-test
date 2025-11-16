import type { ResumeData } from "@/schema/resume/data";

const pageDimensions = {
	a4: {
		width: "210mm",
		height: "297mm",
	},
	letter: {
		width: "216mm",
		height: "279mm",
	},
} as const;

export const useCSSVariables = (data: ResumeData) => {
	if (typeof window === "undefined") return {};

	return {
		"--page-width": `calc(${pageDimensions[data.metadata.page.format].width} * ${window.devicePixelRatio})`,
		"--page-height": `calc(${pageDimensions[data.metadata.page.format].height} * ${window.devicePixelRatio})`,
		"--page-text-color": data.metadata.theme.text,
		"--page-background-color": data.metadata.theme.background,
		"--page-body-font-family": `'${data.metadata.typography.body.fontFamily}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
		"--page-body-font-weight": data.metadata.typography.body.fontWeight,
		"--page-body-font-size": `${data.metadata.typography.body.fontSize}pt`,
		"--page-body-line-height": data.metadata.typography.body.lineHeight,
		"--page-heading-font-family": `'${data.metadata.typography.heading.fontFamily}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
		"--page-heading-font-weight": data.metadata.typography.body.fontWeight,
		"--page-heading-font-size": `${data.metadata.typography.heading.fontSize}pt`,
		"--page-heading-line-height": data.metadata.typography.heading.lineHeight,
		"--page-margin-x": `${data.metadata.page.marginX}pt`,
		"--page-margin-y": `${data.metadata.page.marginY}pt`,
	} as React.CSSProperties;
};
