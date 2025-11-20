import { CircleNotchIcon, PrinterIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useCallback, useLayoutEffect } from "react";
import { z } from "zod";
import { ResumePreview } from "@/components/resume/preview";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc/client";
import { verifyPrinterToken } from "@/utils/printer-token";

const searchSchema = z.object({
	token: z.string().min(1),
});

export const Route = createFileRoute("/printer/$resumeId")({
	component: RouteComponent,
	validateSearch: zodValidator(searchSchema),
	beforeLoad: async ({ params, search }) => {
		try {
			// Verify the token and ensure it matches the resume ID
			const tokenResumeId = verifyPrinterToken(search.token);
			if (tokenResumeId !== params.resumeId) throw new Error();
		} catch {
			// Invalid or missing token - throw error to be caught by error handler
			throw redirect({ to: "/", search: {}, throw: true });
		}
	},
	loader: async ({ params }) => {
		const resume = await orpc.resume.getByIdForPrinter.call({ id: params.resumeId });
		return { resume };
	},
});

function RouteComponent() {
	const { resume } = Route.useLoaderData();

	const { mutateAsync: printAsPDF, isPending } = useMutation(orpc.resume.printer.printAsPDF.mutationOptions());

	useLayoutEffect(() => {
		document.documentElement.classList.replace("dark", "light");
		document.body.style.backgroundColor = "white";
	}, []);

	const onPrint = useCallback(async () => {
		const file = await printAsPDF({ id: resume.id });

		const url = URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = url;
		link.download = file.name;
		link.click();
		URL.revokeObjectURL(url);
	}, [resume.id, printAsPDF]);

	return (
		<div className="size-full">
			<Button size="icon" disabled={isPending} className="fixed right-4 bottom-4 print:hidden" onClick={onPrint}>
				{isPending ? <CircleNotchIcon className="animate-spin" /> : <PrinterIcon />}
			</Button>

			<ResumePreview data={resume.data} />
		</div>
	);
}
