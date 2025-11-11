import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useForm, useFormContext, useFormState } from "react-hook-form";
import type z from "zod";
import { useResumeStore } from "@/builder/-store/resume";
import { ChipInput } from "@/components/input/chip-input";
import { IconPicker } from "@/components/input/icon-picker";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { DialogProps } from "@/dialogs/store";
import { interestItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";
import { cn } from "@/utils/style";

const formSchema = interestItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateInterestDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.interests.create">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			icon: data?.icon ?? "acorn",
			name: data?.name ?? "",
			keywords: data?.keywords ?? [],
		},
	});

	const onSubmit = (values: FormValues) => {
		updateResume((draft) => {
			draft.sections.interests.items.push(values);
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new interest</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<InterestForm />

						<DialogFooter className="sm:col-span-full">
							<Button variant="ghost" onClick={() => onOpenChange(false)}>
								<Trans>Cancel</Trans>
							</Button>

							<Button type="submit" disabled={form.formState.isSubmitting}>
								<Trans>Create</Trans>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function UpdateInterestDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.interests.update">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			icon: data.icon,
			name: data.name,
			keywords: data.keywords,
		},
	});

	const onSubmit = (values: FormValues) => {
		updateResume((draft) => {
			const index = draft.sections.interests.items.findIndex((item) => item.id === values.id);
			if (index === -1) return;
			draft.sections.interests.items[index] = values;
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update an existing interest</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<InterestForm />

						<DialogFooter className="sm:col-span-full">
							<Button variant="ghost" onClick={() => onOpenChange(false)}>
								<Trans>Cancel</Trans>
							</Button>

							<Button type="submit" disabled={form.formState.isSubmitting}>
								<Trans>Save Changes</Trans>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function InterestForm() {
	const form = useFormContext<FormValues>();
	const nameState = useFormState({ control: form.control, name: "name" });

	const isNameInvalid = useMemo(() => {
		return nameState.errors && Object.keys(nameState.errors).length > 0;
	}, [nameState]);

	return (
		<>
			<div className={cn("col-span-full flex items-end", isNameInvalid && "items-center")}>
				<FormField
					control={form.control}
					name={"icon"}
					render={({ field }) => (
						<FormItem className="shrink-0">
							<FormControl>
								<IconPicker {...field} popoverProps={{ modal: true }} className="rounded-r-none! border-r-0!" />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>
								<Trans>Name</Trans>
							</FormLabel>
							<FormControl>
								<Input className="rounded-l-none!" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="keywords"
				render={({ field }) => (
					<FormItem className="col-span-full">
						<FormLabel>
							<Trans>Keywords</Trans>
						</FormLabel>
						<FormControl>
							<ChipInput {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
