import { createContext, use, useLayoutEffect, useState } from "react";
import webfontlist from "@/components/typography/webfontlist.json";
import type { ResumeData } from "@/schema/resume/data";
import { useCSSVariables } from "./use-css-variables";

export const ResumePreviewContext = createContext<ResumeData>({} as ResumeData);

type ProviderProps = {
	data: ResumeData;
	children: React.ReactNode;
};

export const ResumePreviewProvider = ({ data, children }: ProviderProps) => {
	const style = useCSSVariables(data);
	const [fontsReady, setFontsReady] = useState(false);

	useLayoutEffect(() => {
		async function loadFont(family: string, weight: string) {
			const font = webfontlist.find((font) => font.family === family);
			if (!font) return;

			type FontUrl = { url: string; weight: string; style: "italic" | "normal" };

			const fontUrls = Object.entries(font.files).reduce((acc, [fileWeight, url]) => {
				if (weight === fileWeight) acc.push({ url, weight, style: "normal" });
				if (fileWeight === `${weight}italic`) acc.push({ url, weight, style: "italic" });
				return acc;
			}, [] as FontUrl[]);

			for (const { url, weight, style } of fontUrls) {
				const fontFace = new FontFace(family, `url(${url})`, { style, weight, display: "swap" });
				if (!document.fonts.has(fontFace)) document.fonts.add(await fontFace.load());
			}
		}

		const bodyTypography = data.metadata.typography.body;
		const headingTypography = data.metadata.typography.heading;

		Promise.all([
			loadFont(bodyTypography.fontFamily, bodyTypography.fontWeight),
			loadFont(headingTypography.fontFamily, headingTypography.fontWeight),
		]).then(() => {
			setFontsReady(true);
		});
	}, [data.metadata.typography]);

	if (!data || !fontsReady) return null;

	return (
		<ResumePreviewContext.Provider value={data}>
			<div style={{ ...style, all: "initial" }}>{children}</div>
		</ResumePreviewContext.Provider>
	);
};

export function useResumePreview<T = ResumeData>(selector?: (data: ResumeData) => T): T {
	const context = use(ResumePreviewContext);

	return selector ? selector(context) : (context as T);
}
