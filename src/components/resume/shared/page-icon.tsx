import { IconContext } from "@phosphor-icons/react";
import { use } from "react";
import type { IconName } from "@/schema/icons";
import { cn } from "@/utils/style";

export function PageIcon({ icon, className }: { icon: IconName; className?: string }) {
	const iconContext = use(IconContext);

	if (!icon) return null;

	return (
		<i
			className={cn("ph", `ph-${icon}`, className)}
			style={{ fontSize: `${iconContext.size}px`, color: iconContext.color }}
		/>
	);
}
