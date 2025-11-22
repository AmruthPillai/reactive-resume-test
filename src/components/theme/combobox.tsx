import { useLingui } from "@lingui/react";
import { useCallback, useMemo } from "react";
import { isTheme, setThemeServerFn, themeMap } from "@/utils/theme";
import { Combobox, type ComboboxProps } from "../ui/combobox";
import { useTheme } from "./provider";

type Props = Omit<ComboboxProps, "options" | "value" | "onValueChange">;

export function ThemeCombobox(props: Props) {
	const { i18n } = useLingui();
	const { theme, setTheme } = useTheme();

	const options = useMemo(() => {
		return Object.entries(themeMap).map(([value, label]) => ({
			value,
			label: i18n._(label),
			keywords: [i18n._(label)],
		}));
	}, [i18n]);

	const onThemeChange = useCallback(
		(value: string | null) => {
			if (!value || !isTheme(value)) return;
			setThemeServerFn({ data: value });
			setTheme(value);
		},
		[setTheme],
	);

	return <Combobox options={options} value={theme} onValueChange={onThemeChange} {...props} />;
}
