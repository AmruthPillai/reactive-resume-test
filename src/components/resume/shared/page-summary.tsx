import { TiptapContent } from "@/components/input/rich-input";
import { getSectionTitle } from "@/utils/resume/section";
import { cn } from "@/utils/style";
import { useResumePreview } from "../hooks/use-resume-preview";

type PageSummaryProps = {
	className?: string;
};

export function PageSummary({ className }: PageSummaryProps) {
	const section = useResumePreview((data) => data.summary);

	return (
		<section
			className={cn(
				"page-section page-section-summary",
				section.hidden && "hidden",
				section.content === "" && "hidden",
				className,
			)}
		>
			<h6>{section.title || getSectionTitle("summary")}</h6>

			<TiptapContent style={{ columnCount: section.columns }} content={section.content} />
		</section>
	);
}
