import { createFileRoute } from "@tanstack/react-router";
import { TiptapContent } from "@/components/input/rich-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResumeData } from "./-hooks/resume";

export const Route = createFileRoute("/builder/$resumeId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const resume = useResumeData();

	return (
		<ScrollArea className="mx-auto aspect-page h-full">
			<div className="m-4 space-y-6 rounded-md bg-popover p-4 text-foreground">
				<TiptapContent content={resume.summary.content} />

				<pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(resume, null, 2)}</pre>
			</div>
		</ScrollArea>
	);
}
