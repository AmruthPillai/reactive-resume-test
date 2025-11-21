import { BarricadeIcon } from "@phosphor-icons/react";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SectionBase } from "../shared/section-base";

export function TemplateSectionBuilder() {
	return (
		<SectionBase type="template">
			<Alert>
				<BarricadeIcon />
				<AlertTitle>Under Construction</AlertTitle>
				<AlertDescription>This section is not yet available. Please check back later.</AlertDescription>
			</Alert>

			<TemplateSectionForm />
		</SectionBase>
	);
}

function TemplateSectionForm() {
	const template = useResumeData((state) => state.metadata.template);
	const updateResume = useResumeStore((state) => state.updateResume);

	const onSelectTemplate = (template: string) => {
		updateResume((draft) => {
			draft.metadata.template = template;
		});
	};

	return (
		<div className="mt-4 space-y-4">
			<p>Selected Template: {template}</p>

			<div className="grid grid-cols-3 gap-2">
				<Button variant="outline" onClick={() => onSelectTemplate("template-1")}>
					Select Template 1
				</Button>
				<Button variant="outline" onClick={() => onSelectTemplate("template-2")}>
					Select Template 2
				</Button>
				<Button variant="outline" onClick={() => onSelectTemplate("template-3")}>
					Select Template 3
				</Button>
			</div>
		</div>
	);
}
