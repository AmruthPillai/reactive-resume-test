import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { Accordion, AccordionContent, AccordionItem } from "@radix-ui/react-accordion";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData } from "@/builder/-hooks/resume";
import { useResumeStore } from "@/builder/-store/resume";
import { FontFamilyCombobox, FontWeightCombobox } from "@/components/typography/combobox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { metadataSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";

export function TypographySectionBuilder() {
	return (
		<SectionBase type="typography">
			<TypographySectionForm />
		</SectionBase>
	);
}

const formSchema = metadataSchema.shape.typography;

type FormValues = z.infer<typeof formSchema>;
type TypographyValues = FormValues["body"];

function areTypographyValuesEqual(first: TypographyValues, second: TypographyValues) {
	return (
		first.fontSize === second.fontSize &&
		first.lineHeight === second.lineHeight &&
		first.fontFamily === second.fontFamily &&
		first.fontWeight === second.fontWeight
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
		<Form {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="grid @md:grid-cols-2 grid-cols-1 gap-4">
				<FormField
					control={form.control}
					name="body.fontFamily"
					render={({ field }) => (
						<FormItem className="col-span-full">
							<FormLabel>
								<Trans>Font Family</Trans>
							</FormLabel>
							<FormControl>
								<FontFamilyCombobox
									value={field.value}
									buttonProps={{ className: "h-auto text-base" }}
									onValueChange={(value) => {
										field.onChange(value);
										form.handleSubmit(onSubmit)();
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="body.fontWeight"
					render={({ field }) => (
						<FormItem className="col-span-full">
							<FormLabel>
								<Trans>Font Weight</Trans>
							</FormLabel>
							<FormControl>
								<FontWeightCombobox
									value={field.value}
									fontFamily={bodyFontFamily}
									onValueChange={(value) => {
										field.onChange(value);
										form.handleSubmit(onSubmit)();
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="body.fontSize"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Font Size</Trans>
							</FormLabel>
							<InputGroup>
								<FormControl>
									<InputGroupInput
										{...field}
										min={6}
										max={24}
										step={0.1}
										type="number"
										onChange={(e) => {
											const value = e.target.value;
											if (value === "") field.onChange("");
											else field.onChange(Number(value));
										}}
									/>
								</FormControl>
								<InputGroupAddon align="inline-end">
									<InputGroupText>pt</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="body.lineHeight"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Line Height</Trans>
							</FormLabel>
							<InputGroup>
								<FormControl>
									<InputGroupInput
										{...field}
										min={0.5}
										max={4}
										step={0.1}
										type="number"
										onChange={(e) => {
											const value = e.target.value;
											if (value === "") field.onChange("");
											else field.onChange(Number(value));
										}}
									/>
								</FormControl>
								<InputGroupAddon align="inline-end">
									<InputGroupText>x</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</FormItem>
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
							<FormField
								control={form.control}
								name="heading.fontFamily"
								render={({ field }) => (
									<FormItem className="col-span-full">
										<FormLabel>
											<Trans>Font Family</Trans>
										</FormLabel>
										<FormControl>
											<FontFamilyCombobox
												value={field.value}
												buttonProps={{ className: "h-auto text-base" }}
												onValueChange={(value) => {
													field.onChange(value);
													form.handleSubmit(onSubmit)();
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="heading.fontWeight"
								render={({ field }) => (
									<FormItem className="col-span-full">
										<FormLabel>
											<Trans>Font Weight</Trans>
										</FormLabel>
										<FormControl>
											<FontWeightCombobox
												value={field.value}
												fontFamily={headingFontFamily}
												onValueChange={(value) => {
													field.onChange(value);
													form.handleSubmit(onSubmit)();
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="heading.fontSize"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Trans>Font Size</Trans>
										</FormLabel>
										<InputGroup>
											<FormControl>
												<InputGroupInput
													{...field}
													min={6}
													max={24}
													step={0.1}
													type="number"
													onChange={(e) => {
														const value = e.target.value;
														if (value === "") field.onChange("");
														else field.onChange(Number(value));
													}}
												/>
											</FormControl>
											<InputGroupAddon align="inline-end">
												<InputGroupText>pt</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="heading.lineHeight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Trans>Line Height</Trans>
										</FormLabel>
										<InputGroup>
											<FormControl>
												<InputGroupInput
													{...field}
													min={0.5}
													max={4}
													step={0.1}
													type="number"
													onChange={(e) => {
														const value = e.target.value;
														if (value === "") field.onChange("");
														else field.onChange(Number(value));
													}}
												/>
											</FormControl>
											<InputGroupAddon align="inline-end">
												<InputGroupText>x</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
									</FormItem>
								)}
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</form>
		</Form>
	);
}
