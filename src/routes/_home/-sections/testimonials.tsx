import { Trans } from "@lingui/react/macro";
import { QuotesIcon, StarIcon } from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

const testimonials = [
	{
		name: "John Doe",
		role: "Software Engineer",
		avatar: "JD",
		text: "Reactive Resume made it incredibly easy to create a polished, professional resume. The templates are beautiful and the customization options are endless.",
	},
	{
		name: "Jane Smith",
		role: "Product Designer",
		avatar: "JS",
		text: "I love how intuitive the interface is. Within minutes, I had a stunning resume ready to share. The real-time preview is a game changer!",
	},
	{
		name: "Alex Johnson",
		role: "Marketing Manager",
		avatar: "AJ",
		text: "Finally, a resume builder that respects my privacy and doesn't try to upsell me at every turn. It's completely free and works amazingly well.",
	},
	{
		name: "Sarah Williams",
		role: "Data Analyst",
		avatar: "SW",
		text: "The ability to self-host was a huge plus for me. I deployed it on my own server and now have complete control over my data.",
	},
	{
		name: "Mike Chen",
		role: "Full Stack Developer",
		avatar: "MC",
		text: "As a developer, I appreciate the attention to detail in the codebase. The custom CSS feature lets me fine-tune every aspect of my resume.",
	},
	{
		name: "Emily Davis",
		role: "UX Researcher",
		avatar: "ED",
		text: "The multiple export options and shareable links make it so easy to apply to jobs. I've recommended Reactive Resume to all my colleagues.",
	},
];

type TestimonialCardProps = {
	testimonial: (typeof testimonials)[number];
	index: number;
};

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = { damping: 30, stiffness: 200 };
	const xSpring = useSpring(x, springConfig);
	const ySpring = useSpring(y, springConfig);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const distanceX = (e.clientX - centerX) * 0.08;
		const distanceY = (e.clientY - centerY) * 0.08;

		x.set(distanceX);
		y.set(distanceY);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.div
			ref={ref}
			className="group relative"
			style={{ x: xSpring, y: ySpring }}
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<motion.div
				className="relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-lg"
				whileHover={{ scale: 1.02, zIndex: 10 }}
				transition={{ type: "spring", stiffness: 400, damping: 25 }}
			>
				{/* Gradient overlay on hover */}
				<div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				{/* Star ratings */}
				<div className="relative mb-4 flex gap-0.5">
					{[...Array(5)].map((_, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, scale: 0 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.08 + i * 0.05 + 0.2 }}
						>
							<StarIcon size={14} weight="fill" className="text-amber-400" />
						</motion.div>
					))}
				</div>

				{/* Quote */}
				<p className="relative mb-4 flex-1 text-muted-foreground text-sm leading-relaxed">"{testimonial.text}"</p>

				{/* Author */}
				<div className="relative flex items-center gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
						{testimonial.avatar}
					</div>
					<div>
						<p className="font-semibold text-sm tracking-tight">{testimonial.name}</p>
						<p className="text-muted-foreground text-xs">{testimonial.role}</p>
					</div>
				</div>

				{/* Quote icon */}
				<motion.div
					className="pointer-events-none absolute top-4 right-4 text-primary/10"
					initial={{ scale: 0, rotate: -10 }}
					whileInView={{ scale: 1, rotate: 0 }}
					viewport={{ once: true }}
					transition={{ delay: index * 0.08 + 0.3, type: "spring", stiffness: 200, damping: 15 }}
				>
					<QuotesIcon size={32} weight="fill" />
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

export function Testimonials() {
	return (
		<section id="testimonials" className="flex flex-col gap-y-8 p-4 md:p-8 xl:py-16">
			<motion.div
				className="space-y-4"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
			>
				<h2 className="font-semibold text-2xl tracking-tight md:text-4xl xl:text-5xl">
					<Trans>Testimonials</Trans>
				</h2>

				<p className="max-w-2xl text-muted-foreground leading-relaxed">
					<Trans>
						Hear from the people who are using Reactive Resume to build their careers. If you have a story to share,
						please reach out to me at{" "}
						<a
							href="mailto:hello@amruthpillai.com"
							className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-primary"
						>
							hello@amruthpillai.com
						</a>
						.
					</Trans>
				</p>
			</motion.div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
				{testimonials.map((testimonial, index) => (
					<TestimonialCard key={index} testimonial={testimonial} index={index} />
				))}
			</div>
		</section>
	);
}
