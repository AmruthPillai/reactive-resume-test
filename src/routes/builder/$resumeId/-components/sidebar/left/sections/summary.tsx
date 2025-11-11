import { t } from "@lingui/core/macro";
import { Plural, Trans } from "@lingui/react/macro";
import {
	CaretDownIcon,
	ColumnsIcon,
	EyeClosedIcon,
	EyeIcon,
	ListIcon,
	PencilSimpleLineIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useResumeData } from "@/builder/-hooks/resume";
import { useResumeStore } from "@/builder/-store/resume";
import { RichInput } from "@/components/input/rich-input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrompt } from "@/hooks/use-prompt";
import { useSectionStore } from "@/routes/builder/$resumeId/-store/section";
import { getSectionIcon, getSectionTitle } from "@/utils/resume/section";
import { cn } from "@/utils/style";
import { SectionMask } from "../shared/section-mask";

export function SummarySectionBuilder() {
	const section = useResumeData((state) => state.summary);
	const updateResume = useResumeStore((state) => state.updateResume);

	const collapsed = useSectionStore((state) => state.sections.summary?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);

	const onChange = (value: string) => {
		updateResume((draft) => {
			draft.summary.content = value;
		});
	};

	return (
		<div id="sidebar-summary" className="space-y-4">
			<div className="flex items-center">
				<Button size="icon" variant="ghost" className="mr-1.5" onClick={() => toggleCollapsed("summary")}>
					<CaretDownIcon className={cn("transition-transform", collapsed && "-rotate-90")} />
				</Button>

				<div className="flex flex-1 items-center gap-x-4">
					{getSectionIcon("summary")}
					<h2 className="line-clamp-1 font-bold text-2xl tracking-tight">{section.title}</h2>
				</div>

				<SummaryDropdownMenu />
			</div>

			<AnimatePresence>
				{!collapsed && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
						className="relative flex flex-col gap-4"
					>
						<SectionMask hidden={section.hidden} />

						<RichInput value={section.content} onChange={onChange} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function SummaryDropdownMenu() {
	const prompt = usePrompt();
	const section = useResumeData((state) => state.summary);
	const updateResume = useResumeStore((state) => state.updateResume);

	const onToggleVisibility = () => {
		updateResume((draft) => {
			draft.summary.hidden = !draft.summary.hidden;
		});
	};

	const onRenameSection = async () => {
		const newTitle = await prompt(t`What do you want to rename this section to?`, {
			description: t`Leave empty to reset the title to the original.`,
			defaultValue: section.title,
		});

		if (!newTitle) {
			updateResume((draft) => {
				draft.summary.title = getSectionTitle("summary");
			});
			return;
		}

		updateResume((draft) => {
			draft.summary.title = newTitle;
		});
	};

	const onSetColumns = (value: string) => {
		updateResume((draft) => {
			draft.summary.columns = parseInt(value, 10);
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<ListIcon />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem onSelect={onToggleVisibility}>
						{section.hidden ? <EyeIcon /> : <EyeClosedIcon />}
						{section.hidden ? <Trans>Show</Trans> : <Trans>Hide</Trans>}
					</DropdownMenuItem>

					<DropdownMenuItem onSelect={onRenameSection}>
						<PencilSimpleLineIcon />
						<Trans>Rename</Trans>
					</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<ColumnsIcon />
							<Trans>Columns</Trans>
						</DropdownMenuSubTrigger>

						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value={section.columns.toString()} onValueChange={onSetColumns}>
								{[1, 2, 3, 4].map((column) => (
									<DropdownMenuRadioItem key={column} value={column.toString()}>
										<Plural value={column} one="# Column" other="# Columns" />
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
