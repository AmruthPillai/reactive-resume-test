import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CaretDownIcon,
	CopySimpleIcon,
	HouseSimpleIcon,
	LockSimpleIcon,
	LockSimpleOpenIcon,
	PencilSimpleLineIcon,
	SidebarSimpleIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { orpc } from "@/integrations/orpc/client";
import { useBuilderSidebar } from "../-context/builder";
import { useResumeStore } from "../-store/resume";

export function BuilderHeader() {
	const resume = useResumeStore((state) => state.resume);
	const { toggleLeftSidebar, toggleRightSidebar } = useBuilderSidebar();

	return (
		<div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between bg-popover px-1.5 shadow">
			<Button size="icon" variant="ghost" onClick={toggleLeftSidebar}>
				<SidebarSimpleIcon />
			</Button>

			<div className="flex items-center gap-x-1">
				<Button asChild size="icon" variant="ghost">
					<Link to="/dashboard/resumes" search={{ sort: "lastUpdatedAt", tags: [] }}>
						<HouseSimpleIcon />
					</Link>
				</Button>
				<span className="mr-2.5 text-muted-foreground">/</span>
				<h2 className="font-medium">{resume?.name}</h2>
				{resume?.isLocked && <LockSimpleIcon className="ml-2 text-muted-foreground" />}
				<BuilderHeaderDropdown />
			</div>

			<Button size="icon" variant="ghost" onClick={toggleRightSidebar}>
				<SidebarSimpleIcon className="-scale-x-100" />
			</Button>
		</div>
	);
}

function BuilderHeaderDropdown() {
	const confirm = useConfirm();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { openDialog } = useDialogStore();
	const resume = useResumeStore((state) => state.resume);

	const { mutate: deleteResume } = useMutation(orpc.resume.delete.mutationOptions());
	const { mutate: setLockedResume } = useMutation(orpc.resume.setLocked.mutationOptions());

	if (!resume) return null;

	const handleUpdate = () => {
		openDialog("resume.update", resume);
	};

	const handleDuplicate = () => {
		openDialog("resume.duplicate", { ...resume, shouldRedirect: true });
	};

	const handleToggleLock = async () => {
		if (!resume.isLocked) {
			const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
				description: t`When locked, the resume cannot be updated or deleted.`,
			});

			if (!confirmation) return;
		}

		setLockedResume(
			{ id: resume.id, isLocked: !resume.isLocked },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: orpc.resume.key() });
				},
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	};

	const handleDelete = async () => {
		const confirmation = await confirm(t`Are you sure you want to delete this resume?`, {
			description: t`This action cannot be undone.`,
		});

		if (!confirmation) return;

		const toastId = toast.loading(t`Deleting your resume...`);

		deleteResume(
			{ id: resume.id },
			{
				onSuccess: () => {
					toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
					navigate({ to: "/dashboard/resumes", search: { sort: "lastUpdatedAt", tags: [] } });
					queryClient.invalidateQueries({ queryKey: orpc.resume.key() });
				},
				onError: (error) => {
					toast.error(error.message, { id: toastId });
				},
			},
		);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<CaretDownIcon />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuItem disabled={resume.isLocked} onSelect={handleUpdate}>
					<PencilSimpleLineIcon className="mr-2" />
					<Trans>Update</Trans>
				</DropdownMenuItem>

				<DropdownMenuItem disabled={resume.isLocked} onSelect={handleDuplicate}>
					<CopySimpleIcon className="mr-2" />
					<Trans>Duplicate</Trans>
				</DropdownMenuItem>

				<DropdownMenuItem onSelect={handleToggleLock}>
					{resume.isLocked ? <LockSimpleOpenIcon className="mr-2" /> : <LockSimpleIcon className="mr-2" />}
					{resume.isLocked ? <Trans>Unlock</Trans> : <Trans>Lock</Trans>}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem variant="destructive" disabled={resume.isLocked} onSelect={handleDelete}>
					<TrashSimpleIcon className="mr-2" />
					<Trans>Delete</Trans>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
