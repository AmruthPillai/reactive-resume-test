import { Trans } from "@lingui/react/macro";
import { IconContext, type IconProps } from "@phosphor-icons/react";
import { useMemo } from "react";
import { match } from "ts-pattern";
import type { Template } from "@/schema/templates";
import { cn } from "@/utils/style";
import { useCSSVariables } from "./hooks/use-css-variables";
import { useWebfonts } from "./hooks/use-webfonts";
import styles from "./preview.module.css";
import { useResumeStore } from "./store/resume";
import { AzurillTemplate } from "./templates/azurill";
import { BronzorTemplate } from "./templates/bronzor";
import { ChikoritaTemplate } from "./templates/chikorita";
import { DittoTemplate } from "./templates/ditto";
import { GengarTemplate } from "./templates/gengar";
import { GlalieTemplate } from "./templates/glalie";
import { KakunaTemplate } from "./templates/kakuna";
import { LaprasTemplate } from "./templates/lapras";
import { LeafishTemplate } from "./templates/leafish";
import { OnyxTemplate } from "./templates/onyx";
import { PikachuTemplate } from "./templates/pikachu";
import { RhyhornTemplate } from "./templates/rhyhorn";

type Props = React.ComponentProps<"div"> & {
	pageClassName?: string;
	showPageNumbers?: boolean;
};

function getTemplateComponent(template: Template) {
	return match(template)
		.with("azurill", () => AzurillTemplate)
		.with("bronzor", () => BronzorTemplate)
		.with("chikorita", () => ChikoritaTemplate)
		.with("ditto", () => DittoTemplate)
		.with("gengar", () => GengarTemplate)
		.with("glalie", () => GlalieTemplate)
		.with("kakuna", () => KakunaTemplate)
		.with("lapras", () => LaprasTemplate)
		.with("leafish", () => LeafishTemplate)
		.with("onyx", () => OnyxTemplate)
		.with("pikachu", () => PikachuTemplate)
		.with("rhyhorn", () => RhyhornTemplate)
		.exhaustive();
}

export const ResumePreview = ({ showPageNumbers, pageClassName, className, ...props }: Props) => {
	const picture = useResumeStore((state) => state.resume.data.picture);
	const metadata = useResumeStore((state) => state.resume.data.metadata);

	useWebfonts(metadata.typography);
	const style = useCSSVariables({ picture, metadata });
	const totalNumberOfPages = metadata.layout.pages.length;

	const iconProps = useMemo<IconProps>(() => {
		return {
			weight: "regular",
			color: "var(--page-primary-color)",
			size: metadata.typography.body.fontSize * 1.5,
		};
	}, [metadata.typography.body.fontSize]);

	const scopedCSS = useMemo(() => {
		if (!metadata.css.enabled || !metadata.css.value.trim()) return null;

		const css = metadata.css.value;
		// Simple approach: prefix each top-level selector with .resume-preview-container
		// This handles most common cases like .class-name, #id, element, etc.
		const scoped = css
			.split(/\n(?=\s*[.#a-zA-Z])/) // Split on newlines that start a new rule
			.map((rule) => {
				const trimmed = rule.trim();
				if (!trimmed || trimmed.startsWith("@")) return trimmed; // Keep @rules as-is

				// For each selector in the rule, prefix with .resume-preview-container
				return trimmed.replace(/^([^{]+)(\{)/, (_match, selectors, brace) => {
					// Split selectors by comma and prefix each
					const prefixed = selectors
						.split(",")
						.map((selector: string) => `.resume-preview-container ${selector.trim()} `)
						.join(", ");
					return `${prefixed}${brace}`;
				});
			})
			.join("\n");

		return scoped;
	}, [metadata.css.enabled, metadata.css.value]);

	return (
		<IconContext.Provider value={iconProps}>
			{/** biome-ignore lint/security/noDangerouslySetInnerHtml: it's okay */}
			{scopedCSS && <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />}

			<div style={style} className={cn("resume-preview-container", className)} {...props}>
				{metadata.layout.pages.map((pageLayout, pageIndex) => {
					const pageNumber = pageIndex + 1;
					const TemplateComponent = getTemplateComponent(metadata.template);

					return (
						<div key={pageIndex} className="relative">
							{showPageNumbers && totalNumberOfPages > 1 && (
								<div className="-top-6 absolute left-0">
									<span className="font-medium text-foreground text-xs">
										<Trans>
											Page {pageNumber} of {totalNumberOfPages}
										</Trans>
									</span>
								</div>
							)}

							<div
								className={cn(
									`page page-${pageIndex}`,
									pageIndex > 0 && "print:break-before-page",
									styles.page,
									pageClassName,
								)}
							>
								<TemplateComponent pageIndex={pageIndex} pageLayout={pageLayout} />
							</div>
						</div>
					);
				})}
			</div>
		</IconContext.Provider>
	);
};
