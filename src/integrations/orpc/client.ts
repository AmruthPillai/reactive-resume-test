import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient, type InferRouterInputs, type InferRouterOutputs, type RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import router from "@/integrations/orpc/router";
import { getLocale } from "@/utils/locale";

const getORPCClient = createIsomorphicFn()
	.server((): RouterClient<typeof router> => {
		return createRouterClient(router, {
			interceptors: [
				onError((error) => {
					console.error(error);
				}),
			],
			context: async () => {
				const locale = await getLocale();
				const reqHeaders = getRequestHeaders();

				// Add a custom header to identify server-side calls
				reqHeaders.set("x-server-side-call", "true");

				return { locale, reqHeaders };
			},
		});
	})
	.client((): RouterClient<typeof router> => {
		const link = new RPCLink({
			url: `${window.location.origin}/api/rpc`,
			fetch: (request, init) => {
				return fetch(request, { ...init, credentials: "include" });
			},
			interceptors: [
				onError((error) => {
					if (error instanceof DOMException) return;
					console.error(error);
				}),
			],
		});

		return createORPCClient(link);
	});

const client = getORPCClient();

export const orpc = createTanstackQueryUtils(client);

export type RouterInput = InferRouterInputs<typeof router>;

export type RouterOutput = InferRouterOutputs<typeof router>;
