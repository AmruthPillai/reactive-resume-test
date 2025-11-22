import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { createFileRoute, redirect, SearchParamError, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useToggle } from "usehooks-ts";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/integrations/auth/client";

const searchSchema = z.object({ token: z.string().min(1) });

export const Route = createFileRoute("/auth/reset-password")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session) throw redirect({ to: "/dashboard", replace: true });
		return { session: null };
	},
	validateSearch: zodValidator(searchSchema),
	onError: (error) => {
		if (error instanceof SearchParamError) {
			throw redirect({ to: "/auth/login" });
		}
	},
});

const formSchema = z.object({
	password: z.string().min(6).max(64),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
	const navigate = useNavigate();
	const { token } = Route.useSearch();
	const [showPassword, toggleShowPassword] = useToggle(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading(t`Resetting your password...`);

		await authClient.resetPassword({
			token,
			newPassword: data.password,
			fetchOptions: {
				onSuccess: () => {
					toast.success(t`Your password has been reset successfully. You can now sign in with your new password.`, {
						id: toastId,
					});
					navigate({ to: "/auth/login" });
				},
				onError: ({ error }) => {
					toast.error(error.message, { id: toastId });
				},
			},
		});
	};

	return (
		<>
			<h1 className="text-center font-bold text-2xl tracking-tight">
				<Trans>Reset your password</Trans>
			</h1>

			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
											autoComplete="new-password"
											aria-invalid={fieldState.invalid}
										/>
										<Button size="icon" variant="ghost" onClick={toggleShowPassword}>
											{showPassword ? <EyeIcon /> : <EyeSlashIcon />}
										</Button>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Field orientation="horizontal">
							<Button type="submit" className="flex-1">
								<Trans>Reset Password</Trans>
							</Button>
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>
		</>
	);
}
