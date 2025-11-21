import { Trans } from "@lingui/react/macro";
import { CircleNotchIcon, FileJsIcon, FilePdfIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useCallback } from "react";
import { useResumeData } from "@/builder/-store/resume";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc/client";
import { slugify } from "@/utils/string";
import { SectionBase } from "../shared/section-base";

function getReadableTimestamp(now: Date) {
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, "0");
	const d = String(now.getDate()).padStart(2, "0");
	const h = String(now.getHours()).padStart(2, "0");
	const min = String(now.getMinutes()).padStart(2, "0");
	return `${y}${m}${d}_${h}${min}`;
}

function downloadWithAnchor(blob: Blob, filename: string) {
	const a = document.createElement("a");
	const url = URL.createObjectURL(blob);

	a.href = url;
	a.rel = "noopener";
	a.download = filename;

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function ExportSectionBuilder() {
	const resume = useResumeData();
	const { resumeId } = useParams({ from: "/builder/$resumeId" });

	const { mutateAsync: printAsPDF, isPending: isPrinting } = useMutation(
		orpc.resume.printer.printAsPDF.mutationOptions(),
	);

	const generateFilename = useCallback(
		(extension: "json" | "pdf") => {
			const now = new Date();
			const name = slugify(resume.basics.name);
			const timestamp = getReadableTimestamp(now);
			return `${name}_${timestamp}.${extension}`;
		},
		[resume.basics.name],
	);

	const onDownloadJson = useCallback(() => {
		const filename = generateFilename("json");
		const jsonString = JSON.stringify(resume, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });

		downloadWithAnchor(blob, filename);
	}, [resume, generateFilename]);

	const onDownloadPdf = useCallback(async () => {
		const filename = generateFilename("pdf");
		const file = await printAsPDF({ id: resumeId });
		downloadWithAnchor(file, filename);
	}, [resumeId, generateFilename, printAsPDF]);

	return (
		<SectionBase type="export" className="space-y-4">
			<Button
				variant="outline"
				onClick={onDownloadJson}
				className="h-auto gap-x-4 whitespace-normal p-4! text-left font-normal active:scale-98"
			>
				<FileJsIcon className="size-6 shrink-0" />
				<div className="flex flex-1 flex-col gap-y-1">
					<h6 className="font-medium">JSON</h6>
					<p className="text-muted-foreground text-xs leading-normal">
						<Trans>
							Download a copy of your resume in JSON format. Use this file for backup or to import your resume into
							other applications, including AI assistants.
						</Trans>
					</p>
				</div>
			</Button>

			<Button
				variant="outline"
				disabled={isPrinting}
				onClick={onDownloadPdf}
				className="h-auto gap-x-4 whitespace-normal p-4! text-left font-normal active:scale-98"
			>
				{isPrinting ? (
					<CircleNotchIcon className="size-6 shrink-0 animate-spin" />
				) : (
					<FilePdfIcon className="size-6 shrink-0" />
				)}

				<div className="flex flex-1 flex-col gap-y-1">
					<h6 className="font-medium">PDF</h6>
					<p className="text-muted-foreground text-xs leading-normal">
						<Trans>
							Download a copy of your resume in PDF format. Use this file for printing or to easily share your resume
							with recruiters.
						</Trans>
					</p>
				</div>
			</Button>
		</SectionBase>
	);
}
