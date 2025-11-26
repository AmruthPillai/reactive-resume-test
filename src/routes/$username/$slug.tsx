import { ORPCError } from "@orpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ResumePreview } from "@/components/resume/preview";
import { useResumeStore } from "@/components/resume/store/resume";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";

export const Route = createFileRoute("/$username/$slug")({
	component: RouteComponent,
	loader: async ({ context, params: { username, slug } }) => {
		const resume = await context.queryClient.ensureQueryData(
			orpc.resume.getBySlug.queryOptions({ input: { username, slug } }),
		);

		return { resume };
	},
	head: ({ loaderData }) => ({
		meta: [{ title: loaderData ? `${loaderData.resume.name} - Reactive Resume` : "Reactive Resume" }],
	}),
	onError: (error) => {
		if (error instanceof ORPCError && error.code === "NEED_PASSWORD") {
			const data = error.data as { username?: string; slug?: string } | undefined;
			const username = data?.username;
			const slug = data?.slug;

			if (username && slug) {
				throw redirect({
					to: "/auth/resume-password",
					search: { redirect: `/${username}/${slug}` },
				});
			}
		}

		throw notFound();
	},
});

function RouteComponent() {
	const isReady = useResumeStore((state) => state.isReady);
	const initialize = useResumeStore((state) => state.initialize);

	const { username, slug } = Route.useParams();
	const { data: resume } = useSuspenseQuery(orpc.resume.getBySlug.queryOptions({ input: { username, slug } }));

	useEffect(() => {
		initialize(resume);
		return () => initialize(null);
	}, [resume, initialize]);

	if (!isReady) return <LoadingScreen />;

	return (
		<div
			className={cn(
				"mx-auto my-8 flex max-w-[210mm] items-center justify-center px-4",
				"print:m-0 print:block print:max-w-full print:px-0",
			)}
		>
			<ResumePreview pageClassName="print:w-full! w-full max-w-full" />
		</div>
	);
}
