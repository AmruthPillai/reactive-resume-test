import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/integrations/auth/client";

export const Route = createFileRoute("/auth/forgot-password")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session) throw redirect({ to: "/dashboard", replace: true });
		return { session: null };
	},
});

const formSchema = z.object({
	email: z.email(),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading(t`Sending password reset email...`);

		await authClient.requestPasswordReset({
			email: data.email,
			redirectTo: "/auth/reset-password",
			fetchOptions: {
				onSuccess: () => {
					setSubmitted(true);
					toast.dismiss(toastId);
				},
				onError: ({ error }) => {
					toast.error(error.message, { id: toastId });
				},
			},
		});
	};

	if (submitted) return <PostForgotPasswordScreen />;

	return (
		<>
			<div className="space-y-1 text-center">
				<h1 className="font-bold text-2xl tracking-tight">
					<Trans>Forgot your password?</Trans>
				</h1>

				<div className="text-muted-foreground">
					<Trans>
						Remember your password?{" "}
						<Button asChild variant="link" className="h-auto gap-1.5 px-1! py-0">
							<Link to="/auth/login">
								Sign in now <ArrowRightIcon />
							</Link>
						</Button>
					</Trans>
				</div>
			</div>

			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<FieldSet>
					<FieldGroup>
						<Controller
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										<Trans>Email Address</Trans>
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="email"
										autoComplete="email"
										placeholder="john.doe@example.com"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Field orientation="horizontal">
							<Button type="submit" className="flex-1">
								<Trans>Send Password Reset Email</Trans>
							</Button>
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>
		</>
	);
}

function PostForgotPasswordScreen() {
	return (
		<>
			<div className="space-y-1 text-center">
				<h1 className="font-bold text-2xl tracking-tight">
					<Trans>You've got mail!</Trans>
				</h1>
				<p className="text-muted-foreground">
					<Trans>Check your email for a link to reset your password.</Trans>
				</p>
			</div>

			<Button asChild>
				<a href="mailto:">
					<Trans>Open Email Client</Trans>
				</a>
			</Button>
		</>
	);
}
