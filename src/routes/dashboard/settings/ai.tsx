import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { BrainIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Switch } from "@/components/animate-ui/switch";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type AIProvider, useAIStore } from "@/integrations/ai/store";
import { cn } from "@/utils/style";
import { DashboardHeader } from "../-components/header";

export const Route = createFileRoute("/dashboard/settings/ai")({
	component: RouteComponent,
});

const providerOptions: ComboboxOption<AIProvider>[] = [
	{ value: "openai", label: "OpenAI", keywords: ["openai", "gpt", "chatgpt"] },
	{ value: "gemini", label: "Google Gemini", keywords: ["gemini", "google", "bard"] },
	{ value: "anthropic", label: "Anthropic Claude", keywords: ["anthropic", "claude", "ai"] },
];

function AIForm() {
	const provider = useAIStore((state) => state.provider);
	const model = useAIStore((state) => state.model);
	const apiKey = useAIStore((state) => state.apiKey);
	const set = useAIStore((state) => state.set);

	const handleProviderChange = (value: AIProvider | null) => {
		if (!value) return;
		set((draft) => {
			draft.provider = value;
		});
	};

	const handleModelChange = (value: string) => {
		set((draft) => {
			draft.model = value;
		});
	};

	const handleApiKeyChange = (value: string) => {
		set((draft) => {
			draft.apiKey = value;
		});
	};

	return (
		<div className="grid gap-6 sm:grid-cols-2">
			<div className="flex flex-col gap-y-2">
				<Label htmlFor="provider">
					<Trans>Provider</Trans>
				</Label>
				<Combobox id="provider" value={provider} options={providerOptions} onValueChange={handleProviderChange} />
			</div>

			<div className="flex flex-col gap-y-2">
				<Label htmlFor="model">
					<Trans>Model</Trans>
				</Label>
				<Input
					id="model"
					type="text"
					value={model}
					onChange={(e) => handleModelChange(e.target.value)}
					placeholder="e.g., gpt-4, claude-3-opus, gemini-pro"
				/>
			</div>

			<div className="flex flex-col gap-y-2 sm:col-span-2">
				<Label htmlFor="api-key">
					<Trans>API Key</Trans>
				</Label>
				<Input id="api-key" type="password" value={apiKey} onChange={(e) => handleApiKeyChange(e.target.value)} />
			</div>
		</div>
	);
}

function RouteComponent() {
	const enabled = useAIStore((state) => state.enabled);
	const canEnable = useAIStore((state) => state.canEnable());
	const setEnabled = useAIStore((state) => state.setEnabled);

	return (
		<div className="space-y-4">
			<DashboardHeader icon={BrainIcon} title={t`Artificial Intelligence`} />

			<Separator />

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="grid max-w-xl gap-6"
			>
				<div className="flex items-start gap-4 rounded-sm border bg-popover p-6">
					<div className="rounded-sm bg-primary/10 p-2.5">
						<InfoIcon className="text-primary" size={24} />
					</div>

					<div className="flex-1 space-y-2">
						<h3 className="font-semibold">
							<Trans>Your data is stored locally</Trans>
						</h3>

						<p className="text-muted-foreground leading-relaxed">
							<Trans>
								All data entered here is stored locally in your browser and is never sent to our servers. Your API keys
								and configuration remain private and secure on your device.
							</Trans>
						</p>
					</div>
				</div>

				<Separator />

				<AIForm />

				<Separator />

				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label htmlFor="enable-ai">
							<Trans>Enable AI Features</Trans>
						</Label>
						{!canEnable && (
							<p className="text-muted-foreground text-sm">
								<Trans>Fill in all fields above to enable</Trans>
							</p>
						)}
					</div>
					<Switch id="enable-ai" checked={enabled} disabled={!canEnable} onCheckedChange={setEnabled} />
				</div>

				<p className={cn("flex items-center gap-x-2", enabled ? "text-fd-success" : "text-destructive")}>
					{enabled ? <CheckCircleIcon /> : <XCircleIcon />}
					{enabled ? <Trans>Enabled</Trans> : <Trans>Disabled</Trans>}
				</p>
			</motion.div>
		</div>
	);
}
