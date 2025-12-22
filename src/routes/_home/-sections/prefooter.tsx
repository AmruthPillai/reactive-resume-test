import { Trans } from "@lingui/react/macro";
import { GithubLogoIcon, HeartIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { TextMaskEffect } from "@/components/animation/text-mask";
import { Button } from "@/components/ui/button";

export function Prefooter() {
	return (
		<section id="prefooter" className="relative overflow-hidden py-16 md:py-24">
			{/* Background decoration */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute top-0 left-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute right-1/4 bottom-0 size-96 rounded-full bg-primary/5 blur-3xl" />
			</div>

			<div className="relative space-y-8">
				<TextMaskEffect text="Reactive Resume" />

				<motion.div
					className="mx-auto max-w-3xl space-y-8 px-6 text-center md:px-8 xl:px-0"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="font-bold text-2xl tracking-tight md:text-4xl">
						<Trans>By the community, for the community.</Trans>
					</h2>

					<p className="text-muted-foreground leading-relaxed">
						<Trans>
							Reactive Resume thrives thanks to its vibrant community. This project owes its progress to numerous
							individuals who've dedicated their time and skills to make it better. We celebrate the coders who've
							enhanced its features on GitHub, the linguists whose translations on Crowdin have made it accessible to a
							broader audience, and the people who've donated to support its continued development.
						</Trans>
					</p>

					{/* CTA Buttons */}
					<motion.div
						className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<Button asChild size="lg" variant="ghost" className="gap-2">
							<a href="https://github.com/AmruthPillai/Reactive-Resume" target="_blank" rel="noopener noreferrer">
								<GithubLogoIcon className="size-4" />
								<Trans>Star on GitHub</Trans>
							</a>
						</Button>

						<Button asChild size="lg" variant="ghost" className="gap-2 text-rose-500 hover:text-rose-600">
							<a href="https://opencollective.com/reactive-resume" target="_blank" rel="noopener noreferrer">
								<HeartIcon className="size-4" weight="fill" />
								<Trans>Donate</Trans>
							</a>
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
