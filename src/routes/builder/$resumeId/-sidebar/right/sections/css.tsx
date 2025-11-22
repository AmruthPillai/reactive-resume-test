import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { AccordionContent } from "@/components/ui/accordion";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { metadataSchema } from "@/schema/resume/data";
import { SectionBase } from "../shared/section-base";

export function CSSSectionBuilder() {
	return (
		<SectionBase type="css">
			<CSSSectionForm />
		</SectionBase>
	);
}

const formSchema = metadataSchema.shape.css;

type FormValues = z.infer<typeof formSchema>;

function CSSSectionForm() {
	const css = useResumeData((state) => state.metadata.css);
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: css,
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.metadata.css = data;
		});
	};

	return (
		<FormProvider {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="-mb-2 mt-2 space-y-4">
				<Controller
					control={form.control}
					name="enabled"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name} className="flex items-center gap-4">
								<Switch
									id={field.name}
									size="md"
									checked={field.value}
									aria-invalid={fieldState.invalid}
									onCheckedChange={(checked) => {
										field.onChange(checked);
										form.handleSubmit(onSubmit)();
									}}
								/>
								<Trans context="Turn On/Apply Custom CSS">Enable</Trans>
							</FieldLabel>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Accordion collapsible type="single" value={form.watch("enabled") ? "css" : ""}>
					<AccordionItem value="css">
						<AccordionContent>
							<Controller
								control={form.control}
								name="value"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<Textarea
											{...field}
											id={field.name}
											rows={6}
											className="font-mono"
											aria-invalid={fieldState.invalid}
										/>
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
