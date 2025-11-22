import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import type z from "zod";
import { useResumeStore } from "@/builder/-store/resume";
import { RichInput } from "@/components/input/rich-input";
import { URLInput } from "@/components/input/url-input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { DialogProps } from "@/dialogs/store";
import { projectItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = projectItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateProjectDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.projects.create">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			name: data?.name ?? "",
			period: data?.period ?? "",
			website: data?.website ?? { url: "", label: "" },
			description: data?.description ?? "",
		},
	});

	const onSubmit = (values: FormValues) => {
		updateResume((draft) => {
			draft.sections.projects.items.push(values);
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new project</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<FormProvider {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<ProjectForm />

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

export function UpdateProjectDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.projects.update">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			name: data.name,
			period: data.period,
			website: data.website,
			description: data.description,
		},
	});

	const onSubmit = (values: FormValues) => {
		updateResume((draft) => {
			const index = draft.sections.projects.items.findIndex((item) => item.id === values.id);
			if (index === -1) return;
			draft.sections.projects.items[index] = values;
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update an existing project</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<FormProvider {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<ProjectForm />

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

export function ProjectForm() {
	const form = useFormContext<FormValues>();

	return (
		<>
			<Controller
				control={form.control}
				name="name"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Name</Trans>
						</FieldLabel>
						<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="period"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Period</Trans>
						</FieldLabel>
						<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="website"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Website</Trans>
						</FieldLabel>
						<URLInput {...field} value={field.value} onChange={field.onChange} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="description"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Description</Trans>
						</FieldLabel>
						<RichInput {...field} value={field.value} onChange={field.onChange} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</>
	);
}
