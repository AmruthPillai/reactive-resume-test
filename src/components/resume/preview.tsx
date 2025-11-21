import { IconContext, type IconProps } from "@phosphor-icons/react";
import { useMemo } from "react";
import type { ResumeData } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { ResumePreviewProvider } from "./hooks/use-resume-preview";
import styles from "./preview.module.css";
import { OnyxTemplate } from "./templates/onyx";

type Props = {
	data: ResumeData;
	className?: string;
	pageClassName?: string;
};

export const ResumePreview = ({ data, className, pageClassName }: Props) => {
	const iconProps = useMemo<IconProps>(() => {
		return {
			weight: "regular",
			color: "var(--page-primary-color)",
			size: data.metadata.typography.body.fontSize * 1.5,
		};
	}, [data.metadata.typography.body.fontSize]);

	return (
		<IconContext.Provider value={iconProps}>
			<ResumePreviewProvider data={data}>
				<div className={cn("flex flex-col gap-8", className)}>
					{data.metadata.layout.pages.map((pageLayout, pageIndex) => (
						<div key={pageIndex} className={cn("page", `page-${pageIndex}`, styles.page_preview, pageClassName)}>
							<OnyxTemplate pageIndex={pageIndex} pageLayout={pageLayout} />
						</div>
					))}
				</div>
			</ResumePreviewProvider>
		</IconContext.Provider>
	);
};
