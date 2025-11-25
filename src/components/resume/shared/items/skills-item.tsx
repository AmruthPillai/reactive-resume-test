import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageIcon } from "../page-icon";
import { PageLevel } from "../page-level";

type SkillsItemProps = SectionItem<"skills"> & {
	className?: string;
};

export function SkillsItem({ className, ...item }: SkillsItemProps) {
	return (
		<div className={cn("skills-item", className)}>
			<div className="flex gap-1.5">
				<PageIcon icon={item.icon} className="section-item-icon skills-item-icon mt-0.5 shrink-0" />
				<div className="w-full">
					<p className="section-item-name skills-item-name">
						<strong>{item.name}</strong>
					</p>
					<p className="section-item-proficiency skills-item-proficiency opacity-60">{item.proficiency}</p>
					<small className="section-item-keywords skills-item-keywords">{item.keywords.join(", ")}</small>
					<div className="section-item-level skills-item-level mt-1.5">
						<PageLevel level={item.level} />
					</div>
				</div>
			</div>
		</div>
	);
}
