import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { match } from "ts-pattern";
import type z from "zod";
import { TiptapContent } from "@/components/input/rich-input";
import type { pageLayoutSchema, SectionType } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { useResumePreview } from "../hooks/use-resume-preview";
import { PageIcon } from "../shared/page-icon";
import { PageLevel } from "../shared/page-level";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { PageSection } from "../shared/page-section";
import { PageSummary } from "../shared/page-summary";

type TemplateProps = {
	pageIndex: number;
	pageLayout: z.infer<typeof pageLayoutSchema>;
};

function getSectionComponent(section: "summary" | SectionType | (string & {})) {
	return match(section)
		.with("summary", () => <SummarySection />)
		.with("profiles", () => <ProfilesSection />)
		.with("experience", () => <ExperienceSection />)
		.with("education", () => <EducationSection />)
		.with("projects", () => <ProjectsSection />)
		.with("skills", () => <SkillsSection />)
		.with("languages", () => <LanguagesSection />)
		.with("interests", () => <InterestsSection />)
		.with("awards", () => <AwardsSection />)
		.with("certifications", () => <CertificationsSection />)
		.with("publications", () => <PublicationsSection />)
		.with("volunteer", () => <VolunteerSection />)
		.with("references", () => <ReferencesSection />)
		.otherwise((section) => <CustomSection id={section} />);
}

/**
 * Template: Onyx
 * Supports Sidebar: No
 *
 * Tags: [ATS Friendly, Monochrome, Single Column, Multi-Page Resumes]
 */
export function OnyxTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar } = pageLayout;

	return (
		<div className={cn("template-onyx page-content", "px-(--page-margin-x) py-(--page-margin-y)")}>
			{isFirstPage && <Header />}

			<main className="page-main space-y-4">
				{main.map((section) => getSectionComponent(section as "summary" | SectionType))}
			</main>

			<aside className="page-sidebar space-y-4">
				{sidebar.map((section) => getSectionComponent(section as "summary" | SectionType))}
			</aside>
		</div>
	);
}

function Header() {
	const basics = useResumePreview((data) => data.basics);

	return (
		<div className="page-header mb-2 flex items-center gap-x-4 border-(--page-primary-color) border-b pb-(--page-margin-y)">
			<PagePicture />

			{/* Basics */}
			<div className="page-basics flex flex-col gap-y-1.5">
				<div>
					<h2 className="page-name font-bold leading-snug!">{basics.name}</h2>
					<p className="page-headline leading-snug!">{basics.headline}</p>
				</div>

				<div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
					{basics.email && (
						<div className="flex items-center gap-x-1.5">
							<EnvelopeIcon />
							<PageLink url={`mailto:${basics.email}`} label={basics.email} />
						</div>
					)}

					{basics.phone && (
						<div className="flex items-center gap-x-1.5">
							<PhoneIcon />
							<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
						</div>
					)}

					{basics.location && (
						<div className="flex items-center gap-x-1.5">
							<MapPinIcon />
							<span>{basics.location}</span>
						</div>
					)}

					{basics.website.url && (
						<div className="flex items-center gap-x-1.5">
							<GlobeIcon />
							<PageLink {...basics.website} />
						</div>
					)}

					{basics.customFields.map((field) => (
						<div key={field.id} className="flex items-center gap-x-1.5">
							<PageIcon icon={field.icon} />
							<span>{field.text}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function SummarySection() {
	return <PageSummary className="space-y-1 [&>h6]:text-(--page-primary-color)" />;
}

export function ProfilesSection() {
	return (
		<PageSection type="profiles" className="space-y-1 [&>h6]:text-(--page-primary-color)">
			{(item) => (
				<div key={item.id} className="flex gap-1.5">
					<PageIcon icon={item.icon} className="mt-0.5 shrink-0" />
					<div className="w-full">
						<p>
							<strong>{item.network}</strong>
						</p>
						<PageLink {...item.website} label={item.website.label || item.username} className="block" />
					</div>
				</div>
			)}
		</PageSection>
	);
}

export function ExperienceSection() {
	return (
		<PageSection type="experience" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.company}</strong>
							</p>
							<p>{item.location}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.position}</p>
							<p>{item.period}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function EducationSection() {
	return (
		<PageSection type="education" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div className="mb-2">
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.school}</strong>
							</p>
							<p>{[item.degree, item.grade].filter(Boolean).join(" • ")}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.area}</p>
							<p>{[item.location, item.period].filter(Boolean).join(" • ")}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function ProjectsSection() {
	return (
		<PageSection type="projects" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div className="flex items-center justify-between">
						<p>
							<strong>{item.name}</strong>
						</p>
						<p>{item.period}</p>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function SkillsSection() {
	return (
		<PageSection type="skills" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="flex gap-1.5">
					<PageIcon icon={item.icon} className="mt-0.5 shrink-0" />
					<div className="w-full">
						<p>
							<strong>{item.name}</strong>
						</p>
						<p className="opacity-60">{item.proficiency}</p>
						<small>{item.keywords.join(", ")}</small>
						<PageLevel level={item.level} className="mt-1.5" />
					</div>
				</div>
			)}
		</PageSection>
	);
}

export function LanguagesSection() {
	return (
		<PageSection type="languages" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="w-full">
					<p>
						<strong>{item.language}</strong>
					</p>
					<p className="opacity-60">{item.fluency}</p>
					<PageLevel level={item.level} className="mt-1.5" />
				</div>
			)}
		</PageSection>
	);
}

export function InterestsSection() {
	return (
		<PageSection type="interests" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="flex w-full gap-1.5">
					<PageIcon icon={item.icon} className="mt-0.5 shrink-0" />
					<div>
						<p>
							<strong>{item.name}</strong>
						</p>
						<p className="opacity-60">{item.keywords.join(", ")}</p>
					</div>
				</div>
			)}
		</PageSection>
	);
}

export function AwardsSection() {
	return (
		<PageSection type="awards" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.title}</strong>
							</p>
							<p>{item.date}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.awarder}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function CertificationsSection() {
	return (
		<PageSection type="certifications" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.title}</strong>
							</p>
							<p>{item.date}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.issuer}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function PublicationsSection() {
	return (
		<PageSection type="publications" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.title}</strong>
							</p>
							<p>{item.date}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.publisher}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function VolunteerSection() {
	return (
		<PageSection type="volunteer" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<div>
						<div className="flex items-center justify-between">
							<p>
								<strong>{item.organization}</strong>
							</p>
							<p>{item.period}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>{item.location}</p>
						</div>
					</div>
					<TiptapContent content={item.description} />
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</PageSection>
	);
}

export function ReferencesSection() {
	return (
		<PageSection type="references" className="space-y-1 [&>h6]:text-(--page-primary-color) [&>ul]:space-y-1">
			{(item) => (
				<div key={item.id} className="space-y-1">
					<p>
						<strong>{item.name}</strong>
					</p>
					<TiptapContent content={item.description} />
				</div>
			)}
		</PageSection>
	);
}

export function CustomSection({ id }: { id: string }) {
	const section = useResumePreview((data) => data.customSections.find((section) => section.id === id));

	if (!section) return null;

	return (
		<section
			className={cn(
				`page-section page-custom-section page-section-${id}`,
				section.hidden && "hidden",
				section.content === "" && "hidden",
				"space-y-1 [&>h6]:text-(--page-primary-color)",
			)}
		>
			<h6>{section.title}</h6>
			<TiptapContent content={section.content} />
		</section>
	);
}
