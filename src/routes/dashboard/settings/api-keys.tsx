import { t } from "@lingui/core/macro";
import { KeyIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "../-components/header";

export const Route = createFileRoute("/dashboard/settings/api-keys")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="space-y-4">
			<DashboardHeader icon={KeyIcon} title={t`API Keys`} />

			<Separator />
		</div>
	);
}
