import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Switch } from "@/components/animate-ui/switch";
import { useResumeStore } from "@/components/resume/store/resume";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { metadataSchema } from "@/schema/resume/data";
import { SectionBase } from "../shared/section-base";

export function CSSSectionBuilder() {
	return (
		<SectionBase type="css" className="pb-4">
			<CSSSectionForm />
		</SectionBase>
	);
}

const formSchema = metadataSchema.shape.css;

type FormValues = z.infer<typeof formSchema>;

function CSSSectionForm() {
	const css = useResumeStore((state) => state.resume.data.metadata.css);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const form = useForm<FormValues>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: css,
	});

	const onSubmit = (data: FormValues) => {
		updateResumeData((draft) => {
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

				{form.watch("enabled") && (
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
				)}
			</form>
		</Form>
	);
}
