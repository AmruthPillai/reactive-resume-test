import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/style";

interface FontDisplayProps {
	name: string;
	url: string;
}

const loadedFonts = new Set<string>();

export function FontDisplay({ name, url }: FontDisplayProps) {
	const previewName = `${name} Preview`;

	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoaded, setIsLoaded] = useState(() => loadedFonts.has(previewName));
	const isInView = useInView(containerRef, { once: true, amount: 0.1, margin: "50px" });

	useEffect(() => {
		if (!isInView || isLoaded) return;

		const fontFace = new FontFace(previewName, `url(${url})`, { display: "swap" });

		fontFace.load().then((loadedFace) => {
			if (!document.fonts.has(loadedFace)) document.fonts.add(loadedFace);

			loadedFonts.add(previewName);
			setIsLoaded(true);
		});
	}, [isInView, isLoaded, previewName, url]);

	return (
		<div ref={containerRef} className="inline">
			<span
				style={{ fontFamily: isLoaded ? `'${previewName}', sans-serif` : "sans-serif" }}
				className={cn(isLoaded ? "opacity-100" : "opacity-50", "transition-opacity duration-200 ease-in")}
			>
				{name}
			</span>
		</div>
	);
}
