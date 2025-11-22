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
import { educationItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = educationItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateEducationDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.education.create">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			school: data?.school ?? "",
			degree: data?.degree ?? "",
			area: data?.area ?? "",
			grade: data?.grade ?? "",
			location: data?.location ?? "",
			period: data?.period ?? "",
			website: data?.website ?? { url: "", label: "" },
			description: data?.description ?? "",
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.sections.education.items.push(data);
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new education</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<FormProvider {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<EducationForm />

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

export function UpdateEducationDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.education.update">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			school: data.school,
			degree: data.degree,
			area: data.area,
			grade: data.grade,
			location: data.location,
			period: data.period,
			website: data.website,
			description: data.description,
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			const index = draft.sections.education.items.findIndex((item) => item.id === data.id);
			if (index === -1) return;
			draft.sections.education.items[index] = data;
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update an existing education</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<FormProvider {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<EducationForm />

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

export function EducationForm() {
	const form = useFormContext<FormValues>();

	return (
		<>
			<Controller
				control={form.control}
				name="school"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>School</Trans>
						</FieldLabel>
						<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="degree"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Degree</Trans>
						</FieldLabel>
						<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="area"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Area of Study</Trans>
						</FieldLabel>
						<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="grade"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Grade</Trans>
						</FieldLabel>
						<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="location"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Location</Trans>
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
