import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { Controller, FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
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

				<FormProvider {...form}>
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
				</FormProvider>
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

				<FormProvider {...form}>
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
				</FormProvider>
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
				<Controller
					control={form.control}
					name={"icon"}
					render={({ field }) => (
						<Field className="shrink-0">
							<IconPicker {...field} popoverProps={{ modal: true }} className="rounded-r-none! border-r-0!" />
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="name"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="flex-1">
							<FieldLabel htmlFor={field.name}>
								<Trans>Name</Trans>
							</FieldLabel>
							<Input className="rounded-l-none!" {...field} id={field.name} aria-invalid={fieldState.invalid} />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</div>

			<Controller
				control={form.control}
				name="proficiency"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Proficiency</Trans>
						</FieldLabel>
						<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="level"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="gap-4 sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Level</Trans>
						</FieldLabel>
						<Slider
							min={0}
							max={5}
							step={1}
							value={[field.value]}
							onValueChange={(value) => field.onChange(value[0])}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						<FieldDescription>{Number(field.value) === 0 ? t`Hidden` : `${field.value} / 5`}</FieldDescription>
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="keywords"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Keywords</Trans>
						</FieldLabel>
						<ChipInput {...field} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</>
	);
}
