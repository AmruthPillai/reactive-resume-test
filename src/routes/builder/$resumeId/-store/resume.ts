import { debounce } from "es-toolkit";
import { produce, type WritableDraft } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { RouterOutput } from "@/integrations/orpc/client";
import { orpc } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";

export type Resume = RouterOutput["resume"]["getById"];

interface ResumeStoreState {
	isReady: boolean;
	resume: Resume;
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
	immer((set) => ({
		isReady: false,
		resume: null as unknown as Resume,

		setResume: (resume) => {
			return set((state) => {
				state.resume = resume;
				state.isReady = true;
			});
		},

		updateResume: (fn) => {
			return set((state) => {
				if (!state.resume) return state;
				const updatedData = produce(state.resume.data, fn);
				debouncedSyncResume(state.resume.id, updatedData);
				state.resume.data = updatedData;
			});
		},
	})),
);
