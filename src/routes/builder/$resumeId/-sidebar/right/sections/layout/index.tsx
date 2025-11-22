import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";
import { metadataSchema } from "@/schema/resume/data";
import { SectionBase } from "../../shared/section-base";
import { LayoutPages } from "./pages";

export function LayoutSectionBuilder() {
	return (
		<SectionBase type="layout" className="space-y-4">
			<LayoutPages />
			<LayoutSectionForm />
		</SectionBase>
	);
}

const formSchema = metadataSchema.shape.layout.omit({ pages: true });

type FormValues = z.infer<typeof formSchema>;

function LayoutSectionForm() {
	const sidebarWidth = useResumeData((state) => state.metadata.layout.sidebarWidth);
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: { sidebarWidth },
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.metadata.layout.sidebarWidth = data.sidebarWidth;
		});
	};

	return (
		<FormProvider {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
				<Controller
					control={form.control}
					name="sidebarWidth"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								<Trans>Sidebar Width</Trans>
							</FieldLabel>
							<div className="flex items-center gap-4">
								<Slider
									min={10}
									max={50}
									step={0.01}
									value={[field.value]}
									onValueChange={(value) => field.onChange(value[0])}
								/>
								<InputGroup className="w-auto shrink-0">
									<InputGroupInput
										{...field}
										id={field.name}
										type="number"
										min={10}
										max={50}
										step={0.1}
										aria-invalid={fieldState.invalid}
										onChange={(e) => {
											const value = e.target.value;
											if (value === "") field.onChange("");
											else field.onChange(Number(value));
										}}
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupText>%</InputGroupText>
									</InputGroupAddon>
								</InputGroup>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</form>
		</FormProvider>
	);
}
