import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { PageSummary } from "../shared/page-summary";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	"space-y-1.5 [&>.section-content>ul]:space-y-1.5",
	"[&>h6]:border-(--page-primary-color) [&>h6]:border-b [&>h6]:text-(--page-text-color)",
);

/**
 * Template: Gengar
 */
export function GengarTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-gengar page-content">
			<div className="flex">
				<div className="flex w-(--page-sidebar-width) shrink-0 flex-col">
					{isFirstPage && <Header />}

					{!fullWidth && (
						<aside
							data-type="sidebar"
							className="group page-sidebar shrink-0 space-y-4 overflow-x-hidden bg-(--page-primary-color)/20 px-(--page-margin-x) py-(--page-margin-y)"
						>
							{sidebar
								.filter((section) => section !== "summary")
								.map((section) => {
									const Component = getSectionComponent(section, { sectionClassName });
									return <Component key={section} id={section} />;
								})}
						</aside>
					)}
				</div>

				<main data-type="main" className="group page-main grow">
					{isFirstPage && (
						<PageSummary
							className={cn(
								sectionClassName,
								"bg-(--page-primary-color)/20 px-(--page-margin-x) py-(--page-margin-y) [&>h6]:hidden",
							)}
						/>
					)}

					<div className="px-(--page-margin-x) py-(--page-margin-y)">
						{main
							.filter((section) => section !== "summary")
							.map((section) => {
								const Component = getSectionComponent(section, { sectionClassName });
								return <Component key={section} id={section} />;
							})}
					</div>
				</main>
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header relative flex">
			<div className="flex w-full shrink-0 flex-col justify-center bg-(--page-primary-color) px-(--page-margin-x) py-(--page-margin-y) text-(--page-background-color)">
				<PagePicture />

				<div className="grow">
					<h2 className="page-name">{basics.name}</h2>
					<p className="page-headline">{basics.headline}</p>
				</div>

				<div
					className="mt-3 flex flex-col gap-y-1"
					style={{ "--page-primary-color": "var(--page-background-color)" } as React.CSSProperties}
				>
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
