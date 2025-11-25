import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageIcon } from "../page-icon";
import { PageLink } from "../page-link";

type ProfilesItemProps = SectionItem<"profiles"> & {
	className?: string;
};

export function ProfilesItem({ className, ...item }: ProfilesItemProps) {
	return (
		<div className={cn("profiles-item", className)}>
			<div className="flex gap-1.5">
				<PageIcon icon={item.icon} className="section-item-icon profiles-item-icon mt-0.5 shrink-0" />
				<div className="w-full">
					<p className="section-item-network profiles-item-network">
						<strong>{item.network}</strong>
					</p>
					<div className="section-item-link profiles-item-link">
						<PageLink {...item.website} label={item.website.label || item.username} className="block" />
					</div>
				</div>
			</div>
		</div>
	);
}
