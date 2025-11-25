import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLevel } from "../page-level";

type LanguagesItemProps = SectionItem<"languages"> & {
	className?: string;
};

export function LanguagesItem({ className, ...item }: LanguagesItemProps) {
	return (
		<div className={cn("languages-item", className)}>
			<div className="w-full">
				<p className="section-item-name languages-item-name">
					<strong>{item.language}</strong>
				</p>
				<p className="section-item-fluency languages-item-fluency opacity-60">{item.fluency}</p>
				<div className="section-item-level languages-item-level mt-1.5">
					<PageLevel level={item.level} />
				</div>
			</div>
		</div>
	);
}

