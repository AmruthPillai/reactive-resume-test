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
import { publicationItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = publicationItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreatePublicationDialog({
	open,
	onOpenChange,
	data,
}: DialogProps<"resume.sections.publications.create">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			title: data?.title ?? "",
			publisher: data?.publisher ?? "",
			date: data?.date ?? "",
			website: data?.website ?? { url: "", label: "" },
			description: data?.description ?? "",
		},
	});

	const onSubmit = (values: FormValues) => {
		updateResume((draft) => {
			draft.sections.publications.items.push(values);
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new publication</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<PublicationForm />

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

export function UpdatePublicationDialog({
	open,
	onOpenChange,
	data,
}: DialogProps<"resume.sections.publications.update">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			title: data.title,
			publisher: data.publisher,
			date: data.date,
			website: data.website,
			description: data.description,
		},
	});

	const onSubmit = (values: FormValues) => {
		updateResume((draft) => {
			const index = draft.sections.publications.items.findIndex((item) => item.id === values.id);
			if (index === -1) return;
			draft.sections.publications.items[index] = values;
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update an existing publication</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<Form {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<PublicationForm />

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

export function PublicationForm() {
	const form = useFormContext<FormValues>();

	return (
		<>
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Title</Trans>
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
				name="publisher"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Publisher</Trans>
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
				name="date"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Date</Trans>
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
					<FormItem>
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
