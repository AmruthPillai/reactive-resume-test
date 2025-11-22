import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { Accordion, AccordionContent, AccordionItem } from "@radix-ui/react-accordion";
import { useId, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { FontFamilyCombobox, FontWeightCombobox } from "@/components/typography/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { typographySchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";

export function TypographySectionBuilder() {
	return (
		<SectionBase type="typography">
			<TypographySectionForm />
		</SectionBase>
	);
}

const formSchema = typographySchema;

type FormValues = z.infer<typeof formSchema>;
type TypographyValues = FormValues[keyof FormValues];

function areTypographyValuesEqual(first: TypographyValues, second: TypographyValues) {
	return (
		first.fontSize === second.fontSize &&
		first.lineHeight === second.lineHeight &&
		first.fontFamily === second.fontFamily &&
		first.fontWeights.every((weight) => second.fontWeights.includes(weight))
	);
}

function TypographySectionForm() {
	const typography = useResumeData((state) => state.metadata.typography);
	const updateResume = useResumeStore((state) => state.updateResume);

	const [syncOptions, setSyncOptions] = useState(() => areTypographyValuesEqual(typography.body, typography.heading));

	const form = useForm<FormValues>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: typography,
	});

	const switchId = useId();
	const bodyFontFamily = form.watch("body.fontFamily");
	const headingFontFamily = form.watch("heading.fontFamily");

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.metadata.typography.body = data.body;
			draft.metadata.typography.heading = syncOptions ? data.body : data.heading;
		});
	};

	const handleSyncOptionsToggle = (checked: boolean) => {
		setSyncOptions(checked);

		if (checked) {
			const body = form.getValues("body");
			form.setValue("heading", body, { shouldDirty: true });
		}

		form.handleSubmit(onSubmit)();
	};

	return (
		<FormProvider {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="grid @md:grid-cols-2 grid-cols-1 gap-4">
				<Controller
					control={form.control}
					name="body.fontFamily"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="col-span-full">
							<FieldLabel htmlFor={field.name}>
								<Trans>Font Family</Trans>
							</FieldLabel>
							<FontFamilyCombobox
								value={field.value}
								buttonProps={{ className: "h-auto text-base" }}
								aria-invalid={fieldState.invalid}
								onValueChange={(value) => {
									field.onChange(value);
									form.handleSubmit(onSubmit)();
								}}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="body.fontWeights"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="col-span-full">
							<FieldLabel htmlFor={field.name}>
								<Trans>Font Weights</Trans>
							</FieldLabel>
							<FontWeightCombobox
								value={field.value}
								fontFamily={bodyFontFamily}
								aria-invalid={fieldState.invalid}
								onValueChange={(value) => {
									field.onChange(value);
									form.handleSubmit(onSubmit)();
								}}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="body.fontSize"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								<Trans>Font Size</Trans>
							</FieldLabel>
							<InputGroup>
								<InputGroupInput
									{...field}
									id={field.name}
									min={6}
									max={24}
									step={0.1}
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
					name="body.lineHeight"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								<Trans>Line Height</Trans>
							</FieldLabel>
							<InputGroup>
								<InputGroupInput
									{...field}
									id={field.name}
									min={0.5}
									max={4}
									step={0.05}
									type="number"
									aria-invalid={fieldState.invalid}
									onChange={(e) => {
										const value = e.target.value;
										if (value === "") field.onChange("");
										else field.onChange(Number(value));
									}}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText>x</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Label
					className={cn("col-span-full mb-0 flex items-center gap-4 rounded-lg border p-4", syncOptions && "-mb-4")}
				>
					<Switch
						id={switchId}
						checked={syncOptions}
						className="shrink-0"
						onCheckedChange={handleSyncOptionsToggle}
						aria-label="Use body typography settings for headings"
					/>

					<div className="flex flex-1 flex-col gap-y-1.5">
						<Trans>Use the same style for headings</Trans>
						<span className="font-normal text-muted-foreground text-xs leading-normal">
							<Trans>Synchronize heading styles with the settings configured above.</Trans>
						</span>
					</div>
				</Label>

				<Accordion collapsible type="single" className="col-span-full" value={syncOptions ? "" : "heading"}>
					<AccordionItem value="heading">
						<AccordionContent className="grid @md:grid-cols-2 grid-cols-1 gap-4 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
							<Controller
								control={form.control}
								name="heading.fontFamily"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="col-span-full">
										<FieldLabel htmlFor={field.name}>
											<Trans>Font Family</Trans>
										</FieldLabel>
										<FontFamilyCombobox
											value={field.value}
											buttonProps={{ className: "h-auto text-base" }}
											aria-invalid={fieldState.invalid}
											onValueChange={(value) => {
												field.onChange(value);
												form.handleSubmit(onSubmit)();
											}}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="heading.fontWeights"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="col-span-full">
										<FieldLabel htmlFor={field.name}>
											<Trans>Font Weight</Trans>
										</FieldLabel>
										<FontWeightCombobox
											value={field.value}
											fontFamily={headingFontFamily}
											aria-invalid={fieldState.invalid}
											onValueChange={(value) => {
												field.onChange(value);
												form.handleSubmit(onSubmit)();
											}}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="heading.fontSize"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											<Trans>Font Size</Trans>
										</FieldLabel>
										<InputGroup>
											<InputGroupInput
												{...field}
												id={field.name}
												min={6}
												max={24}
												step={0.1}
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
								name="heading.lineHeight"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											<Trans>Line Height</Trans>
										</FieldLabel>
										<InputGroup>
											<InputGroupInput
												{...field}
												id={field.name}
												min={0.5}
												max={4}
												step={0.05}
												type="number"
												aria-invalid={fieldState.invalid}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") field.onChange("");
													else field.onChange(Number(value));
												}}
											/>
											<InputGroupAddon align="inline-end">
												<InputGroupText>x</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</form>
		</FormProvider>
	);
}
