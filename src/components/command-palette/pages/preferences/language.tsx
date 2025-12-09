import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { useRouter } from "@tanstack/react-router";
import { CommandItem } from "@/components/ui/command";
import { isLocale, loadLocale, localeMap, setLocaleServerFn } from "@/utils/locale";
import { useCommandPaletteStore } from "../../store";
import { BaseCommandGroup } from "../base";

export function LanguageCommandPage() {
	const router = useRouter();
	const { i18n } = useLingui();
	const setOpen = useCommandPaletteStore((state) => state.setOpen);

	const handleLocaleChange = async (value: string) => {
		if (!value || !isLocale(value)) return;
		await loadLocale(value);
		await setLocaleServerFn({ data: value });
		router.invalidate();
		setOpen(false);
	};

	return (
		<BaseCommandGroup page="language" heading={<Trans>Language</Trans>}>
			{Object.entries(localeMap).map(([value, label]) => (
				<CommandItem key={value} onSelect={() => handleLocaleChange(value)}>
					<span className="font-mono text-muted-foreground text-xs">{value}</span>
					{i18n.t(label)}
				</CommandItem>
			))}
		</BaseCommandGroup>
	);
}
