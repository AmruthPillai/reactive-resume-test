import { TranslateIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { GithubStarsButton } from "@/components/input/github-stars-button";
import { LocaleCombobox } from "@/components/locale/combobox";
import { ThemeToggleButton } from "@/components/theme/toggle-button";
import { BrandIcon } from "@/components/ui/brand-icon";

export function Header() {
	return (
		<motion.header
			className="fixed inset-x-0 top-0 z-50 border-transparent border-b bg-background/80 py-3 backdrop-blur-lg transition-colors"
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<div className="container mx-auto flex items-center gap-x-4 px-6 lg:px-12">
				<Link to="/" className="transition-opacity hover:opacity-80">
					<BrandIcon className="size-10" />
				</Link>

				<div className="ml-auto flex items-center gap-x-2">
					<LocaleCombobox
						buttonProps={{
							size: "icon",
							variant: "ghost",
							className: "justify-center",
							children: () => <TranslateIcon />,
						}}
					/>

					<ThemeToggleButton />

					<div className="hidden sm:block">
						<GithubStarsButton />
					</div>
				</div>
			</div>
		</motion.header>
	);
}
