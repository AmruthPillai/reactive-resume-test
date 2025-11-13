import { useCallback, useMemo } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { useWindowSize } from "usehooks-ts";
import { create } from "zustand";
import { useIsMobile } from "@/hooks/use-mobile";

interface BuilderSidebarState {
	leftSidebar: ImperativePanelHandle | null;
	rightSidebar: ImperativePanelHandle | null;
}

interface BuilderSidebarActions {
	setLeftSidebar: (ref: ImperativePanelHandle | null) => void;
	setRightSidebar: (ref: ImperativePanelHandle | null) => void;
}

type BuilderSidebar = BuilderSidebarState & BuilderSidebarActions;

export const useBuilderSidebarStore = create<BuilderSidebar>((set) => ({
	isDragging: false,
	leftSidebar: null,
	rightSidebar: null,
	setLeftSidebar: (ref) => set({ leftSidebar: ref }),
	setRightSidebar: (ref) => set({ rightSidebar: ref }),
}));

type UseBuilderSidebarReturn = {
	maxSidebarSize: number;
	collapsedSidebarSize: number;
	toggleSidebar: (side: "left" | "right", forceState?: boolean) => void;
};

export function useBuilderSidebar<T = UseBuilderSidebarReturn>(selector?: (builder: UseBuilderSidebarReturn) => T): T {
	const isMobile = useIsMobile();
	const { width } = useWindowSize();

	const maxSidebarSize = useMemo(() => {
		if (!width) return 100;
		return Math.round((800 / width) * 100);
	}, [width]);

	const collapsedSidebarSize = useMemo(() => {
		if (!width) return 0;
		return isMobile ? 0 : (48 / width) * 100;
	}, [width, isMobile]);

	const expandSize = useMemo(() => (isMobile ? 95 : 30), [isMobile]);

	const toggleSidebar = useCallback(
		(side: "left" | "right", forceState?: boolean) => {
			const sidebar =
				side === "left"
					? useBuilderSidebarStore.getState().leftSidebar
					: useBuilderSidebarStore.getState().rightSidebar;

			if (!sidebar) return;

			const shouldExpand = forceState === undefined ? sidebar.isCollapsed() : forceState;
			if (shouldExpand) sidebar.resize(expandSize);
			else sidebar.collapse();
		},
		[expandSize],
	);

	const state = useMemo(() => {
		return {
			maxSidebarSize,
			collapsedSidebarSize,
			toggleSidebar,
		};
	}, [maxSidebarSize, collapsedSidebarSize, toggleSidebar]);

	return selector ? selector(state) : (state as T);
}
