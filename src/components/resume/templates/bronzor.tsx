import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	"grid grid-cols-5 border-(--page-primary-color) border-t pt-2 [&>.section-content>ul]:space-y-1 [&>.section-content]:col-span-4 [&>h6]:text-(--page-primary-color)",
);

/**
 * Template: Bronzor
 */
export function BronzorTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-bronzor page-content px-(--page-margin-x) py-(--page-margin-y)">
			{isFirstPage && <Header />}

			<div className="space-y-4">
				<main className="page-main space-y-4">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</main>

				{!fullWidth && (
					<aside className="page-sidebar space-y-4">
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
		<div className="page-header mb-2 flex flex-col items-center gap-y-2 border-(--page-primary-color)">
			<PagePicture />

			{/* Basics */}
			<div className="page-basics flex flex-col gap-y-2 text-center">
				<div>
					<h2 className="page-name font-bold leading-snug!">{basics.name}</h2>
					<p className="page-headline leading-snug!">{basics.headline}</p>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5">
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
