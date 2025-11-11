import { t } from "@lingui/core/macro";
import { GithubLogoIcon, GoogleLogoIcon, PasswordIcon } from "@phosphor-icons/react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { toast } from "sonner";
import { match } from "ts-pattern";
import { authClient } from "@/integrations/auth/client";
import type { AuthProvider } from "@/integrations/auth/types";
import { orpc } from "@/integrations/orpc/client";

/**
 * Get the display name for a social provider
 */
export function getProviderName(providerId: AuthProvider): string {
	return match(providerId)
		.with("credential", () => "Password")
		.with("google", () => "Google")
		.with("github", () => "GitHub")
		.exhaustive();
}

/**
 * Get the icon component for a social provider
 */
export function getProviderIcon(providerId: AuthProvider): ReactNode {
	return match(providerId)
		.with("credential", () => <PasswordIcon />)
		.with("google", () => <GoogleLogoIcon />)
		.with("github", () => <GithubLogoIcon />)
		.exhaustive();
}

/**
 * Hook to fetch and manage authentication accounts
 */
export function useAuthAccounts() {
	const { data: accounts } = useQuery({
		queryKey: ["auth", "accounts"],
		queryFn: () => authClient.listAccounts(),
		select: ({ data }) => data ?? [],
	});

	const getAccountByProviderId = useCallback(
		(providerId: string) => accounts?.find((account) => account.providerId === providerId),
		[accounts],
	);

	const hasAccount = useCallback(
		(providerId: string) => !!getAccountByProviderId(providerId),
		[getAccountByProviderId],
	);

	return {
		accounts,
		getAccountByProviderId,
		hasAccount,
	};
}

/**
 * Hook to manage social provider linking/unlinking
 */
export function useAuthProviderActions() {
	const queryClient = useQueryClient();

	const handleLinkSocial = useCallback(
		async (provider: AuthProvider) => {
			const providerName = getProviderName(provider);
			const toastId = toast.loading(t`Linking your ${providerName} account...`);

			await authClient.linkSocial({
				provider,
				callbackURL: "/dashboard/settings/authentication",
				fetchOptions: {
					onSuccess: () => {
						toast.dismiss(toastId);
						toast.success(t`Your ${providerName} account has been linked successfully.`);
						queryClient.invalidateQueries({ queryKey: ["auth", "accounts"] });
					},
					onError: ({ error }) => {
						toast.error(error.message, { id: toastId });
					},
				},
			});
		},
		[queryClient],
	);

	const handleUnlinkSocial = useCallback(
		async (provider: AuthProvider, accountId: string) => {
			const providerName = getProviderName(provider);
			const toastId = toast.loading(t`Unlinking your ${providerName} account...`);

			await authClient.unlinkAccount({
				providerId: provider,
				accountId,
				fetchOptions: {
					onSuccess: () => {
						toast.dismiss(toastId);
						toast.success(t`Your ${providerName} account has been unlinked successfully.`);
						queryClient.invalidateQueries({ queryKey: ["auth", "accounts"] });
					},
					onError: ({ error }) => {
						toast.error(error.message, { id: toastId });
					},
				},
			});
		},
		[queryClient],
	);

	return {
		handleLinkSocial,
		handleUnlinkSocial,
	};
}

/**
 * Hook to get enabled social providers for the current user
 */
export function useEnabledProviders() {
	const { data: enabledProviders = [] } = useSuspenseQuery(orpc.auth.listProviders.queryOptions());

	const isProviderEnabled = useCallback(
		(provider: AuthProvider) => enabledProviders.includes(provider),
		[enabledProviders],
	);

	return {
		enabledProviders,
		isProviderEnabled,
	};
}
