import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { AtIcon, PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { Controller, FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import type z from "zod";
import { useResumeStore } from "@/builder/-store/resume";
import { IconPicker } from "@/components/input/icon-picker";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import type { DialogProps } from "@/dialogs/store";
import { profileItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";
import { cn } from "@/utils/style";

const formSchema = profileItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateProfileDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.profiles.create">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			icon: data?.icon ?? "acorn",
			network: data?.network ?? "",
			username: data?.username ?? "",
			website: data?.website ?? { url: "", label: "" },
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			draft.sections.profiles.items.push(data);
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PlusIcon />
						<Trans>Create a new profile</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<FormProvider {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<ProfileForm />

						<DialogFooter className="sm:col-span-full">
							<Button variant="ghost" onClick={() => onOpenChange(false)}>
								<Trans>Cancel</Trans>
							</Button>

							<Button type="submit" disabled={form.formState.isSubmitting}>
								<Trans>Create</Trans>
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}

export function UpdateProfileDialog({ open, onOpenChange, data }: DialogProps<"resume.sections.profiles.update">) {
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			icon: data.icon,
			network: data.network,
			username: data.username,
			website: data.website,
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResume((draft) => {
			const index = draft.sections.profiles.items.findIndex((item) => item.id === data.id);
			if (index === -1) return;
			draft.sections.profiles.items[index] = data;
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<PencilSimpleLineIcon />
						<Trans>Update an existing profile</Trans>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>

				<FormProvider {...form}>
					<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
						<ProfileForm />

						<DialogFooter className="sm:col-span-full">
							<Button variant="ghost" onClick={() => onOpenChange(false)}>
								<Trans>Cancel</Trans>
							</Button>

							<Button type="submit" disabled={form.formState.isSubmitting}>
								<Trans>Save Changes</Trans>
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}

export function ProfileForm() {
	const form = useFormContext<FormValues>();
	const networkState = useFormState({ control: form.control, name: "network" });

	const isNetworkInvalid = useMemo(() => {
		return networkState.errors && Object.keys(networkState.errors).length > 0;
	}, [networkState]);

	return (
		<>
			<div className={cn("flex items-end", isNetworkInvalid && "items-center")}>
				<Controller
					control={form.control}
					name={"icon"}
					render={({ field }) => (
						<Field className="shrink-0">
							<IconPicker {...field} popoverProps={{ modal: true }} className="rounded-r-none! border-r-0!" />
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="network"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="flex-1">
							<FieldLabel htmlFor={field.name}>
								<Trans>Network</Trans>
							</FieldLabel>
							<Input className="rounded-l-none!" {...field} id={field.name} aria-invalid={fieldState.invalid} />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</div>

			<Controller
				control={form.control}
				name="username"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Username</Trans>
						</FieldLabel>
						<InputGroup>
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<AtIcon />
								</InputGroupText>
							</InputGroupAddon>

							<InputGroupInput {...field} id={field.name} aria-invalid={fieldState.invalid} />
						</InputGroup>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="website"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="sm:col-span-full">
						<FieldLabel htmlFor={field.name}>
							<Trans>Website</Trans>
						</FieldLabel>
						<URLInput {...field} value={field.value} onChange={field.onChange} aria-invalid={fieldState.invalid} />
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</>
	);
}
