import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useToggle } from "usehooks-ts";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/integrations/auth/client";
import { SocialAuth } from "./-components/social-auth";

export const Route = createFileRoute("/auth/register")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session) throw redirect({ to: "/dashboard", replace: true });
		return { session: null };
	},
});

const formSchema = z.object({
	name: z.string().min(3).max(64),
	username: z
		.string()
		.min(3)
		.max(64)
		.trim()
		.toLowerCase()
		.regex(/^[a-z0-9._-]+$/, {
			message: "Username can only contain lowercase letters, numbers, dots, hyphens and underscores.",
		}),
	email: z.email().toLowerCase(),
	password: z.string().min(6).max(64),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
	const [submitted, setSubmitted] = useState(false);
	const [showPassword, toggleShowPassword] = useToggle(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading(t`Signing up...`);

		await authClient.signUp.email({
			name: data.name,
			email: data.email,
			password: data.password,
			username: data.username,
			displayUsername: data.username,
			callbackURL: "/dashboard",
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

	if (submitted) return <PostSignupScreen />;

	return (
		<>
			<div className="space-y-1 text-center">
				<h1 className="font-bold text-2xl tracking-tight">
					<Trans>Create a new account</Trans>
				</h1>

				<div className="text-muted-foreground">
					<Trans>
						Already have an account?{" "}
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
							name="name"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										<Trans>Name</Trans>
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										min={3}
										max={64}
										autoComplete="name"
										placeholder="John Doe"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name="username"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										<Trans>Username</Trans>
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										min={3}
										max={64}
										autoComplete="username"
										placeholder="john.doe"
										className="lowercase"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

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
										className="lowercase"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

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
								<Trans>Sign up</Trans>
							</Button>
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>

			<SocialAuth />
		</>
	);
}

function PostSignupScreen() {
	return (
		<>
			<div className="space-y-1 text-center">
				<h1 className="font-bold text-2xl tracking-tight">
					<Trans>You've got mail!</Trans>
				</h1>
				<p className="text-muted-foreground">
					<Trans>Check your email for a link to verify your account.</Trans>
				</p>
			</div>

			<Alert>
				<AlertTitle>
					<Trans>This step is optional, but recommended.</Trans>
				</AlertTitle>
				<AlertDescription>
					<Trans>Verifying your email is required when resetting your password.</Trans>
				</AlertDescription>
			</Alert>

			<Button asChild>
				<Link to="/dashboard">
					<Trans>Continue</Trans> <ArrowRightIcon />
				</Link>
			</Button>
		</>
	);
}
