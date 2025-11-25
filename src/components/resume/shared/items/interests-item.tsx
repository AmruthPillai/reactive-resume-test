import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageIcon } from "../page-icon";

type InterestsItemProps = SectionItem<"interests"> & {
	className?: string;
};

export function InterestsItem({ className, ...item }: InterestsItemProps) {
	return (
		<div className={cn("interests-item", className)}>
			<div className="flex w-full gap-1.5">
				<PageIcon icon={item.icon} className="section-item-icon interests-item-icon mt-0.5 shrink-0" />
				<div>
					<p className="section-item-name interests-item-name">
						<strong>{item.name}</strong>
					</p>
					<p className="section-item-keywords interests-item-keywords opacity-60">{item.keywords.join(", ")}</p>
				</div>
			</div>
		</div>
	);
}

