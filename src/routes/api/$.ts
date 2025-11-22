import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RequestHeadersPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";
import { getRequestHeaders } from "@tanstack/react-start/server";
import router from "@/integrations/orpc/router";
import { getLocale } from "@/utils/locale";

const handler = new OpenAPIHandler(router, {
	plugins: [
		new RequestHeadersPlugin(),
		new SmartCoercionPlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "Reactive Resume API",
					version: "5.0.0",
				},
			},
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

async function handle({ request }: { request: Request }) {
	const locale = await getLocale();
	const reqHeaders = getRequestHeaders();

	const { response } = await handler.handle(request, {
		prefix: "/api",
		context: { locale, reqHeaders },
	});

	if (!response) return new Response("NOT_FOUND", { status: 404 });

	return response;
}

export const Route = createFileRoute("/api/$")({
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
