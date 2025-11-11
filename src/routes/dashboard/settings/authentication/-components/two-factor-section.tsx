import { Trans } from "@lingui/react/macro";
import { KeyIcon, LockOpenIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { match } from "ts-pattern";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDialogStore } from "@/dialogs/store";
import { authClient } from "@/integrations/auth/client";

type TwoFactorSectionProps = {
	hasPassword: boolean;
};

export function TwoFactorSection({ hasPassword }: TwoFactorSectionProps) {
	const { openDialog } = useDialogStore();
	const { data: session } = authClient.useSession();

	const twoFactorEnabled = useMemo(() => session?.user.twoFactorEnabled ?? false, [session]);

	const handleTwoFactorAction = useCallback(() => {
		if (twoFactorEnabled) {
			openDialog("auth.two-factor.disable", undefined);
		} else {
			openDialog("auth.two-factor.enable", undefined);
		}
	}, [twoFactorEnabled, openDialog]);

	if (!hasPassword) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: 0.1 }}
		>
			<Separator />

			<div className="mt-4 flex items-center justify-between gap-x-4">
				<h2 className="flex items-center gap-x-3 font-medium text-base">
					{twoFactorEnabled ? <LockOpenIcon /> : <KeyIcon />}
					<Trans>Two-Factor Authentication</Trans>
				</h2>

				{match(twoFactorEnabled)
					.with(true, () => (
						<Button variant="outline" onClick={handleTwoFactorAction}>
							<Trans>Disable</Trans>
						</Button>
					))
					.with(false, () => (
						<Button variant="outline" onClick={handleTwoFactorAction}>
							<Trans>Enable</Trans>
						</Button>
					))
					.exhaustive()}
			</div>
		</motion.div>
	);
}
