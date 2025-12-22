import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import type { WritableDraft } from "immer";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand/react";

export type AIProvider = "openai" | "gemini" | "anthropic";

type AIStoreState = {
	provider: AIProvider;
	model: string;
	apiKey: string;
};

type AIStoreActions = {
	isEnabled: () => boolean;
	getModel: () => LanguageModel | null;
	set: (fn: (draft: WritableDraft<AIStoreState>) => void) => void;
	reset: () => void;
};

type AIStore = AIStoreState & AIStoreActions;

const initialState: AIStoreState = {
	provider: "openai",
	model: "",
	apiKey: "",
};

export const useAIStore = create<AIStore>()(
	persist(
		immer((set, get) => ({
			...initialState,

			isEnabled: () => {
				const { provider, model, apiKey } = get();
				return !!provider && !!model && !!apiKey;
			},

			getModel: () => {
				const { provider, model, apiKey } = get();

				if (provider === "openai") {
					const client = createOpenAI({ apiKey });
					return client(model);
				}

				if (provider === "gemini") {
					const client = createGoogleGenerativeAI({ apiKey });
					return client(model);
				}

				if (provider === "anthropic") {
					const client = createAnthropic({ apiKey });
					return client(model);
				}

				return null;
			},

			set,
			reset: () => set(() => initialState),
		})),
		{
			name: "ai-store",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				provider: state.provider,
				model: state.model,
				apiKey: state.apiKey,
			}),
		},
	),
);
