import { CaretRightIcon } from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { useResumeData } from "@/builder/-hooks/resume";
import { Button } from "@/components/ui/button";
import { useSectionStore } from "@/routes/builder/$resumeId/-store/section";
import type { SectionType } from "@/schema/resume/data";
import { getSectionIcon, getSectionTitle, type LeftSidebarSection } from "@/utils/resume/section";
import { cn } from "@/utils/style";
import { SectionDropdownMenu } from "./section-menu";

type Props = React.ComponentProps<typeof AccordionContent> & {
	type: LeftSidebarSection;
};

export function SectionBase({ type, className, ...props }: Props) {
	const section = useResumeData((state) => {
		if (type === "basics") return state.basics;
		if (type === "summary") return state.summary;
		if (type === "picture") return state.picture;
		if (type === "custom") return state.customSections;
		return state.sections[type];
	});

	const isHidden = "hidden" in section && section.hidden;
	const collapsed = useSectionStore((state) => state.sections[type]?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);

	return (
		<Accordion
			collapsible
			type="single"
			id={`sidebar-${type}`}
			value={collapsed ? "" : type}
			onValueChange={() => toggleCollapsed(type)}
			className={cn("space-y-4", isHidden && "opacity-50")}
		>
			<AccordionItem value={type} className="group/accordion space-y-4">
				<div className="flex items-center">
					<AccordionTrigger asChild>
						<Button size="icon" variant="ghost" className="mr-1.5 [&>svg]:group-data-[state=open]/accordion:rotate-90">
							<CaretRightIcon className="transition-transform" />
						</Button>
					</AccordionTrigger>

					<div className="flex flex-1 items-center gap-x-4">
						{getSectionIcon(type)}
						<h2 className="line-clamp-1 font-bold text-2xl tracking-tight">
							{"title" in section ? section.title : getSectionTitle(type)}
						</h2>
					</div>

					{!["picture", "basics", "custom"].includes(type) && (
						<SectionDropdownMenu type={type as "summary" | SectionType} />
					)}
				</div>

				<AccordionContent
					className={cn(
						"overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
						className,
					)}
					{...props}
				/>
			</AccordionItem>
		</Accordion>
	);
}
