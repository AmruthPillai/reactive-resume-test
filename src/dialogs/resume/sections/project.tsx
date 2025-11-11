import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useForm, useFormContext } from "react-hook-form";
import type z from "zod";
import { useResumeStore } from "@/builder/-store/resume";
import { RichInput } from "@/components/input/rich-input";
import { URLInput } from "@/components/input/url-input";
import { Button } from "@/components/ui/button";
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
import type { DialogProps } from "@/dialogs/store";
import { projectItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = projectItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateProjectDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.projects.create">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			name: data?.name ?? "",
			period: data?.period ?? "",
			website: data?.website ?? { url: "", label: "" },
			description: data?.description ?? "",
		},
	});

	const onSubmit = (values: FormValues) => {
		updateResume((draft) => {
			draft.sections.projects.items.push(values);
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new project</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<ProjectForm />

						<DialogFooter className="sm:col-span-full">
							<Button variant="ghost" onClick={() => onOpenChange(false)}>
								<Trans>Cancel</Trans>
							</Button>

							<Button type="submit" disabled={form.formState.isSubmitting}>
								<Trans>Create</Trans>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function UpdateProjectDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.projects.update">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			name: data.name,
			period: data.period,
			website: data.website,
			description: data.description,
		},
	});

	const onSubmit = (values: FormValues) => {
		updateResume((draft) => {
			const index = draft.sections.projects.items.findIndex((item) => item.id === values.id);
			if (index === -1) return;
			draft.sections.projects.items[index] = values;
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update an existing project</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<ProjectForm />

						<DialogFooter className="sm:col-span-full">
							<Button variant="ghost" onClick={() => onOpenChange(false)}>
								<Trans>Cancel</Trans>
							</Button>

							<Button type="submit" disabled={form.formState.isSubmitting}>
								<Trans>Save Changes</Trans>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function ProjectForm() {
	const form = useFormContext<FormValues>();

	return (
		<>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Name</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="period"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Period</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="website"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
						<FormLabel>
							<Trans>Website</Trans>
						</FormLabel>
						<FormControl>
							<URLInput {...field} value={field.value} onChange={field.onChange} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
						<FormLabel>
							<Trans>Description</Trans>
						</FormLabel>
						<FormControl>
							<RichInput {...field} value={field.value} onChange={field.onChange} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
