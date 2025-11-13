import { Trans } from "@lingui/react/macro";
import { AnimatePresence, Reorder } from "motion/react";
import type z from "zod";
import { useResumeData } from "@/builder/-hooks/resume";
import { useResumeStore } from "@/routes/builder/$resumeId/-store/resume";
import type { experienceItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton, SectionItem } from "../shared/section-item";

export function ExperienceSectionBuilder() {
	const section = useResumeData((state) => state.sections.experience);
	const updateResume = useResumeStore((state) => state.updateResume);

	const handleReorder = (items: z.infer<typeof experienceItemSchema>[]) => {
		updateResume((draft) => {
			draft.sections.experience.items = items;
		});
	};

	return (
		<SectionBase type="experience" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<Reorder.Group axis="y" values={section.items} onReorder={handleReorder}>
				<AnimatePresence>
					{section.items.map((item) => (
						<SectionItem key={item.id} type="experience" item={item} title={item.company} subtitle={item.position} />
					))}
				</AnimatePresence>
			</Reorder.Group>

			<SectionAddItemButton type="experience">
				<Trans>Add a new experience</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
