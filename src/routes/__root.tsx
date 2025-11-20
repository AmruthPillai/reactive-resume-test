import "@phosphor-icons/web/regular/style.css";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { IconContext } from "@phosphor-icons/react";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme/provider";
import { Toaster } from "@/components/ui/sonner";
import { DialogManager } from "@/dialogs/manager";
import { ConfirmDialogProvider } from "@/hooks/use-confirm";
import { PromptDialogProvider } from "@/hooks/use-prompt";
import { getSessionServerFn } from "@/integrations/auth/functions";
import type { AuthSession } from "@/integrations/auth/types";
import type { orpc } from "@/integrations/orpc/client";
import { getLocaleServerFn } from "@/utils/locale";
import { getThemeServerFn } from "@/utils/theme";
import appCss from "../styles.css?url";

type RouterContext = {
	orpc: typeof orpc;
	queryClient: QueryClient;
	session: AuthSession | null;
};

const appName = "Reactive Resume";
const tagline = "A free and open-source resume builder";
const title = `${appName} | ${tagline}`;
const description =
	"Reactive Resume is a free and open-source resume builder that simplifies the process of creating, updating, and sharing your resume.";

export const Route = createRootRouteWithContext<RouterContext>()({
	shellComponent: RootDocument,
	head: () => {
		const appUrl = process.env.APP_URL ?? "https://rxresu.me/";

		return {
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "manifest", href: "/manifest.json", type: "application/manifest+json" },
				// Icons
				{ rel: "icon", href: "/favicon.ico", type: "image/x-icon", sizes: "48x48" },
				{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
				{ rel: "apple-touch-icon", href: "/apple-touch-icon-180x180.png", type: "image/png", sizes: "180x180" },
			],
			meta: [
				{ title },
				{ charSet: "UTF-8" },
				{ meta: "description", content: description },
				{ name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
				// Twitter Tags
				{ property: "twitter:image", content: `${appUrl}/opengraph/banner.jpg` },
				{ property: "twitter:card", content: "summary_large_image" },
				{ property: "twitter:title", content: title },
				{ property: "twitter:description", content: description },
				// OpenGraph Tags
				{ property: "og:image", content: `${appUrl}/opengraph/banner.jpg` },
				{ property: "og:site_name", content: appName },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: appUrl },
			],
		};
	},
	beforeLoad: async () => {
		const session = await getSessionServerFn();

		return { session };
	},
	loader: async () => {
		const theme = await getThemeServerFn();
		const locale = await getLocaleServerFn();

		return { theme, locale };
	},
});

type Props = {
	children: React.ReactNode;
};

function RootDocument({ children }: Props) {
	const { theme, locale } = Route.useLoaderData();

	return (
		<html suppressHydrationWarning lang={locale} className={theme}>
			<head>
				<HeadContent />
			</head>

			<body>
				<I18nProvider i18n={i18n}>
					<IconContext.Provider value={{ size: 16, weight: "regular" }}>
						<ThemeProvider theme={theme}>
							<ConfirmDialogProvider>
								<PromptDialogProvider>
									{children}

									<Toaster />
									<DialogManager />
								</PromptDialogProvider>
							</ConfirmDialogProvider>
						</ThemeProvider>
					</IconContext.Provider>
				</I18nProvider>

				<Scripts />
			</body>
		</html>
	);
}
