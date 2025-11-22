import Colorful from "@uiw/react-color-colorful";
import { useControllableState } from "@/hooks/use-controllable-state";
import { cn } from "@/utils/style";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props = {
	value?: string;
	defaultValue?: string;
	className?: string;
	onChange?: (value: string) => void;
};

export function ColorPicker({ value, defaultValue = "#000000FF", className, onChange }: Props) {
	const [color, setColor] = useControllableState<string>({
		value,
		defaultValue,
		onChange,
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="icon" variant="ghost" className="rounded-full">
					<div
						style={{ backgroundColor: color }}
						className={cn(
							"size-6 rounded-full border-2 border-ring/20 transition-all hover:ring-1 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background",
							className,
						)}
					/>
				</Button>
			</PopoverTrigger>

			<PopoverContent className="max-w-fit overflow-hidden rounded-lg p-0">
				<Colorful color={color} onChange={(c) => setColor(c.hexa)} className="rounded-none" />
			</PopoverContent>
		</Popover>
	);
}
