import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { DialogProps } from "@/dialogs/store";
import { skillItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";
import { cn } from "@/utils/style";

const formSchema = skillItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateSkillDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.skills.create">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			icon: data?.icon ?? "acorn",
			name: data?.name ?? "",
			proficiency: data?.proficiency ?? "",
			level: data?.level ?? 0,
			keywords: data?.keywords ?? [],
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.sections.skills.items.push(data);
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new skill</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<SkillForm />

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

export function UpdateSkillDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.skills.update">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			icon: data.icon,
			name: data.name,
			proficiency: data.proficiency,
			level: data.level,
			keywords: data.keywords,
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			const index = draft.sections.skills.items.findIndex((item) => item.id === data.id);
			if (index === -1) return;
			draft.sections.skills.items[index] = data;
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update an existing skill</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<SkillForm />

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

export function SkillForm() {
	const form = useFormContext<FormValues>();
	const nameState = useFormState({ control: form.control, name: "name" });

	const isNameInvalid = useMemo(() => {
		return nameState.errors && Object.keys(nameState.errors).length > 0;
	}, [nameState]);

	return (
		<>
			<div className={cn("flex items-end", isNameInvalid && "items-center")}>
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
				name="proficiency"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Proficiency</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="level"
				render={({ field }) => (
					<FormItem className="gap-4 sm:col-span-full">
						<FormLabel>
							<Trans>Level</Trans>
						</FormLabel>
						<FormControl>
							<Slider
								min={0}
								max={5}
								step={1}
								value={[field.value]}
								onValueChange={(value) => field.onChange(value[0])}
							/>
						</FormControl>
						<FormMessage />
						<FormDescription>{Number(field.value) === 0 ? t`Hidden` : `${field.value} / 5`}</FormDescription>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="keywords"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
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
