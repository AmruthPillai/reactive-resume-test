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
import { useMutation } from "@tanstack/react-query";
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
import { useResumeStore } from "../-store/resume";
import { useBuilderSidebar } from "../-store/sidebar";

export function BuilderHeader() {
	const resumeId = useResumeStore((state) => state.resume?.id);
	const resumeName = useResumeStore((state) => state.resume?.name ?? "");
	const isLocked = useResumeStore((state) => Boolean(state.resume?.isLocked));

	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	return (
		<div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between bg-popover px-1.5 shadow">
			<Button size="icon" variant="ghost" onClick={() => toggleSidebar("left")}>
				<SidebarSimpleIcon />
			</Button>

			<div className="flex items-center gap-x-1">
				<Button asChild size="icon" variant="ghost">
					<Link to="/dashboard/resumes" search={{ sort: "lastUpdatedAt", tags: [] }}>
						<HouseSimpleIcon />
					</Link>
				</Button>
				<span className="mr-2.5 text-muted-foreground">/</span>
				<h2 className="flex-1 truncate font-medium">{resumeName}</h2>
				{isLocked && <LockSimpleIcon className="ml-2 text-muted-foreground" />}
				<BuilderHeaderDropdown resumeId={resumeId} isLocked={isLocked} />
			</div>

			<Button size="icon" variant="ghost" onClick={() => toggleSidebar("right")}>
				<SidebarSimpleIcon className="-scale-x-100" />
			</Button>
		</div>
	);
}

interface BuilderHeaderDropdownProps {
	resumeId?: string;
	isLocked: boolean;
}

function BuilderHeaderDropdown({ resumeId, isLocked }: BuilderHeaderDropdownProps) {
	const confirm = useConfirm();
	const navigate = useNavigate();
	const { openDialog } = useDialogStore();

	const { mutate: deleteResume } = useMutation(orpc.resume.delete.mutationOptions());
	const { mutate: setLockedResume } = useMutation(orpc.resume.setLocked.mutationOptions());

	if (!resumeId) return null;

	const handleUpdate = () => {
		const resume = useResumeStore.getState().resume;

		openDialog("resume.update", {
			id: resumeId,
			name: resume.name,
			slug: resume.slug,
			tags: resume.tags,
		});
	};

	const handleDuplicate = () => {
		const resume = useResumeStore.getState().resume;

		openDialog("resume.duplicate", {
			id: resumeId,
			name: resume.name,
			slug: resume.slug,
			tags: resume.tags,
			shouldRedirect: true,
		});
	};

	const handleToggleLock = async () => {
		if (!isLocked) {
			const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
				description: t`When locked, the resume cannot be updated or deleted.`,
			});

			if (!confirmation) return;
		}

		setLockedResume(
			{ id: resumeId, isLocked: !isLocked },
			{
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
			{ id: resumeId },
			{
				onSuccess: () => {
					toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
					navigate({ to: "/dashboard/resumes", search: { sort: "lastUpdatedAt", tags: [] } });
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
				<DropdownMenuItem disabled={isLocked} onSelect={handleUpdate}>
					<PencilSimpleLineIcon className="mr-2" />
					<Trans>Update</Trans>
				</DropdownMenuItem>

				<DropdownMenuItem disabled={isLocked} onSelect={handleDuplicate}>
					<CopySimpleIcon className="mr-2" />
					<Trans>Duplicate</Trans>
				</DropdownMenuItem>

				<DropdownMenuItem onSelect={handleToggleLock}>
					{isLocked ? <LockSimpleOpenIcon className="mr-2" /> : <LockSimpleIcon className="mr-2" />}
					{isLocked ? <Trans>Unlock</Trans> : <Trans>Lock</Trans>}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem variant="destructive" disabled={isLocked} onSelect={handleDelete}>
					<TrashSimpleIcon className="mr-2" />
					<Trans>Delete</Trans>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
