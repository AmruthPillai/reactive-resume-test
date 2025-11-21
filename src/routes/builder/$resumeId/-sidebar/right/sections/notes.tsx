import { Trans } from "@lingui/react/macro";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { RichInput } from "@/components/input/rich-input";
import { SectionBase } from "../shared/section-base";

export function NotesSectionBuilder() {
	return (
		<SectionBase type="notes">
			<NotesSectionForm />
		</SectionBase>
	);
}

function NotesSectionForm() {
	const notes = useResumeData((state) => state.metadata.notes);
	const updateResume = useResumeStore((state) => state.updateResume);

	const onChange = (value: string) => {
		updateResume((draft) => {
			draft.metadata.notes = value;
		});
	};

	return (
		<div className="space-y-4">
			<p>
				<Trans>
					This section is reserved for your personal notes specific to this resume. The content here remains private and
					is not shared with anyone else.
				</Trans>
			</p>

			<RichInput value={notes} onChange={onChange} />

			<p className="text-muted-foreground">
				<Trans>
					For example, information regarding which companies you sent this resume to or the links to the job
					descriptions can be noted down here.
				</Trans>
			</p>
		</div>
	);
}
