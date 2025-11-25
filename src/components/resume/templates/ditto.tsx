import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn("space-y-1 [&>.section-content>ul]:space-y-1 [&>h6]:text-(--page-primary-color)");

/**
 * Template: Ditto
 */
export function DittoTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-ditto page-content">
			{isFirstPage && <Header />}

			<div className="flex py-(--page-margin-y)">
				{!fullWidth && (
					<aside className="page-sidebar w-(--page-sidebar-width) shrink-0 space-y-4 overflow-x-hidden pl-(--page-margin-x)">
						{sidebar.map((section) => {
							const Component = getSectionComponent(section, { sectionClassName });
							return <Component key={section} id={section} />;
						})}
					</aside>
				)}

				<main className="page-main grow space-y-4 px-(--page-margin-x)">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</main>
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header relative">
			<div className="bg-(--page-primary-color) text-(--page-background-color)">
				<div className="flex items-center">
					<div className="flex w-(--page-sidebar-width) shrink-0 justify-center pl-(--page-margin-x)">
						<PagePicture className="absolute top-8" />
					</div>

					<div className="grow px-(--page-margin-x) py-(--page-margin-y)">
						<h2 className="page-name">{basics.name}</h2>
						<p className="page-headline">{basics.headline}</p>
					</div>
				</div>
			</div>

			<div className="flex items-center">
				<div className="w-(--page-sidebar-width) shrink-0" />

				<div className="flex grow flex-wrap items-center gap-x-3 gap-y-1 px-(--page-margin-x) pt-3">
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
