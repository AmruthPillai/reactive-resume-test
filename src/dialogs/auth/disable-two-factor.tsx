import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { EyeIcon, EyeSlashIcon, LockOpenIcon } from "@phosphor-icons/react";
import { useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useToggle } from "usehooks-ts";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/integrations/auth/client";
import { type DialogProps, useDialogStore } from "../store";

const formSchema = z.object({
	password: z.string().min(6).max(64),
});

type FormValues = z.infer<typeof formSchema>;

export function DisableTwoFactorDialog({ open, onOpenChange }: DialogProps<"auth.two-factor.disable">) {
	const router = useRouter();
	const { closeDialog } = useDialogStore();
	const [showPassword, toggleShowPassword] = useToggle(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading(t`Disabling two-factor authentication...`);

		const { error } = await authClient.twoFactor.disable({ password: data.password });

		if (error) {
			toast.error(error.message, { id: toastId });
			return;
		}

		toast.success(t`Two-factor authentication has been disabled successfully.`, { id: toastId });
		router.invalidate();
		closeDialog();
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-x-2">
						<LockOpenIcon />
						<Trans>Disable Two-Factor Authentication</Trans>
					</DialogTitle>
					<DialogDescription>
						<Trans>
							Enter your password to disable two-factor authentication. Your account will be less secure without 2FA
							enabled.
						</Trans>
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
					<FieldSet>
						<FieldGroup>
							<Controller
								control={form.control}
								name="password"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											<Trans>Password</Trans>
										</FieldLabel>
										<div className="flex items-center gap-x-1.5">
											<Input
												{...field}
												id={field.name}
												min={6}
												max={64}
												type={showPassword ? "text" : "password"}
												autoComplete="current-password"
												aria-invalid={fieldState.invalid}
											/>
											<Button size="icon" variant="ghost" type="button" onClick={toggleShowPassword}>
												{showPassword ? <EyeIcon /> : <EyeSlashIcon />}
											</Button>
										</div>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>

							<DialogFooter>
								<Button type="submit" variant="destructive">
									<Trans>Disable 2FA</Trans>
								</Button>
							</DialogFooter>
						</FieldGroup>
					</FieldSet>
				</form>
			</DialogContent>
		</Dialog>
	);
}
