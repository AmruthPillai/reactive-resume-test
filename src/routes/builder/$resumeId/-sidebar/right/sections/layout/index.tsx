import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
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
		<Form {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="sidebarWidth"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Sidebar Width</Trans>
							</FormLabel>
							<InputGroup>
								<FormControl>
									<InputGroupInput
										{...field}
										type="number"
										min={10}
										max={50}
										step={1}
										onChange={(e) => {
											const value = e.target.value;
											if (value === "") field.onChange("");
											else field.onChange(Number(value));
										}}
									/>
								</FormControl>
								<InputGroupAddon align="inline-end">
									<InputGroupText>%</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
