import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { EmptyIcon, KeyIcon, PlusIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { authClient } from "@/integrations/auth/client";
import { cn } from "@/utils/style";
import { DashboardHeader } from "../-components/header";

export const Route = createFileRoute("/dashboard/settings/api-keys")({
	component: RouteComponent,
});

function RouteComponent() {
	const confirm = useConfirm();
	const queryClient = useQueryClient();
	const openDialog = useDialogStore((state) => state.openDialog);

	const { data: apiKeys } = useSuspenseQuery({
		queryKey: ["auth", "api-keys"],
		queryFn: () => authClient.apiKey.list(),
		select: ({ data }) => {
			if (!data) return [];

			return data
				.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
				.filter((key) => !!key.expiresAt && key.expiresAt.getTime() > Date.now());
		},
	});

	const onDelete = async (id: string) => {
		const confirmation = await confirm(t`Are you sure you want to delete this API key?`, {
			description: t`The API key will no longer be able to access your data after deletion. This action cannot be undone.`,
			confirmText: t`Delete`,
			cancelText: t`Cancel`,
		});

		if (!confirmation) return;

		const result = await authClient.apiKey.delete({ keyId: id });

		if (result.error) {
			toast.error(result.error.message);
			return;
		}

		toast.success(t`The API key has been deleted successfully.`);
		queryClient.invalidateQueries({ queryKey: ["auth", "api-keys"] });
	};

	return (
		<div className="space-y-4">
			<DashboardHeader icon={KeyIcon} title={t`API Keys`} />

			<Separator />

			<div className="max-w-xl space-y-4">
				<Button
					variant="outline"
					className="h-auto w-full py-3"
					onClick={() => openDialog("api-key.create", undefined)}
				>
					<PlusIcon />
					<Trans>Create a new API key</Trans>
				</Button>

				{apiKeys.length === 0 && (
					<div className="flex flex-col items-center justify-center gap-y-4 rounded-sm border border-dashed p-8 text-center">
						<EmptyIcon size={32} />

						<div className="space-y-2">
							<h5 className="font-medium">
								<Trans>You don't have any API keys yet.</Trans>
							</h5>
							<p className="text-muted-foreground leading-relaxed">
								<Trans>
									You can use API keys to authenticate external applications to access your data stored on Reactive
									Resume. Please keep your API keys secure and do not share them with anyone.
								</Trans>
							</p>
						</div>
					</div>
				)}

				<div className={cn(apiKeys.length === 0 && "hidden")}>
					<AnimatePresence>
						{apiKeys.map((key, index) => (
							<motion.div
								key={key.id}
								className="flex items-center gap-x-4 py-4"
								initial={{ opacity: 0, y: -16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -16 }}
								transition={{ delay: index * 0.08 }}
							>
								<KeyIcon />

								<div className="flex-1 space-y-1">
									<p className="font-mono text-xs">{key.start}...</p>
									<div className="text-muted-foreground text-xs">
										<Trans>Expires on {key.expiresAt?.toLocaleDateString()}</Trans>
									</div>
								</div>

								<Button size="icon" variant="ghost" onClick={() => onDelete(key.id)}>
									<TrashSimpleIcon />
								</Button>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
