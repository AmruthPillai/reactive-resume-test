import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	"space-y-1.5 [&>.section-content>ul]:space-y-1.5",
	"[&>h6]:border-(--page-primary-color) [&>h6]:border-b-2 [&>h6]:text-(--page-primary-color)",
	"group-data-[type=sidebar]:[&>h6]:border-(--page-background-color) group-data-[type=sidebar]:[&>h6]:text-(--page-background-color)",
);

/**
 * Template: Chikorita
 */
export function ChikoritaTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-chikorita page-content">
			{isFirstPage && <Header />}

			<div className="flex">
				<main data-type="main" className="group page-main grow space-y-4 px-(--page-margin-x) pb-(--page-margin-y)">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</main>

				{!fullWidth && (
					<aside
						data-type="sidebar"
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-4 overflow-x-hidden bg-(--page-primary-color) px-(--page-margin-x) pb-(--page-margin-y) text-(--page-background-color)"
					>
						{sidebar.map((section) => {
							const Component = getSectionComponent(section, { sectionClassName });
							return <Component key={section} id={section} />;
						})}
					</aside>
				)}
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header relative flex">
			<div className="flex items-center py-(--page-margin-y) pl-(--page-margin-x)">
				<PagePicture />

				<div className="flex flex-col gap-y-2 px-(--page-margin-x)">
					<div className="grow">
						<h2 className="page-name">{basics.name}</h2>
						<p className="page-headline">{basics.headline}</p>
					</div>

					<div className="flex grow flex-wrap items-center gap-x-2 gap-y-0.5">
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

			<div className="w-(--page-sidebar-width) shrink-0 bg-(--page-primary-color)" />
		</div>
	);
}
