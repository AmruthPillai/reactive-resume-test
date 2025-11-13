import { Trans } from "@lingui/react/macro";
import { AnimatePresence, Reorder } from "motion/react";
import type z from "zod";
import { useResumeData } from "@/builder/-hooks/resume";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import type { awardItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton, SectionItem } from "../shared/section-item";

export function AwardsSectionBuilder() {
	const section = useResumeData((state) => state.sections.awards);
	const updateResume = useResumeStore((state) => state.updateResume);

	const handleReorder = (items: z.infer<typeof awardItemSchema>[]) => {
		updateResume((draft) => {
			draft.sections.awards.items = items;
		});
	};

	return (
		<SectionBase type="awards" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<Reorder.Group axis="y" values={section.items} onReorder={handleReorder}>
				<AnimatePresence>
					{section.items.map((item) => (
						<SectionItem key={item.id} type="awards" item={item} title={item.title} subtitle={item.awarder} />
					))}
				</AnimatePresence>
			</Reorder.Group>

			<SectionAddItemButton type="awards">
				<Trans>Add a new award</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
