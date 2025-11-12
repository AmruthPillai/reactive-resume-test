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
import type { Session } from "@/integrations/auth/types";
import type { orpc } from "@/integrations/orpc/client";
import { getLocaleServerFn } from "@/utils/locale";
import { getThemeServerFn } from "@/utils/theme";
import appCss from "../styles.css?url";

type RouterContext = {
	orpc: typeof orpc;
	queryClient: QueryClient;
	session: Session | null;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	shellComponent: RootDocument,
	head: () => ({
		links: [{ rel: "stylesheet", href: appCss }],
		meta: [
			{ charSet: "UTF-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Reactive Resume | A free and open-source resume builder" },
		],
	}),
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
