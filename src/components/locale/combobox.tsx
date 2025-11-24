import { useLingui } from "@lingui/react";
import { useRouter } from "@tanstack/react-router";
import { useMemo } from "react";
import { isLocale, loadLocale, localeMap, setLocaleServerFn } from "@/utils/locale";
import { Combobox, type ComboboxProps } from "../ui/combobox";

type Props = Omit<ComboboxProps, "options" | "value" | "onValueChange">;

export function LocaleCombobox(props: Props) {
	const router = useRouter();
	const { i18n } = useLingui();

	const options = useMemo(() => {
		return Object.entries(localeMap).map(([value, label]) => ({
			value,
			label: i18n.t(label),
			keywords: [i18n.t(label)],
		}));
	}, [i18n]);

	const onLocaleChange = async (value: string | null) => {
		if (!value || !isLocale(value)) return;
		await loadLocale(value);
		await setLocaleServerFn({ data: value });
		router.invalidate();
	};

	return <Combobox options={options} defaultValue={i18n.locale} onValueChange={onLocaleChange} {...props} />;
}
