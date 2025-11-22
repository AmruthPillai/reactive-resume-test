import { t } from "@lingui/core/macro";
import type z from "zod";
import type { levelDesignSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageIcon } from "../resume/shared/page-icon";

type Props = z.infer<typeof levelDesignSchema> & {
	level: number;
	className?: string;
};

export function LevelDisplay({ icon, type, level, className }: Props) {
	if (level === 0) return null;
	if (type === "hidden") return null;

	return (
		<div
			role="presentation"
			aria-label={t`Level ${level} of 5`}
			className={cn(
				"flex items-center gap-x-1.5",
				type === "progress-bar" && "gap-x-0",
				type === "rectangle-full" && "gap-x-2",
				className,
			)}
		>
			{Array.from({ length: 5 }).map((_, index) => {
				const isActive = index < level;

				if (type === "progress-bar") {
					return (
						<div
							key={index}
							className={cn(
								"h-2.5 flex-1 shrink-0 border border-(--page-primary-color) border-x-0 first:border-l last:border-r",
								isActive && "bg-(--page-primary-color)",
							)}
						/>
					);
				}

				if (type === "icon") {
					return (
						<PageIcon
							key={index}
							icon={icon}
							className={cn("h-3 overflow-visible text-(--page-primary-color)", !isActive && "opacity-40")}
						/>
					);
				}

				return (
					<div
						key={index}
						className={cn(
							"size-2.5 border border-(--page-primary-color)",
							isActive && "bg-(--page-primary-color)",
							type === "circle" && "rounded-full",
							type === "rectangle" && "w-7",
							type === "rectangle-full" && "w-auto flex-1",
						)}
					/>
				);
			})}
		</div>
	);
}
