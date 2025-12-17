import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";

export const Route = createFileRoute("/docs")({
	head: () => ({
		meta: [{ title: "Documentation | Reactive Resume" }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<RootProvider
			theme={{ enabled: false }}
			search={{
				hotKey: [
					{ display: "Shift", key: (e) => e.shiftKey },
					{ display: "K", key: "K" },
				],
			}}
		>
			<Outlet />
		</RootProvider>
	);
}
