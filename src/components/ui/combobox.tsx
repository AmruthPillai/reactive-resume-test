import { t } from "@lingui/core/macro";
import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useControlledState } from "@/hooks/use-controlled-state";
import { cn } from "@/utils/style";

type ComboboxOption<TValue extends string | number = string> = {
	value: TValue;
	label: React.ReactNode;
	keywords?: string[];
	disabled?: boolean;
};

type ComboboxProps<TValue extends string | number = string> = Omit<
	React.ComponentProps<typeof PopoverContent>,
	"value" | "defaultValue" | "children"
> & {
	clearable?: boolean;
	options: ReadonlyArray<ComboboxOption<TValue>>;
	value?: TValue | null;
	defaultValue?: TValue | null;
	placeholder?: React.ReactNode;
	searchPlaceholder?: string;
	emptyMessage?: React.ReactNode;
	buttonProps?: Omit<React.ComponentProps<typeof Button>, "children"> & {
		children?: (value: TValue | null, option: ComboboxOption<TValue> | null) => React.ReactNode;
	};
	onValueChange?: (value: TValue | null, option: ComboboxOption<TValue> | null) => void;
};

function Combobox<TValue extends string | number = string>({
	clearable = true,
	options,
	value,
	defaultValue = null,
	placeholder = t`Select...`,
	searchPlaceholder = t`Search...`,
	emptyMessage = t`No results found.`,
	className,
	buttonProps,
	onValueChange,
	...props
}: ComboboxProps<TValue>) {
	const [open, setOpen] = React.useState(false);

	const [selectedValue, setSelectedValue] = useControlledState<TValue | null>({
		value,
		defaultValue,
		onChange: (next) => onValueChange?.(next, options.find((o) => o.value === next) ?? null),
	});

	const selectedOption = React.useMemo(() => {
		return options.find((option) => option.value === selectedValue) ?? null;
	}, [options, selectedValue]);

	const selectedLabel = selectedOption?.label;

	const onSelect = React.useCallback(
		(current: string) => {
			const next = (current as unknown as TValue) ?? null;

			if (!clearable && selectedValue === next) {
				setOpen(false);
				return;
			}

			const toggled = selectedValue === next ? null : next;
			setSelectedValue(toggled);
			setOpen(false);
		},
		[clearable, selectedValue, setSelectedValue],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					role="combobox"
					variant="outline"
					aria-expanded={open}
					{...buttonProps}
					className={cn(
						"font-normal active:scale-100",
						typeof buttonProps?.children === "function" ? "" : "justify-between",
						buttonProps?.className,
					)}
				>
					{typeof buttonProps?.children === "function" ? (
						buttonProps.children(selectedValue, selectedOption)
					) : (
						<>
							{selectedLabel ?? placeholder}
							<CaretUpDownIcon className="ml-2 shrink-0 opacity-50" />
						</>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent align="start" className={cn("min-w-[200px] p-0", className)} {...props}>
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValue === option.value;

								return (
									<CommandItem
										key={String(option.value)}
										value={String(option.value)}
										keywords={option.keywords}
										disabled={option.disabled}
										onSelect={onSelect}
									>
										<span>{option.label}</span>
										<CheckIcon className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")} />
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export type { ComboboxOption, ComboboxProps };

export { Combobox };
