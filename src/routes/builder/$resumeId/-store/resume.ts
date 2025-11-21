import { debounce } from "es-toolkit";
import type { WritableDraft } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { RouterOutput } from "@/integrations/orpc/client";
import { orpc } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";

export type Resume = RouterOutput["resume"]["getById"];

interface ResumeStoreState {
	resume: Resume;
	isReady: boolean;
}

interface ResumeStoreActions {
	setResume: (resume: Resume) => void;
	updateResume: (fn: (draft: WritableDraft<ResumeData>) => void) => void;
}

type ResumeStore = ResumeStoreState & ResumeStoreActions;

const syncResume = async (id: string, data: ResumeData) => {
	await orpc.resume.update.call({ id, data });
};

const debouncedSyncResume = debounce(syncResume, 500);

export const useResumeStore = create<ResumeStore>()(
	immer((set, get) => ({
		isReady: false,
		resume: null as unknown as Resume,

		setResume: (resume) => {
			return set((state) => {
				state.resume = resume;
				state.isReady = true;
			});
		},

		updateResume: (fn) => {
			set((state) => {
				if (!state.resume) return state;
				fn(state.resume.data as WritableDraft<ResumeData>);
			});

			const resume = get().resume;
			if (!resume) return;

			debouncedSyncResume(resume.id, resume.data);
		},
	})),
);

export function useResumeData<T = ResumeData>(selector?: (data: ResumeData) => T): T {
	const selected = useResumeStore((state) => {
		if (!state.resume) return null;
		return selector ? selector(state.resume.data) : (state.resume.data as T);
	});

	if (selected === null) throw new Error("Resume not loaded.");

	return selected;
}
