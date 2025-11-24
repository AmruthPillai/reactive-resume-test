import { Trans } from "@lingui/react/macro";
import { SlideshowIcon } from "@phosphor-icons/react";
import { CometCard } from "@/components/animation/comet-card";
import { useResumeStore } from "@/components/resume/store/resume";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/dialogs/store";
import { SectionBase } from "../shared/section-base";

export function TemplateSectionBuilder() {
	return (
		<SectionBase type="template">
			<TemplateSectionForm />
		</SectionBase>
	);
}

const sampleTags = ["Two Column", "ATS Friendly", "Modern", "Minimalist", "Clean", "Professional"];

function TemplateSectionForm() {
	const openDialog = useDialogStore((state) => state.openDialog);
	const template = useResumeStore((state) => state.resume.data.metadata.template);

	const onOpenTemplateGallery = () => {
		openDialog("resume.template.gallery", undefined);
	};

	return (
		<div className="flex @md:flex-row flex-col items-stretch gap-x-4 gap-y-2 p-4 pr-0">
			<CometCard translateDepth={3} rotateDepth={6} className="w-40 shrink-0">
				<div className="aspect-page size-full overflow-hidden rounded-md">
					<img src="https://picsum.photos/800/1200" alt={template} className="size-full object-cover" />
				</div>
			</CometCard>

			<div className="flex flex-1 flex-col space-y-4 @md:pt-1 @md:pb-3">
				<div className="space-y-1">
					<h3 className="font-semibold text-2xl capitalize tracking-tight">{template}</h3>
					<p className="text-muted-foreground text-sm">
						Esse dolor culpa et esse. Officia deserunt et elit non non laborum commodo amet.
					</p>
				</div>

				<div className="flex flex-wrap gap-1.5">
					{sampleTags.map((tag) => (
						<Badge key={tag} variant="outline">
							{tag}
						</Badge>
					))}
				</div>

				<Button variant="secondary" className="mt-auto self-start" onClick={onOpenTemplateGallery}>
					<SlideshowIcon />
					<Trans>Open Template Gallery</Trans>
				</Button>
			</div>
		</div>
	);
}
