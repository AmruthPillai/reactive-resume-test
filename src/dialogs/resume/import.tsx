import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { DownloadSimpleIcon, FileIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { JSONResumeImporter } from "@/integrations/import/json-resume";
import { PDFParser } from "@/integrations/import/pdf-parser";
import { ReactiveResumeJSONImporter } from "@/integrations/import/reactive-resume-json";
import { orpc } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { type DialogProps, useDialogStore } from "../store";

const formSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("") }),
	z.object({
		type: z.literal("pdf"),
		file: z.instanceof(File).refine((file) => file.type === "application/pdf", { message: "File must be a PDF" }),
	}),
	z.object({
		type: z.literal("docx"),
		file: z
			.instanceof(File)
			.refine(
				(file) =>
					file.type === "application/msword" ||
					file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				{ message: "File must be a Microsoft Word document" },
			),
	}),
	z.object({
		type: z.literal("reactive-resume-json"),
		file: z
			.instanceof(File)
			.refine((file) => file.type === "application/json", { message: "File must be a JSON file" }),
	}),
	z.object({
		type: z.literal("json-resume-json"),
		file: z
			.instanceof(File)
			.refine((file) => file.type === "application/json", { message: "File must be a JSON file" }),
	}),
]);

type FormValues = z.infer<typeof formSchema>;

export function ImportResumeDialog({ open, onOpenChange }: DialogProps<"resume.import">) {
	const { closeDialog } = useDialogStore();
	const inputRef = useRef<HTMLInputElement>(null);
	const prevTypeRef = useRef<string>("");

	const { mutateAsync: importResume, isPending } = useMutation(orpc.resume.import.mutationOptions());

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: "",
		},
	});

	const type = useWatch({ control: form.control, name: "type" });

	useEffect(() => {
		if (prevTypeRef.current === type) return;
		prevTypeRef.current = type;
		form.resetField("file");
	}, [form.resetField, type]);

	const onSelectFile = () => {
		if (!inputRef.current) return;
		inputRef.current.click();
	};

	const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		form.setValue("file", file, { shouldDirty: true });
	};

	const onSubmit = async (values: FormValues) => {
		if (values.type === "") return;

		const toastId = toast.loading(t`Importing your resume...`);

		try {
			let data: ResumeData | undefined;

			if (values.type === "json-resume-json") {
				const json = await values.file.text();
				const importer = new JSONResumeImporter();
				data = importer.parse(json);
			}

			if (values.type === "reactive-resume-json") {
				const json = await values.file.text();
				const importer = new ReactiveResumeJSONImporter();
				data = importer.parse(json);
			}

			if (values.type === "pdf") {
				const parser = new PDFParser();
				data = await parser.parse(values.file);
			}

			if (!data) return;

			await importResume({ data });
			toast.success(t`Your resume has been imported successfully.`, { id: toastId });
			closeDialog();
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message, { id: toastId });
			} else {
				toast.error(t`An unknown error occurred while importing your resume.`, { id: toastId });
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<DownloadSimpleIcon />
						<Trans>Import an existing resume</Trans>
					</DialogTitle>
					<DialogDescription>
						<Trans>
							Continue where you left off by importing an existing resume you created using Reactive Resume or any
							another resume builder. Supported formats include PDF, Microsoft Word, as well as JSON files from Reactive
							Resume.
						</Trans>
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Trans>Type</Trans>
									</FormLabel>
									<FormControl>
										<Combobox
											clearable={false}
											value={field.value}
											onValueChange={field.onChange}
											options={[
												{ label: t`Reactive Resume (JSON)`, value: "reactive-resume-json" },
												{ label: t`JSON Resume`, value: "json-resume-json" },
												{ label: t`PDF`, value: "pdf" },
												{ label: t`Microsoft Word`, value: "docx" },
											]}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="file"
							render={({ field }) => (
								<FormItem className={cn(!type && "hidden")}>
									<FormControl>
										<div>
											<Input type="file" className="hidden" ref={inputRef} onChange={onUploadFile} />

											<Button
												variant="outline"
												className="h-auto w-full flex-col border-dashed py-8 font-normal"
												onClick={onSelectFile}
											>
												{field.value ? (
													<>
														<FileIcon weight="thin" size={32} />
														<p>{field.value.name}</p>
													</>
												) : (
													<>
														<UploadSimpleIcon weight="thin" size={32} />
														<Trans>Click here to select a file to import</Trans>
													</>
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit" disabled={!type || isPending}>
								{isPending ? <Spinner /> : null}
								{isPending ? t`Importing...` : t`Import`}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
