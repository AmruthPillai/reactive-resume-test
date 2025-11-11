import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useResumeData } from "@/builder/-hooks/resume";
import { Button } from "@/components/ui/button";
import { useSectionStore } from "@/routes/builder/$resumeId/-store/section";
import type { SectionType } from "@/schema/resume/data";
import { getSectionIcon } from "@/utils/resume/section";
import { cn } from "@/utils/style";
import { SectionMask } from "./section-mask";
import { SectionDropdownMenu } from "./section-menu";

type Props = React.ComponentProps<"div"> & {
	type: SectionType;
	children: React.ReactNode;
};

export function SectionBase({ type, className, children, ...props }: Props) {
	const section = useResumeData((state) => state.sections[type]);

	const collapsed = useSectionStore((state) => state.sections[type]?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);

	return (
		<div id={`sidebar-${type}`} className={cn("space-y-4", className)} {...props}>
			<div className="flex items-center">
				<Button size="icon" variant="ghost" className="mr-1.5" onClick={() => toggleCollapsed(type)}>
					<CaretDownIcon className={cn("transition-transform", collapsed && "-rotate-90")} />
				</Button>

				<div className="flex flex-1 items-center gap-x-4">
					{getSectionIcon(type)}
					<h2 className="line-clamp-1 font-bold text-2xl tracking-tight">{section.title}</h2>
				</div>

				<SectionDropdownMenu type={type} />
			</div>

			<AnimatePresence>
				{!collapsed && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
						className="relative flex flex-col gap-4"
					>
						<SectionMask hidden={section.hidden} />

						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
