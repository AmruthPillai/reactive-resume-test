import { Fragment, useCallback, useRef } from "react";
import { match } from "ts-pattern";
import { useBuilderSidebar } from "@/builder/-store/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	getSectionIcon,
	getSectionTitle,
	type RightSidebarSection,
	rightSidebarSections,
} from "@/utils/resume/section";
import { BuilderSidebarEdge } from "../../-components/edge";
import { LayoutSectionBuilder } from "./sections/layout";
import { TemplateSectionBuilder } from "./sections/template";
import { ThemeSectionBuilder } from "./sections/theme";
import { TypographySectionBuilder } from "./sections/typography";

function getSectionComponent(type: RightSidebarSection) {
	return match(type)
		.with("template", () => <TemplateSectionBuilder />)
		.with("layout", () => <LayoutSectionBuilder />)
		.with("typography", () => <TypographySectionBuilder />)
		.with("theme", () => <ThemeSectionBuilder />)
		.exhaustive();
}

export function BuilderSidebarRight() {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	return (
		<>
			<SidebarEdge scrollAreaRef={scrollAreaRef} />

			<ScrollArea ref={scrollAreaRef} className="@container h-full sm:mr-12">
				<div className="space-y-4 p-4">
					{rightSidebarSections.map((section) => (
						<Fragment key={section}>
							{getSectionComponent(section)}
							<Separator />
						</Fragment>
					))}
				</div>
			</ScrollArea>
		</>
	);
}

type SidebarEdgeProps = {
	scrollAreaRef: React.RefObject<HTMLDivElement | null>;
};

function SidebarEdge({ scrollAreaRef }: SidebarEdgeProps) {
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	const scrollToSection = useCallback(
		(section: RightSidebarSection) => {
			if (!scrollAreaRef.current) return;
			toggleSidebar("right", true);

			const sectionElement = scrollAreaRef.current.querySelector(`#sidebar-${section}`);
			sectionElement?.scrollIntoView({ behavior: "smooth" });
		},
		[toggleSidebar, scrollAreaRef],
	);

	return (
		<BuilderSidebarEdge side="right">
			<div />

			<div className="flex flex-col justify-center gap-y-2">
				{rightSidebarSections.map((section) => (
					<Button
						key={section}
						size="icon"
						variant="ghost"
						title={getSectionTitle(section)}
						onClick={() => scrollToSection(section)}
					>
						{getSectionIcon(section)}
					</Button>
				))}
			</div>

			<div />
		</BuilderSidebarEdge>
	);
}
