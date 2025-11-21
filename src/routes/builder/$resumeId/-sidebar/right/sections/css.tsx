import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { AccordionContent } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
		<Form {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="-mb-2 mt-2 space-y-4">
				<FormField
					control={form.control}
					name="enabled"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex items-center gap-4">
								<FormControl>
									<Switch
										size="md"
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											form.handleSubmit(onSubmit)();
										}}
									/>
								</FormControl>

								<Trans context="Turn On/Apply Custom CSS">Enable</Trans>
							</FormLabel>
						</FormItem>
					)}
				/>

				<Accordion collapsible type="single" value={form.watch("enabled") ? "css" : ""}>
					<AccordionItem value="css">
						<AccordionContent>
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea rows={6} className="font-mono" {...field} />
										</FormControl>
										<FormMessage />
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
