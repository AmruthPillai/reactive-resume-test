import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ORPCError } from "@orpc/client";
import { EyeIcon, EyeSlashIcon, LockOpenIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, SearchParamError, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useToggle } from "usehooks-ts";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { orpc } from "@/integrations/orpc/client";

const searchSchema = z.object({
	redirect: z
		.string()
		.min(1)
		.regex(/^\/[^/]+\/[^/]+$/),
});

export const Route = createFileRoute("/auth/resume-password")({
	component: RouteComponent,
	validateSearch: zodValidator(searchSchema),
	onError: (error) => {
		if (error instanceof SearchParamError) {
			throw redirect({ to: "/" });
		}
	},
});

const formSchema = z.object({
	password: z.string().min(6).max(64),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();
	const [showPassword, toggleShowPassword] = useToggle(false);

	const { mutate: verifyPassword } = useMutation(orpc.auth.verifyResumePassword.mutationOptions());

	const [username, slug] = useMemo(() => {
		const [username, slug] = redirect.split("/").slice(1) as [string, string];
		if (!username || !slug) throw navigate({ to: "/" });
		return [username, slug];
	}, [redirect, navigate]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading(t`Verifying password...`);

		verifyPassword(
			{ username, slug, password: data.password },
			{
				onSuccess: () => {
					toast.dismiss(toastId);
					navigate({ to: redirect, replace: true });
				},
				onError: (error) => {
					if (error instanceof ORPCError && error.code === "INVALID_PASSWORD") {
						toast.dismiss(toastId);
						form.setError("password", { message: t`The password you entered is incorrect` });
					} else {
						toast.error(error.message, { id: toastId });
					}
				},
			},
		);
	};

	return (
		<>
			<div className="space-y-4 text-center">
				<h1 className="font-bold text-2xl tracking-tight">
					<Trans>The resume you are trying to access is password protected</Trans>
				</h1>

				<div className="text-muted-foreground leading-relaxed">
					<Trans>Please enter the password shared with you by the owner of the resume to continue.</Trans>
				</div>
			</div>

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
								<LockOpenIcon />
								<Trans>Unlock</Trans>
							</Button>
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>
		</>
	);
}
