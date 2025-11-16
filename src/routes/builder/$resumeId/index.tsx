import { createFileRoute } from "@tanstack/react-router";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { ResumePreview } from "@/components/resume/preview";
import { useResumeData } from "./-hooks/resume";

export const Route = createFileRoute("/builder/$resumeId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const resume = useResumeData();

	return (
		<div className="absolute inset-0 h-svh w-svw">
			<TransformWrapper limitToBounds={false} minScale={0.5} maxScale={6}>
				<TransformComponent wrapperClass="h-svh! w-svw!" contentClass="h-svh! w-svw!">
					<ResumePreview data={resume} />
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
}
