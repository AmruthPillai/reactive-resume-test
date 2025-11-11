import { useCallback, useRef } from "react";
import { useBuilderSidebar } from "@/builder/-context/builder";
import { useResumeData } from "@/builder/-hooks/resume";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import type { SectionType } from "@/schema/resume/data";
import { getSectionIcon, getSectionTitle } from "@/utils/resume/section";
import { getInitials } from "@/utils/string";
import { BuilderSidebarEdge } from "../edge";
import { AwardsSectionBuilder } from "./sections/awards";
import { BasicsSectionBuilder } from "./sections/basics";
import { CertificationsSectionBuilder } from "./sections/certifications";
import { EducationSectionBuilder } from "./sections/education";
import { ExperienceSectionBuilder } from "./sections/experience";
import { InterestsSectionBuilder } from "./sections/interests";
import { LanguagesSectionBuilder } from "./sections/languages";
import { ProfilesSectionBuilder } from "./sections/profiles";
import { ProjectsSectionBuilder } from "./sections/projects";
import { PublicationsSectionBuilder } from "./sections/publications";
import { ReferencesSectionBuilder } from "./sections/references";
import { SkillsSectionBuilder } from "./sections/skills";
import { SummarySectionBuilder } from "./sections/summary";
import { VolunteerSectionBuilder } from "./sections/volunteer";

export function BuilderSidebarLeft() {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	const sections = useResumeData((data) => data.sections);
	const { leftSidebar, toggleLeftSidebar } = useBuilderSidebar();

	const scrollToSection = useCallback(
		(section: "basics" | "summary" | SectionType) => {
			if (!scrollAreaRef.current || !leftSidebar.current) return;

			if (leftSidebar.current.isCollapsed()) toggleLeftSidebar();

			const sectionElement = scrollAreaRef.current.querySelector(`#sidebar-${section}`);
			sectionElement?.scrollIntoView({ behavior: "smooth" });
		},
		[leftSidebar, toggleLeftSidebar],
	);

	return (
		<>
			<BuilderSidebarEdge side="left">
				<div />

				<div className="flex flex-col justify-center gap-y-2">
					<Button
						size="icon"
						variant="ghost"
						title={getSectionTitle("basics")}
						onClick={() => scrollToSection("basics")}
					>
						{getSectionIcon("basics")}
					</Button>

					<Button
						size="icon"
						variant="ghost"
						title={getSectionTitle("summary")}
						onClick={() => scrollToSection("summary")}
					>
						{getSectionIcon("summary")}
					</Button>

					{Object.entries(sections).map(([key, section]) => (
						<Button
							key={key}
							size="icon"
							variant="ghost"
							title={section.title}
							onClick={() => scrollToSection(key as SectionType)}
						>
							{getSectionIcon(key as SectionType)}
						</Button>
					))}
				</div>

				<UserDropdownMenu>
					{({ session }) => (
						<Button size="icon" variant="ghost">
							<Avatar className="size-6">
								<AvatarImage src={session.user.image ?? undefined} />
								<AvatarFallback className="text-[0.5rem]">{getInitials(session.user.name)}</AvatarFallback>
							</Avatar>
						</Button>
					)}
				</UserDropdownMenu>
			</BuilderSidebarEdge>

			<ScrollArea ref={scrollAreaRef} className="@container h-full sm:ml-12">
				<div className="flex flex-col space-y-4 p-4">
					<BasicsSectionBuilder />
					<Separator />
					<SummarySectionBuilder />
					<Separator />
					<ProfilesSectionBuilder />
					<Separator />
					<ExperienceSectionBuilder />
					<Separator />
					<EducationSectionBuilder />
					<Separator />
					<ProjectsSectionBuilder />
					<Separator />
					<SkillsSectionBuilder />
					<Separator />
					<LanguagesSectionBuilder />
					<Separator />
					<InterestsSectionBuilder />
					<Separator />
					<AwardsSectionBuilder />
					<Separator />
					<CertificationsSectionBuilder />
					<Separator />
					<PublicationsSectionBuilder />
					<Separator />
					<VolunteerSectionBuilder />
					<Separator />
					<ReferencesSectionBuilder />
				</div>
			</ScrollArea>
		</>
	);
}
