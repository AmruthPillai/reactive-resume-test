import { useLingui } from "@lingui/react";
import { useRouter } from "@tanstack/react-router";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { isLocale, loadLocale, localeMap, setLocaleServerFn } from "@/utils/locale";
import { useCommandPaletteStore } from "../../store";

export function LanguageCommandPage() {
	const { i18n } = useLingui();
	const router = useRouter();
	const setOpen = useCommandPaletteStore((state) => state.setOpen);

	const handleLocaleChange = async (value: string) => {
		if (!value || !isLocale(value)) return;
		await loadLocale(value);
		await setLocaleServerFn({ data: value });
		router.invalidate();
		setOpen(false);
	};

	return (
		<CommandGroup heading="Language">
			{Object.entries(localeMap).map(([value, label]) => (
				<CommandItem key={value} onSelect={() => handleLocaleChange(value)}>
					<span className="font-mono text-muted-foreground text-xs">{value}</span>
					{i18n.t(label)}
				</CommandItem>
			))}
		</CommandGroup>
	);
}
