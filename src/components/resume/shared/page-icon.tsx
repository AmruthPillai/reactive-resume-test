import { IconContext } from "@phosphor-icons/react";
import { use } from "react";
import type { IconName } from "@/components/input/icon-picker";
import { cn } from "@/utils/style";

export function PageIcon({ icon }: { icon: IconName }) {
	const iconContext = use(IconContext);

	if (!icon) return null;

	return (
		<i
			className={cn("ph text-base", `ph-${icon}`)}
			style={{ fontSize: `${iconContext.size}px`, color: iconContext.color }}
		/>
	);
}
