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
	toggleLeftSidebar: () => void;
	toggleRightSidebar: () => void;
};

export function useBuilderSidebar<T = UseBuilderSidebarReturn>(selector?: (builder: UseBuilderSidebarReturn) => T): T {
	const isMobile = useIsMobile();
	const { width } = useWindowSize();

	const maxSidebarSize = useMemo(() => {
		if (!width) return 100;
		return Math.round((600 / width) * 100);
	}, [width]);

	const collapsedSidebarSize = useMemo(() => {
		if (!width) return 0;
		return isMobile ? 0 : (48 / width) * 100;
	}, [width, isMobile]);

	const expandSize = useMemo(() => (isMobile ? 95 : 30), [isMobile]);

	const toggleLeftSidebar = useCallback(() => {
		const sidebar = useBuilderSidebarStore.getState().leftSidebar;
		if (!sidebar) return;
		sidebar.isCollapsed() ? sidebar.expand(expandSize) : sidebar.collapse();
	}, [expandSize]);

	const toggleRightSidebar = useCallback(() => {
		const sidebar = useBuilderSidebarStore.getState().rightSidebar;
		if (!sidebar) return;
		sidebar.isCollapsed() ? sidebar.expand(expandSize) : sidebar.collapse();
	}, [expandSize]);

	const state = useMemo(() => {
		return {
			maxSidebarSize,
			collapsedSidebarSize,
			toggleLeftSidebar,
			toggleRightSidebar,
		};
	}, [maxSidebarSize, collapsedSidebarSize, toggleLeftSidebar, toggleRightSidebar]);

	return selector ? selector(state) : (state as T);
}
