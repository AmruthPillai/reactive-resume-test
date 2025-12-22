import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RequestHeadersPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import router from "@/integrations/orpc/router";
import { env } from "@/utils/env";
import { getLocale } from "@/utils/locale";

const openAPIHandler = new OpenAPIHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
	plugins: [
		new RequestHeadersPlugin(),
		new SmartCoercionPlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
		new OpenAPIReferencePlugin({
			docsTitle: "API Reference | Reactive Resume",
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				servers: [{ url: `${env.APP_URL}/api/oas` }],
				info: { title: "Reactive Resume", version: "5.0.0" },
				filter: ({ contract }) => !contract["~orpc"].route.tags?.includes("Internal"),
				security: [{ apiKey: [] }],
				components: {
					securitySchemes: {
						apiKey: {
							in: "header",
							type: "apiKey",
							name: "x-api-key",
						},
					},
				},
			},
			docsConfig: {
				telemetry: false,
				slug: "reactive-resume",
				title: "Reactive Resume",
				defaultOpenAllTags: true,
				expandAllResponses: true,
				hideTestRequestButton: true,
				expandAllModelSections: true,
			},
		}),
	],
});

const openAPIGenerator = new OpenAPIGenerator({
	schemaConverters: [new ZodToJsonSchemaConverter()],
});

async function handler({ request }: { request: Request }) {
	const locale = await getLocale();

	if (request.method === "GET" && request.url.endsWith("/spec.json")) {
		const spec = await openAPIGenerator.generate(router, {
			servers: [{ url: `${env.APP_URL}/api/oas` }],
			info: { title: "Reactive Resume", version: "5.0.0" },
			filter: ({ contract }) => !contract["~orpc"].route.tags?.includes("Internal"),
		});

		return json(spec);
	}

	const { response } = await openAPIHandler.handle(request, {
		prefix: "/api/oas",
		context: { locale, reqHeaders: request.headers },
	});

	if (!response) {
		return new Response("NOT_FOUND", { status: 404 });
	}

	return response;
}

export const Route = createFileRoute("/api/oas/$")({
	server: {
		handlers: {
			ANY: handler,
		},
	},
});
