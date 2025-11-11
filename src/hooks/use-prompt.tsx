import { t } from "@lingui/core/macro";
import * as React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/style";

interface PromptOptions {
	description?: string;
	defaultValue?: string;
	placeholder?: string;
	confirmText?: string;
	cancelText?: string;
}

interface PromptState extends PromptOptions {
	open: boolean;
	title: string;
	value: string;
	resolve: ((value: string | null) => void) | null;
}

type PromptContextType = {
	prompt: (title: string, options?: PromptOptions) => Promise<string | null>;
};

const PromptContext = React.createContext<PromptContextType | null>(null);

export function PromptDialogProvider({ children }: { children: React.ReactNode }) {
	const inputRef = React.useRef<HTMLInputElement>(null);

	const [state, setState] = React.useState<PromptState>({
		open: false,
		resolve: null,
		title: "",
		value: "",
		description: undefined,
		defaultValue: undefined,
		placeholder: undefined,
		confirmText: undefined,
		cancelText: undefined,
	});

	React.useEffect(() => {
		if (!state.open) return;
		setTimeout(() => {
			if (!inputRef.current) return;
			inputRef.current.focus();
		}, 0);
	}, [state.open]);

	const prompt = React.useCallback(async (title: string, options?: PromptOptions): Promise<string | null> => {
		return new Promise<string | null>((resolve) => {
			setState({
				open: true,
				resolve,
				title,
				value: options?.defaultValue ?? "",
				description: options?.description,
				defaultValue: options?.defaultValue,
				placeholder: options?.placeholder,
				confirmText: options?.confirmText,
				cancelText: options?.cancelText,
			});
		});
	}, []);

	const handleConfirm = React.useCallback(() => {
		if (state.resolve) state.resolve(state.value);

		setState((prev) => ({ ...prev, open: false, resolve: null }));
	}, [state.resolve, state.value]);

	const handleCancel = React.useCallback(() => {
		if (state.resolve) state.resolve(null);

		setState((prev) => ({ ...prev, open: false, resolve: null }));
	}, [state.resolve]);

	const handleValueChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setState((prev) => ({ ...prev, value: e.target.value }));
	}, []);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") handleConfirm();
		},
		[handleConfirm],
	);

	return (
		<PromptContext.Provider value={{ prompt }}>
			{children}

			<AlertDialog open={state.open} onOpenChange={(open) => !open && handleCancel()}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{state.title}</AlertDialogTitle>
						<AlertDialogDescription className={cn(!state.description && "sr-only")}>
							{state.description}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<Input
						ref={inputRef}
						value={state.value}
						onKeyDown={handleKeyDown}
						onChange={handleValueChange}
						placeholder={state.placeholder}
					/>

					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancel}>{state.cancelText ?? t`Cancel`}</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>{state.confirmText ?? t`Confirm`}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</PromptContext.Provider>
	);
}

export function usePrompt() {
	const context = React.useContext(PromptContext);

	if (!context) {
		throw new Error("usePrompt must be used within a <PromptDialogProvider />.");
	}

	return context.prompt;
}
