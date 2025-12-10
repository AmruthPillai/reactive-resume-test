import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { SlideshowIcon } from "@phosphor-icons/react";
import { type RefObject, useRef } from "react";
import type z from "zod";
import { CometCard } from "@/components/animation/comet-card";
import { useResumeStore } from "@/components/resume/store/resume";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DialogProps } from "@/dialogs/store";
import type { templateSchema } from "@/schema/resume/data";

type Template = {
	id: z.infer<typeof templateSchema>;
	name: string;
	description: MessageDescriptor;
	imageUrl: string;
	tags: string[];
};

const templates: Template[] = [
	{
		id: "onyx",
		name: "Onyx",
		description: msg`A simple, single-column layout that works well for multiple pages, perfect for professionals with a lot of experience.`,
		imageUrl: "https://picsum.photos/800/1201",
		tags: ["Single Column", "Minimalist", "Monochrome", "Professional", "ATS Friendly"],
	},
	{
		id: "ditto",
		name: "Ditto",
		description: msg`A bold two-column layout with accent colors, featuring a sidebar for short sections and main content area for professional experience.`,
		imageUrl: "https://picsum.photos/800/1202",
		tags: ["Two Column", "Bold", "Modern", "Vibrant", "Left Aligned"],
	},
	{
		id: "bronzor",
		name: "Bronzor",
		description: msg`A clean and minimal single-column layout with a hint of color, suited for beginners with minimal experience.`,
		imageUrl: "https://picsum.photos/800/1203",
		tags: ["Single Column", "Minimalist", "Monochrome", "Professional", "ATS Friendly"],
	},
	{
		id: "chikorita",
		name: "Chikorita",
		description: msg`A clean and minimal two-column layout with a hint of color, suited for beginners with minimal experience.`,
		imageUrl: "https://picsum.photos/800/1203",
		tags: ["Two Column", "Minimalist", "Monochrome", "Professional", "ATS Friendly"],
	},
];

export function TemplateGalleryDialog({ open, onOpenChange }: DialogProps<"resume.template.gallery">) {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	function onSelectTemplate(template: z.infer<typeof templateSchema>) {
		updateResumeData((draft) => {
			draft.metadata.template = template;
		});
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="lg:max-w-5xl">
				<DialogHeader className="gap-2">
					<DialogTitle className="flex items-center gap-3 text-xl">
						<SlideshowIcon size={20} />
						<Trans>Template Gallery</Trans>
					</DialogTitle>
					<DialogDescription className="leading-relaxed">
						<Trans>
							Here's a range of resume templates for different professions and personalities. Whether you prefer modern
							or classic, bold or simple, there is a design to match you. Look through the options below and choose a
							template that fits your style.
						</Trans>
					</DialogDescription>
				</DialogHeader>

				<ScrollArea ref={scrollAreaRef} className="max-h-[80svh]">
					<div className="grid grid-cols-2 gap-6 p-4 md:grid-cols-3 lg:grid-cols-4">
						{templates.map((template) => (
							<TemplateCard
								key={template.id}
								template={template}
								collisionBoundary={scrollAreaRef}
								onSelect={onSelectTemplate}
							/>
						))}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}

type TemplateCardProps = {
	template: Template;
	collisionBoundary: RefObject<HTMLDivElement | null>;
	onSelect: (template: z.infer<typeof templateSchema>) => void;
};

function TemplateCard({ template, collisionBoundary, onSelect }: TemplateCardProps) {
	const { i18n } = useLingui();

	return (
		<HoverCard openDelay={0} closeDelay={0}>
			<CometCard translateDepth={3} rotateDepth={6}>
				<HoverCardTrigger>
					<button
						tabIndex={-1}
						onClick={() => onSelect(template.id)}
						className="block aspect-page size-full cursor-pointer overflow-hidden rounded-md bg-popover outline-none focus:ring-2 focus:ring-ring"
					>
						<img src={template.imageUrl} alt={template.name} className="size-full object-cover" />
					</button>
				</HoverCardTrigger>

				<HoverCardContent
					side="right"
					sideOffset={-32}
					align="start"
					alignOffset={32}
					collisionBoundary={collisionBoundary.current}
					className="pointer-events-none! flex w-80 flex-col justify-between space-y-8 rounded-md bg-background/80 p-4 pb-6"
				>
					<div className="space-y-1">
						<h3 className="font-semibold text-lg">{template.name}</h3>
						<p className="text-muted-foreground">{i18n.t(template.description)}</p>
					</div>

					<div className="flex flex-wrap gap-2">
						{template.tags
							.sort((a, b) => a.localeCompare(b))
							.map((tag) => (
								<Badge key={tag} variant="default">
									{tag}
								</Badge>
							))}
					</div>
				</HoverCardContent>
			</CometCard>
		</HoverCard>
	);
}
