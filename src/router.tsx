import { MutationCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ErrorScreen } from "./components/layout/error-screen";
import { LoadingScreen } from "./components/layout/loading-screen";
import { NotFoundScreen } from "./components/layout/not-found-screen";
import { getSession } from "./integrations/auth/functions";
import { orpc } from "./integrations/orpc/client";
import { routeTree } from "./routeTree.gen";
import { getLocale, loadLocale } from "./utils/locale";
import { getTheme } from "./utils/theme";

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

	const theme = await getTheme();
	const locale = await getLocale();
	const session = await getSession();

	await loadLocale(locale);

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultViewTransition: true,
		defaultStructuralSharing: true,
		defaultErrorComponent: ErrorScreen,
		defaultPendingComponent: LoadingScreen,
		defaultNotFoundComponent: NotFoundScreen,
		context: {
			orpc,
			theme,
			locale,
			session,
			queryClient,
		},
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		handleRedirects: true,
		wrapQueryClient: true,
	});

	return router;
};
