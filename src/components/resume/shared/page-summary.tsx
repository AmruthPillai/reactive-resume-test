import { TiptapContent } from "@/components/input/rich-input";
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
			<h5>{section.title}</h5>

			<TiptapContent style={{ columnCount: section.columns }} content={section.content} />
		</section>
	);
}
