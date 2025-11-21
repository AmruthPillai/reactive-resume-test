import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { RichInput } from "@/components/input/rich-input";
import { SectionBase } from "../shared/section-base";

export function SummarySectionBuilder() {
	const section = useResumeData((state) => state.summary);
	const updateResume = useResumeStore((state) => state.updateResume);

	const onChange = (value: string) => {
		updateResume((draft) => {
			draft.summary.content = value;
		});
	};

	return (
		<SectionBase type="summary">
			<RichInput value={section.content} onChange={onChange} />
		</SectionBase>
	);
}
