import { createFileRoute } from "@tanstack/react-router";
import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/integrations/docs/source";

const fumadocs = createFromSource(source, {
	language: "english",
});

function handler({ request }: { request: Request }) {
	return fumadocs.GET(request);
}

export const Route = createFileRoute("/api/search")({
	server: {
		handlers: {
			GET: handler,
		},
	},
});
