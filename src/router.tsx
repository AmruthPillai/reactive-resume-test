import { MutationCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { LoadingScreen } from "./components/layout/loading-screen";
import { orpc } from "./integrations/orpc/client";
import { routeTree } from "./routeTree.gen";
import { getLocaleServerFn, loadLocale } from "./utils/locale";

const getQueryClient = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: { retry: false },
			queries: {
				retry: false,
				staleTime: 1000,
				gcTime: 60 * 1000,
				refetchOnMount: "always",
				refetchOnWindowFocus: false,
				refetchOnReconnect: "always",
			},
		},
		mutationCache: new MutationCache({
			onSettled: () => {
				queryClient.invalidateQueries();
			},
		}),
	});

	return queryClient;
};

export const getRouter = async () => {
	const queryClient = getQueryClient();

	await loadLocale(await getLocaleServerFn());

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultViewTransition: true,
		defaultStructuralSharing: true,
		defaultErrorComponent: () => null,
		defaultPendingComponent: LoadingScreen,
		context: { orpc, queryClient, session: null },
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		handleRedirects: true,
		wrapQueryClient: true,
	});

	return router;
};
