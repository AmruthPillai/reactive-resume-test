import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { Combobox } from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { pageSchema } from "@/schema/resume/data";
import { SectionBase } from "../shared/section-base";

export function PageSectionBuilder() {
	return (
		<SectionBase type="page">
			<PageSectionForm />
		</SectionBase>
	);
}

const formSchema = pageSchema;

type FormValues = z.infer<typeof formSchema>;

function PageSectionForm() {
	const page = useResumeData((state) => state.metadata.page);
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: page,
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.metadata.page = data;
		});
	};

	return (
		<FormProvider {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="grid @md:grid-cols-2 grid-cols-1 gap-4">
				<Controller
					control={form.control}
					name="format"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="col-span-full">
							<FieldLabel htmlFor={field.name}>
								<Trans context="Page Format (A4 or Letter)">Format</Trans>
							</FieldLabel>
							<Combobox
								options={[
									{ value: "a4", label: "A4" },
									{ value: "letter", label: "Letter" },
								]}
								value={field.value}
								onValueChange={(value) => {
									field.onChange(value);
									form.handleSubmit(onSubmit)();
								}}
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="marginX"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								<Trans>Margin (Horizontal)</Trans>
							</FieldLabel>
							<InputGroup>
								<InputGroupInput
									{...field}
									id={field.name}
									min={0}
									max={100}
									step={1}
									type="number"
									aria-invalid={fieldState.invalid}
									onChange={(e) => {
										const value = e.target.value;
										if (value === "") field.onChange("");
										else field.onChange(Number(value));
									}}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText>pt</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="marginY"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								<Trans>Margin (Vertical)</Trans>
							</FieldLabel>
							<InputGroup>
								<InputGroupInput
									{...field}
									id={field.name}
									min={0}
									max={100}
									step={1}
									type="number"
									aria-invalid={fieldState.invalid}
									onChange={(e) => {
										const value = e.target.value;
										if (value === "") field.onChange("");
										else field.onChange(Number(value));
									}}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText>pt</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</form>
		</FormProvider>
	);
}
