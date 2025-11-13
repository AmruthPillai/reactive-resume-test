import { Trans } from "@lingui/react/macro";
import {
	CopySimpleIcon,
	DotsThreeVerticalIcon,
	EyeClosedIcon,
	EyeIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { useResumeData } from "@/routes/builder/$resumeId/-hooks/resume";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import type { CustomSection } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";

export function CustomSectionBuilder() {
	const customSections = useResumeData((state) => state.customSections);

	return (
		<SectionBase type="custom" className={cn("rounded-md border", customSections.length === 0 && "border-dashed")}>
			<AnimatePresence>
				{customSections.map((section) => (
					<CustomSectionItem key={section.id} section={section} />
				))}
			</AnimatePresence>

			<SectionAddItemButton type="custom">
				<Trans>Add a new custom section</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}

function CustomSectionItem({ section }: { section: CustomSection }) {
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();
	const updateResume = useResumeStore((state) => state.updateResume);

	const onUpdate = () => {
		openDialog("resume.sections.custom.update", section);
	};

	const onDuplicate = () => {
		openDialog("resume.sections.custom.create", section);
	};

	const onToggleVisibility = () => {
		updateResume((draft) => {
			const customSection = draft.customSections.find((_section) => _section.id === section.id);
			if (!customSection) return;
			customSection.hidden = !customSection.hidden;
		});
	};

	const onDelete = async () => {
		const confirmed = await confirm("Are you sure you want to delete this custom section?", {
			confirmText: "Delete",
			cancelText: "Cancel",
		});

		if (!confirmed) return;

		updateResume((draft) => {
			draft.customSections = draft.customSections.filter((_section) => _section.id !== section.id);
			// remove from layout
			draft.metadata.layout.order.main = draft.metadata.layout.order.main.filter((id) => id !== section.id);
			draft.metadata.layout.order.sidebar = draft.metadata.layout.order.sidebar.filter((id) => id !== section.id);
		});
	};

	return (
		<motion.div
			key={section.id}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="group flex select-none border-b"
		>
			<button
				type="button"
				onClick={onUpdate}
				className={cn(
					"flex flex-1 flex-col items-start justify-center space-y-0.5 p-4 text-left transition-opacity hover:bg-secondary/20 focus:outline-none focus-visible:ring-1",
					section.hidden && "opacity-50",
				)}
			>
				<div className="line-clamp-1 font-medium text-base">{section.title}</div>
				<div
					className="line-clamp-2 text-muted-foreground text-xs"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: safe to use
					dangerouslySetInnerHTML={{ __html: section.content }}
				/>
			</button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="flex cursor-context-menu items-center px-1.5 opacity-40 transition-[background-color,opacity] hover:bg-secondary/20 focus:outline-none focus-visible:ring-1 group-hover:opacity-100"
					>
						<DotsThreeVerticalIcon />
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={onToggleVisibility}>
							{section.hidden ? <EyeIcon /> : <EyeClosedIcon />}
							{section.hidden ? <Trans>Show</Trans> : <Trans>Hide</Trans>}
						</DropdownMenuItem>

						<DropdownMenuItem onSelect={onUpdate}>
							<PencilSimpleLineIcon />
							<Trans>Update</Trans>
						</DropdownMenuItem>

						<DropdownMenuItem onSelect={onDuplicate}>
							<CopySimpleIcon />
							<Trans>Duplicate</Trans>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem variant="destructive" onSelect={onDelete}>
							<TrashSimpleIcon />
							<Trans>Delete</Trans>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</motion.div>
	);
}
