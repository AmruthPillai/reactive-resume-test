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
	try {
		await orpc.resume.updateData.call({ id, data });
	} catch (err) {
		console.error("Failed to update resume in backend:", err);
	}
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
