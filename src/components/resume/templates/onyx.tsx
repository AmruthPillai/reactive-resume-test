import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import type z from "zod";
import { TiptapContent } from "@/components/input/rich-input";
import type { pageLayoutSchema } from "@/schema/resume/data";
import { isValidUrl } from "@/utils/string";
import { cn } from "@/utils/style";
import { useResumePreview } from "../hooks/use-resume-preview";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { PageSection } from "../shared/page-section";
import { PageSummary } from "../shared/page-summary";

type TemplateProps = {
	pageIndex: number;
	pageLayout: z.infer<typeof pageLayoutSchema>;
};

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

			<main className="page-main space-y-2">
				{main.map((section) => {
					if (section === "profiles") return <ProfilesSection key={section} />;
					if (section === "summary") return <SummarySection key={section} />;
					if (section === "experience") return <ExperienceSection key={section} />;

					return (
						<section key={section} className={cn("page-section", `page-section-${section}`)}>
							<h5 className="text-(--page-primary-color) capitalize">{section}</h5>

							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam inventore fugiat, numquam, corporis
								culpa, explicabo dolorem ullam tempore vero sit nam libero fuga ipsum quia iure totam porro voluptate
								et? Ex provident nulla sit at dolorem iste quasi, repellat quisquam esse iusto animi explicabo placeat
								officia veniam tempore fugit sint aliquam quae ipsa debitis nihil ab! Natus, sit cumque. Magni. Impedit
								debitis expedita maxime itaque molestias qui, quia a nulla eum. Officia quibusdam odio id laboriosam
								adipisci magni autem cumque praesentium nostrum et eligendi, quae harum, suscipit modi eum. Culpa.
							</p>
						</section>
					);
				})}
			</main>

			<aside className="page-sidebar space-y-2">
				{sidebar.map((section) => (
					<section key={section}>
						<h5 className="text-(--page-primary-color) capitalize">{section}</h5>

						<p>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam inventore fugiat, numquam, corporis culpa,
							explicabo dolorem ullam tempore vero sit nam libero fuga ipsum quia iure totam porro voluptate et? Ex
							provident nulla sit at dolorem iste quasi, repellat quisquam esse iusto animi explicabo placeat officia
							veniam tempore fugit sint aliquam quae ipsa debitis nihil ab! Natus, sit cumque. Magni. Impedit debitis
							expedita maxime itaque molestias qui, quia a nulla eum. Officia quibusdam odio id laboriosam adipisci
							magni autem cumque praesentium nostrum et eligendi, quae harum, suscipit modi eum. Culpa.
						</p>
					</section>
				))}
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
			<div className="page-basics flex flex-col gap-y-2">
				<div>
					<h2 className="page-name font-bold leading-snug!">{basics.name}</h2>
					<p className="page-headline leading-snug!">{basics.headline}</p>
				</div>

				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
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

					{basics.website && (
						<div className="flex items-center gap-x-1.5">
							<GlobeIcon />
							<PageLink {...basics.website} />
						</div>
					)}

					{basics.customFields.map((field) => (
						<div key={field.id} className="flex items-center gap-x-1.5">
							<PageIcon icon={field.icon} />
							<PageLink url={isValidUrl(field.text) || ""} label={field.text} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function ProfilesSection() {
	return (
		<PageSection type="profiles" className="space-y-1 [&>h5]:text-(--page-primary-color)">
			{(item) => (
				<div key={item.id} className="flex items-center gap-1.5">
					<PageIcon icon={item.icon} />
					<PageLink {...item.website} label={item.website.label || item.username} />
				</div>
			)}
		</PageSection>
	);
}

export function SummarySection() {
	return <PageSummary className="space-y-1 [&>h5]:text-(--page-primary-color)" />;
}

export function ExperienceSection() {
	return (
		<PageSection type="experience" className="space-y-1 [&>h5]:text-(--page-primary-color) [&>ul]:space-y-2">
			{(item) => (
				<div key={item.id}>
					<div className="mb-2">
						<div className="flex items-center justify-between">
							<PageLink {...item.website} label={item.website.label || item.company} />
							<div>{item.location}</div>
						</div>
						<div className="flex items-center justify-between">
							<div>{item.position}</div>
							<div>{item.period}</div>
						</div>
					</div>

					<TiptapContent content={item.description} />
				</div>
			)}
		</PageSection>
	);
}
