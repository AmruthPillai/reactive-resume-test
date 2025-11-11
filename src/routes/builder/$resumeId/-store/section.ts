import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { ExtendedSectionType } from "@/schema/resume/data";

type SectionCollapseState = {
	[id in ExtendedSectionType]?: { collapsed: boolean };
};

type SectionStoreState = {
	sections: SectionCollapseState;
};

type SectionStoreActions = {
	setCollapsed: (id: ExtendedSectionType, collapsed: boolean) => void;
	toggleCollapsed: (id: ExtendedSectionType) => void;
};

type SectionStore = SectionStoreState & SectionStoreActions;

export const useSectionStore = create<SectionStore>()(
	persist(
		immer((set) => ({
			sections: {},
			setCollapsed: (id, collapsed) => {
				set((state) => {
					state.sections[id] = { collapsed };
				});
			},
			toggleCollapsed: (id) => {
				set((state) => {
					const current = state.sections[id]?.collapsed ?? false;
					state.sections[id] = { collapsed: !current };
				});
			},
		})),
		{
			name: "section-store",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				sections: state.sections,
			}),
		},
	),
);
