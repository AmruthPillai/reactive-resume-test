import type { SectionItem, SectionType } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { useResumePreview } from "../hooks/use-resume-preview";

type PageSectionProps<T extends SectionType> = {
	type: T;
	className?: string;
	children: (item: SectionItem<T>) => React.ReactNode;
};

export function PageSection<T extends SectionType>({ type, className, children }: PageSectionProps<T>) {
	const section = useResumePreview((data) => data.sections[type]);

	return (
		<section
			className={cn(
				"page-section page-section-profiles",
				section.hidden && "hidden",
				section.items.length === 0 && "hidden",
				className,
			)}
		>
			<h5>{section.title}</h5>

			<ul className="grid gap-x-4 gap-y-2" style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}>
				{section.items.map((item) => (
					<li key={item.id}>{children(item)}</li>
				))}
			</ul>
		</section>
	);
}
