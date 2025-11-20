import { IconContext } from "@phosphor-icons/react";
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
	return (
		<IconContext.Provider
			value={{ size: data.metadata.typography.body.fontSize * 1.5, color: "var(--page-primary-color)" }}
		>
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
