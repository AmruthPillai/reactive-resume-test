import { CaretRightIcon } from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { useSectionStore } from "@/builder/-store/section";
import { Button } from "@/components/ui/button";
import { getSectionIcon, getSectionTitle, type RightSidebarSection } from "@/utils/resume/section";
import { cn } from "@/utils/style";

type Props = React.ComponentProps<typeof AccordionContent> & {
	type: RightSidebarSection;
};

export function SectionBase({ type, className, ...props }: Props) {
	const collapsed = useSectionStore((state) => state.sections[type]?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);

	return (
		<Accordion
			collapsible
			type="single"
			className="space-y-4"
			id={`sidebar-${type}`}
			value={collapsed ? "" : type}
			onValueChange={() => toggleCollapsed(type)}
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
						<h2 className="line-clamp-1 font-bold text-2xl tracking-tight">{getSectionTitle(type)}</h2>
					</div>
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
