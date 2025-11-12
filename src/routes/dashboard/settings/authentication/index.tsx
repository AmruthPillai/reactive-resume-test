import { Trans } from "@lingui/react/macro";
import { ShieldCheckIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { useEnabledProviders } from "./-components/hooks";
import { PasskeysSection } from "./-components/passkeys";
import { PasswordSection } from "./-components/password";
import { SocialProviderSection } from "./-components/social-provider";
import { TwoFactorSection } from "./-components/two-factor";

export const Route = createFileRoute("/dashboard/settings/authentication/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { enabledProviders } = useEnabledProviders();

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-x-2">
				<ShieldCheckIcon weight="light" className="size-6" />
				<h1 className="font-medium text-2xl tracking-tight">
					<Trans>Authentication</Trans>
				</h1>
			</div>

			<Separator />

			<div className="max-w-xl space-y-4">
				<PasswordSection />

				<TwoFactorSection />

				<PasskeysSection />

				{"google" in enabledProviders && <SocialProviderSection provider="google" animationDelay={0.2} />}

				{"github" in enabledProviders && <SocialProviderSection provider="github" animationDelay={0.3} />}

				{"custom" in enabledProviders && (
					<SocialProviderSection provider="custom" animationDelay={0.4} name={enabledProviders.custom} />
				)}
			</div>
		</div>
	);
}
