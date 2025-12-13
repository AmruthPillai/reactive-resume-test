import { motion } from "motion/react";

export function Testimonials() {
	return (
		<section id="testimonials" className="flex flex-col gap-y-8 overflow-hidden p-4 md:p-8">
			<div className="space-y-4">
				<h2 className="font-bold text-2xl tracking-tight md:text-4xl xl:text-5xl">Testimonials</h2>

				<p className="text-muted-foreground leading-relaxed lg:max-w-xl">
					Esse ipsum do labore. Ea culpa laborum ullamco sit Lorem magna tempor do. Id Lorem sit ipsum pariatur in ad
					deserunt exercitation dolor elit nisi reprehenderit. Aliquip sunt laboris pariatur. Laborum elit id sit
					consectetur.
				</p>
			</div>

			<div className="-rotate-10 flex flex-col gap-y-6">
				<div className="overflow-hidden">
					<motion.div
						initial={{ x: "0%" }}
						animate={{ x: "-100%" }}
						transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
						className="flex flex-nowrap items-center gap-x-8"
					>
						{new Array(10).fill(0).map((_, index) => (
							<Testimonial key={index} />
						))}
					</motion.div>
				</div>

				<div className="overflow-hidden">
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: "0%" }}
						transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
						className="flex flex-nowrap gap-x-8"
					>
						{new Array(10).fill(0).map((_, index) => (
							<Testimonial key={index} />
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}

function Testimonial() {
	return (
		<div className="relative flex h-[180px] w-[360px] shrink-0 flex-col space-y-1.5 overflow-hidden rounded-md border p-4">
			<h3 className="font-medium tracking-tight">John Doe</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">
				Fugiat laborum enim sunt excepteur nostrud exercitation ut voluptate commodo. Ex adipisicing aliquip culpa
				occaecat id sint ut aliqua nostrud. Amet sint anim id anim sunt. Adipisicing sint eiusmod ex ex pariatur cillum.
			</p>
		</div>
	);
}
