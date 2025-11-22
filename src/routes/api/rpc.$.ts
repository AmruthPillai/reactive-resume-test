import { RPCHandler } from "@orpc/server/fetch";
import { RequestHeadersPlugin, SimpleCsrfProtectionHandlerPlugin } from "@orpc/server/plugins";
import { createFileRoute } from "@tanstack/react-router";
import router from "@/integrations/orpc/router";
import { getLocale } from "@/utils/locale";

const handler = new RPCHandler(router, {
	plugins: [new RequestHeadersPlugin(), new SimpleCsrfProtectionHandlerPlugin()],
});

async function handle({ request }: { request: Request }) {
	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context: {
			locale: await getLocale(),
		},
	});

	if (!response) return new Response("NOT_FOUND", { status: 404 });

	return response;
}

export const Route = createFileRoute("/api/rpc/$")({
	server: {
		handlers: {
			HEAD: handle,
			GET: handle,
			POST: handle,
			PUT: handle,
			PATCH: handle,
			DELETE: handle,
		},
	},
});
