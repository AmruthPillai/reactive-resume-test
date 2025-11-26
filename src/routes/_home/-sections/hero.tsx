import { Trans } from "@lingui/react/macro";
import { BookIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CometCard } from "@/components/animation/comet-card";
import { Spotlight } from "@/components/animation/spotlight";
import { Button } from "@/components/ui/button";

export function Hero() {
	return (
		<section
			id="hero"
			className="relative flex h-svh w-svw flex-col items-center justify-center overflow-hidden border-b"
		>
			<Spotlight />

			<motion.div
				initial={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 2, ease: "easeInOut" }}
			>
				<CometCard glareOpacity={0} className="-mb-12 md:-mb-24 relative max-w-4xl px-8 md:px-12 lg:px-0">
					<video
						loop
						muted
						autoPlay
						src="/videos/timelapse.webm"
						className="pointer-events-none aspect-video size-full rounded-md object-cover"
					/>

					<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-40% via-transparent to-background" />
				</CometCard>
			</motion.div>

			<div className="relative z-10 flex max-w-2xl flex-col items-center gap-y-8 px-4 xs:px-0 text-center">
				<div>
					<Trans>
						<p className="font-semibold tracking-tight md:text-lg">Finally,</p>
						<h1 className="font-bold text-4xl tracking-tight md:text-6xl">A free and open-source resume builder</h1>
					</Trans>
				</div>

				<p className="text-base text-muted-foreground leading-relaxed">
					<Trans>
						Reactive Resume is a free and open-source resume builder that simplifies the process of creating, updating,
						and sharing your resume.
					</Trans>
				</p>

				<div className="flex items-center gap-x-2">
					<Button asChild size="lg">
						<Link to="/dashboard">
							<Trans>Get Started</Trans>
						</Link>
					</Button>

					<Button asChild size="lg" variant="link">
						<Link to="/">
							<BookIcon />
							<Trans>Learn More</Trans>
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
