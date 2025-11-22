import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { URLInput } from "@/components/input/url-input";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { basicsSchema } from "@/schema/resume/data";
import { SectionBase } from "../shared/section-base";
import { CustomFieldsSection } from "./custom-fields";

export function BasicsSectionBuilder() {
	return (
		<SectionBase type="basics">
			<BasicsSectionForm />
		</SectionBase>
	);
}

const formSchema = basicsSchema;

type FormValues = z.infer<typeof formSchema>;

function BasicsSectionForm() {
	const basics = useResumeData((state) => state.basics);
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: basics,
		mode: "onChange",
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.basics = data;
		});
	};

	return (
		<FormProvider {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
				<FieldSet>
					<FieldGroup>
						<Controller
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
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
							name="headline"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										<Trans>Headline</Trans>
									</FieldLabel>
									<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										<Trans>Email</Trans>
									</FieldLabel>
									<Input type="email" {...field} id={field.name} aria-invalid={fieldState.invalid} />
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name="phone"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										<Trans>Phone</Trans>
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
								<Field data-invalid={fieldState.invalid}>
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
							name="website"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										<Trans>Website</Trans>
									</FieldLabel>
									<URLInput
										{...field}
										value={field.value}
										onChange={field.onChange}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<CustomFieldsSection onSubmit={onSubmit} />
					</FieldGroup>
				</FieldSet>
			</form>
		</FormProvider>
	);
}
