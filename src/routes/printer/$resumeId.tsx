import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ResumePreview } from "@/components/resume/preview";
import { orpc } from "@/integrations/orpc/client";

export const Route = createFileRoute("/printer/$resumeId")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const resume = await orpc.resume.getById.call({ id: params.resumeId });
		return { resume };
	},
});

function RouteComponent() {
	const { resume } = Route.useLoaderData();

	useEffect(() => {
		document.documentElement.classList.replace("dark", "light");
		document.body.style.backgroundColor = "white";
	}, []);

	return (
		<div className="size-full">
			<ResumePreview data={resume.data} />
		</div>
	);
}
