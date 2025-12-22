import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Switch } from "@/components/animate-ui/switch";
import { useResumeStore } from "@/components/resume/store/resume";
import { useTheme } from "@/components/theme/provider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

// CSS selector suggestions for Monaco editor
const CSS_SELECTORS = [
	// Page-level selectors
	".page",
	".page-content",
	".page-header",
	".page-basics",
	".page-name",
	".page-headline",
	".page-main",
	".page-sidebar",
	".page-picture",
	// Section-level selectors
	".page-section",
	".section-content",
	// Section type selectors
	".page-section-profiles",
	".page-section-experience",
	".page-section-education",
	".page-section-projects",
	".page-section-skills",
	".page-section-languages",
	".page-section-interests",
	".page-section-awards",
	".page-section-certifications",
	".page-section-publications",
	".page-section-volunteer",
	".page-section-references",
	// Generic item selectors
	".section-item",
	".section-item-header",
	".section-item-title",
	".section-item-name",
	".section-item-description",
	".section-item-metadata",
	".section-item-link",
	".section-item-icon",
	".section-item-level",
	".section-item-keywords",
	".section-item-proficiency",
	".section-item-fluency",
	".section-item-location",
	".section-item-publisher",
	".section-item-issuer",
	".section-item-awarder",
	// Specific item selectors
	".profiles-item",
	".profiles-item-header",
	".profiles-item-title",
	".profiles-item-name",
	".profiles-item-description",
	".profiles-item-link",
	".profiles-item-icon",
	".profiles-item-network",
	".experience-item",
	".experience-item-header",
	".experience-item-title",
	".experience-item-name",
	".experience-item-description",
	".experience-item-link",
	".experience-item-metadata",
	".education-item",
	".education-item-header",
	".education-item-title",
	".education-item-name",
	".education-item-description",
	".education-item-link",
	".education-item-metadata",
	".projects-item",
	".projects-item-header",
	".projects-item-title",
	".projects-item-name",
	".projects-item-description",
	".projects-item-link",
	".skills-item",
	".skills-item-header",
	".skills-item-title",
	".skills-item-name",
	".skills-item-description",
	".skills-item-icon",
	".skills-item-level",
	".skills-item-keywords",
	".skills-item-proficiency",
	".languages-item",
	".languages-item-header",
	".languages-item-title",
	".languages-item-name",
	".languages-item-level",
	".languages-item-fluency",
	".interests-item",
	".interests-item-header",
	".interests-item-title",
	".interests-item-name",
	".interests-item-icon",
	".interests-item-keywords",
	".awards-item",
	".awards-item-header",
	".awards-item-title",
	".awards-item-name",
	".awards-item-description",
	".awards-item-link",
	".awards-item-awarder",
	".certifications-item",
	".certifications-item-header",
	".certifications-item-title",
	".certifications-item-name",
	".certifications-item-description",
	".certifications-item-link",
	".certifications-item-issuer",
	".publications-item",
	".publications-item-header",
	".publications-item-title",
	".publications-item-name",
	".publications-item-description",
	".publications-item-link",
	".publications-item-publisher",
	".volunteer-item",
	".volunteer-item-header",
	".volunteer-item-title",
	".volunteer-item-name",
	".volunteer-item-description",
	".volunteer-item-link",
	".volunteer-item-location",
	".references-item",
	".references-item-header",
	".references-item-title",
	".references-item-name",
	".references-item-description",
	// Template-specific selectors
	".template-onyx",
	".template-ditto",
	".template-bronzor",
];

function CSSSectionForm() {
	const monaco = useMonaco();
	const { theme } = useTheme();

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

	useEffect(() => {
		if (!monaco) return;

		const completionProvider = monaco.languages.registerCompletionItemProvider("css", {
			triggerCharacters: ["."],
			provideCompletionItems: (model, position) => {
				const textUntilPosition = model.getValueInRange({
					startLineNumber: position.lineNumber,
					startColumn: 1,
					endLineNumber: position.lineNumber,
					endColumn: position.column,
				});

				// Check if user is typing a class selector (starts with .)
				const match = textUntilPosition.match(/\.([\w-]*)$/);
				if (!match) return { suggestions: [] };

				const prefix = match[1].toLowerCase();
				const word = model.getWordUntilPosition(position);
				const range = {
					startLineNumber: position.lineNumber,
					endLineNumber: position.lineNumber,
					startColumn: word.startColumn,
					endColumn: word.endColumn,
				};

				const suggestions = CSS_SELECTORS.filter((selector) => selector.toLowerCase().startsWith(`.${prefix}`)).map(
					(selector) => ({
						label: selector,
						kind: monaco.languages.CompletionItemKind.Class,
						insertText: selector,
						range,
						detail: "Resume CSS Selector",
						documentation: `CSS selector for ${selector.replace(".", "")}`,
					}),
				);

				return { suggestions };
			},
		});

		return () => {
			completionProvider.dispose();
		};
	}, [monaco]);

	return (
		<Form {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="mt-2 -mb-2 space-y-4">
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
							<FormItem className="h-48 overflow-hidden rounded-md">
								<FormControl>
									<Editor
										language="css"
										theme={theme === "dark" ? "vs-dark" : "light"}
										defaultValue={field.value}
										onChange={(value) => {
											field.onChange(value ?? "");
											form.handleSubmit(onSubmit)();
										}}
									/>
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
