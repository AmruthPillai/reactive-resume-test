import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type React from "react";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import z from "zod";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useCSSVariables } from "@/components/resume/hooks/use-css-variables";
import { useResumeStore } from "@/components/resume/store/resume";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { BuilderHeader } from "./-components/header";
import { BuilderSidebarLeft } from "./-sidebar/left";
import { BuilderSidebarRight } from "./-sidebar/right";
import { useBuilderSidebar, useBuilderSidebarStore } from "./-store/sidebar";

export const Route = createFileRoute("/builder/$resumeId")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session) throw redirect({ to: "/auth/login", replace: true });
		return { session: context.session };
	},
	loader: async ({ params, context }) => {
		const [layout, resume] = await Promise.all([
			getBuilderLayoutServerFn(),
			context.queryClient.ensureQueryData(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } })),
		]);

		return { layout, name: resume.name };
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [{ title: `${loaderData.name} - Reactive Resume` }] : undefined,
	}),
});

function RouteComponent() {
	const { layout: initialLayout } = Route.useLoaderData();

	const { resumeId } = Route.useParams();
	const { data: resume } = useSuspenseQuery(orpc.resume.getById.queryOptions({ input: { id: resumeId } }));

	const style = useCSSVariables(resume.data.metadata);
	const isReady = useResumeStore((state) => state.isReady);
	const initialize = useResumeStore((state) => state.initialize);

	useEffect(() => {
		initialize(resume);
		return () => initialize(null);
	}, [resume, initialize]);

	if (!isReady) return <LoadingScreen />;

	return <BuilderLayout style={style} initialLayout={initialLayout} />;
}

type BuilderLayoutProps = React.ComponentProps<"div"> & {
	initialLayout: number[];
};

function BuilderLayout({ initialLayout, ...props }: BuilderLayoutProps) {
	const isMobile = useIsMobile();
	const [isDragging, setDragging] = useState(false);

	const setLeftSidebar = useBuilderSidebarStore((state) => state.setLeftSidebar);
	const setRightSidebar = useBuilderSidebarStore((state) => state.setRightSidebar);
	const { maxSidebarSize, collapsedSidebarSize } = useBuilderSidebar((state) => ({
		maxSidebarSize: state.maxSidebarSize,
		collapsedSidebarSize: state.collapsedSidebarSize,
	}));

	const onLayout = useDebounceCallback((layout: number[]) => {
		setBuilderLayoutServerFn({ data: layout });
	}, 1000);

	const leftSidebarSize = isMobile ? 0 : initialLayout[0];
	const rightSidebarSize = isMobile ? 0 : initialLayout[2];
	const artboardSize = isMobile ? 100 : initialLayout[1];

	return (
		<div className="flex h-svh flex-col" {...props}>
			<BuilderHeader />

			<div className="mt-14 flex-1">
				<ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
					<ResizablePanel
						collapsible
						id="left-sidebar"
						ref={setLeftSidebar}
						maxSize={maxSidebarSize}
						minSize={collapsedSidebarSize}
						collapsedSize={collapsedSidebarSize}
						defaultSize={leftSidebarSize}
						className={cn("h-[calc(100svh-3.5rem)]", !isDragging && "transition-all")}
					>
						<BuilderSidebarLeft />
					</ResizablePanel>
					<ResizableHandle withHandle onDragging={setDragging} />
					<ResizablePanel
						id="artboard"
						defaultSize={artboardSize}
						className={cn("h-[calc(100svh-3.5rem)]", !isDragging && "transition-all")}
					>
						<Outlet />
					</ResizablePanel>
					<ResizableHandle withHandle onDragging={setDragging} />
					<ResizablePanel
						collapsible
						id="right-sidebar"
						ref={setRightSidebar}
						maxSize={maxSidebarSize}
						minSize={collapsedSidebarSize}
						collapsedSize={collapsedSidebarSize}
						defaultSize={rightSidebarSize}
						className={cn("h-[calc(100svh-3.5rem)]", !isDragging && "transition-all")}
					>
						<BuilderSidebarRight />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}

const defaultLayout = [30, 40, 30];
const BUILDER_LAYOUT_COOKIE_NAME = "builder_layout";

const setBuilderLayoutServerFn = createServerFn({ method: "POST" })
	.inputValidator(z.array(z.number()))
	.handler(async ({ data }) => {
		setCookie(BUILDER_LAYOUT_COOKIE_NAME, JSON.stringify(data));
	});

const getBuilderLayoutServerFn = createServerFn({ method: "GET" }).handler(async () => {
	const layout = getCookie(BUILDER_LAYOUT_COOKIE_NAME);
	if (!layout) return defaultLayout;
	return z.array(z.number()).parse(JSON.parse(layout));
});
