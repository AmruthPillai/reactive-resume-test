import { useLingui } from "@lingui/react";
import { useCallback, useMemo } from "react";
import { isLocale, loadLocale, localeMap, setLocaleServerFn } from "@/utils/locale";
import { Combobox, type ComboboxProps } from "../ui/combobox";

type Props = Omit<ComboboxProps, "options" | "value" | "onValueChange">;

export function LocaleCombobox(props: Props) {
	const { i18n } = useLingui();

	const options = useMemo(() => {
		return Object.entries(localeMap).map(([value, label]) => ({
			value,
			label: i18n._(label),
			keywords: [i18n._(label)],
		}));
	}, [i18n]);

	const onLocaleChange = useCallback(async (value: string | null) => {
		if (!value || !isLocale(value)) return;
		await loadLocale(value);
		await setLocaleServerFn({ data: value });
		window.location.reload();
	}, []);

	return <Combobox options={options} value={i18n.locale} onValueChange={onLocaleChange} {...props} />;
}
