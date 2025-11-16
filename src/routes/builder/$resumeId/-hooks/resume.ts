import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useLayoutEffect, useRef } from "react";
import { orpc } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";
import { type Resume, useResumeStore } from "../-store/resume";

/**
 * Hook to fetch and manage resume state using Zustand store.
 * Fetches the resume using oRPC and stores it in the Zustand store.
 * The store state is accessible from anywhere within the /builder/$resumeId DOM tree.
 *
 * @returns The resume state, loading state, and store actions for updating the resume
 */
export function useResume() {
	const dataRef = useRef<Resume | null>(null);
	const params = useParams({ from: "/builder/$resumeId" });
	const setResume = useResumeStore((state) => state.setResume);

	const { data } = useSuspenseQuery(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } }));

	// Set the store when data is available
	// useLayoutEffect runs synchronously after all DOM mutations but before paint,
	// ensuring the store is populated before the browser paints
	useLayoutEffect(() => {
		if (dataRef.current !== data) {
			dataRef.current = data;
			setResume(data);
		}
	}, [data, setResume]);

	return data;
}

export function useResumeData<T = ResumeData>(selector?: (data: ResumeData) => T): T {
	const selected = useResumeStore((state) => {
		if (!state.resume) return null;
		return selector ? selector(state.resume.data) : (state.resume.data as T);
	});

	if (selected === null) throw new Error("Resume not loaded.");

	return selected;
}
