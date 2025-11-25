import { SwapIcon } from "@phosphor-icons/react";
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
			<Button
				variant="ghost"
				className="group/preview relative h-auto w-40 shrink-0 cursor-pointer p-0"
				onClick={onOpenTemplateGallery}
			>
				<div className="relative z-10 aspect-page size-full overflow-hidden rounded-md opacity-100 transition-opacity group-hover/preview:opacity-50">
					<img src="https://picsum.photos/800/1200" alt={template} className="size-full object-cover" />
				</div>

				<div className="absolute inset-0 flex items-center justify-center">
					<SwapIcon size={48} weight="thin" />
				</div>
			</Button>

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
			</div>
		</div>
	);
}
