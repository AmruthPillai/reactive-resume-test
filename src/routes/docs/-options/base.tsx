import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
	return {
		githubUrl: "https://github.com/AmruthPillai/Reactive-Resume",
		themeSwitch: { enabled: false },
		nav: {
			url: "/",
			title: "Reactive Resume",
		},
	};
}
