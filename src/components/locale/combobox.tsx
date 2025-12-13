import { i18n } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { useRouter } from "@tanstack/react-router";
import { isLocale, type Locale, loadLocale, localeMap, setLocaleServerFn } from "@/utils/locale";
import { Combobox, type ComboboxProps } from "../ui/combobox";

type Props = Omit<ComboboxProps, "options" | "value" | "onValueChange">;

export const getLocaleOptions = () => {
	return Object.entries(localeMap).map(([value, label]) => ({
		value: value as Locale,
		label: i18n.t(label),
		keywords: [i18n.t(label)],
	}));
};

export function LocaleCombobox(props: Props) {
	const router = useRouter();
	const { i18n } = useLingui();

	const onLocaleChange = async (value: string | null) => {
		if (!value || !isLocale(value)) return;
		await loadLocale(value);
		await setLocaleServerFn({ data: value });
		router.invalidate();
	};

	return <Combobox options={getLocaleOptions()} defaultValue={i18n.locale} onValueChange={onLocaleChange} {...props} />;
}
