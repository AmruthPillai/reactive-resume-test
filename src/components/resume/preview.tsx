import type { ResumeData } from "@/schema/resume/data";
import { ResumePreviewProvider, useResumePreview } from "./hooks/use-resume-preview";

export const ResumePreview = ({ data }: { data: ResumeData }) => {
	return (
		<ResumePreviewProvider data={data}>
			<ResumePreviewContent />
		</ResumePreviewProvider>
	);
};

const ResumePreviewContent = () => {
	const pages = useResumePreview((state) => state.metadata.layout.pages);

	return pages.map((_page, pageIndex) => <ResumePreviewPage key={pageIndex} pageIndex={pageIndex} />);
};

const ResumePreviewPage = ({ pageIndex }: { pageIndex: number }) => {
	const data = useResumePreview();

	return (
		<div
			id={`resume-page-${pageIndex}`}
			style={{
				width: "var(--page-width)",
				minHeight: "var(--page-height)",
				color: "var(--page-text-color)",
				backgroundColor: "var(--page-background-color)",
				fontFamily: "var(--page-body-font-family)",
				fontWeight: "var(--page-body-font-weight)",
				fontSize: "var(--page-body-font-size)",
				lineHeight: "var(--page-body-line-height)",
			}}
		>
			<div className="space-y-4">
				{Object.keys(data.sections).map((sectionId) => (
					<SectionPreview key={sectionId} sectionId={sectionId as keyof ResumeData["sections"]} />
				))}
			</div>
		</div>
	);
};

const SectionPreview = ({ sectionId }: { sectionId: keyof ResumeData["sections"] }) => {
	const section = useResumePreview((state) => state.sections[sectionId]);

	return (
		<div className="space-y-4 overflow-hidden border p-4">
			<h2 className="font-bold text-xl tracking-tight">{section.title}</h2>

			<pre className="whitespace-pre-wrap text-base">{JSON.stringify(section.items, null, 2)}</pre>
		</div>
	);
};
