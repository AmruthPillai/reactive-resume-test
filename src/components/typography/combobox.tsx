import { useMemo } from "react";
import { cn } from "@/utils/style";
import { Combobox, type ComboboxProps } from "../ui/combobox";
import { FontDisplay } from "./font-display";
import webfontlist from "./webfontlist.json";

type WebFont = (typeof webfontlist)[number];

function getFontFamilyMap() {
	const map = new Map<string, WebFont>();

	for (const font of webfontlist) {
		map.set(font.family, font);
	}

	return map;
}

const fontFamilyMap: Map<string, WebFont> = getFontFamilyMap();

type FontFamilyComboboxProps = Omit<ComboboxProps, "options">;

export function FontFamilyCombobox({ className, ...props }: FontFamilyComboboxProps) {
	const options = useMemo(() => {
		return webfontlist.map((font) => ({
			value: font.family,
			keywords: [font.family],
			label: <FontDisplay name={font.family} url={font.preview} />,
		}));
	}, []);

	return <Combobox options={options} className={cn("w-full", className)} {...props} />;
}

type FontWeightComboboxProps = Omit<ComboboxProps, "options"> & { fontFamily: string };

export function FontWeightCombobox({ fontFamily, ...props }: FontWeightComboboxProps) {
	const options = useMemo(() => {
		const fontData = fontFamilyMap.get(fontFamily);
		if (!fontData || !Array.isArray(fontData.weights)) return [];

		return fontData.weights.map((variant: string) => ({
			value: variant,
			label: variant,
			keywords: [variant],
		}));
	}, [fontFamily]);

	return <Combobox options={options} {...props} />;
}
