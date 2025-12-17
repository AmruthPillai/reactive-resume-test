import { Trans } from "@lingui/react/macro";
import { QuotesIcon } from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

const testimonials = [
	{
		name: "John Doe",
		text: "Fugiat laborum enim sunt excepteur nostrud exercitation ut voluptate commodo. Ex adipisicing aliquip culpa occaecat id sint ut aliqua nostrud.",
	},
	{
		name: "Jane Smith",
		text: "Amet sint anim id anim sunt. Adipisicing sint eiusmod ex ex pariatur cillum. Non reprehenderit elit commodo occaecat laborum Lorem minim.",
	},
	{
		name: "Alex Johnson",
		text: "Esse ipsum do labore. Ea culpa laborum ullamco sit Lorem magna tempor do. Id Lorem sit ipsum pariatur in ad deserunt exercitation.",
	},
	{
		name: "Sarah Williams",
		text: "Aliquip sunt laboris pariatur. Laborum elit id sit consectetur. Fugiat laborum enim sunt excepteur nostrud exercitation ut voluptate.",
	},
	{
		name: "Mike Chen",
		text: "Ex adipisicing aliquip culpa occaecat id sint ut aliqua nostrud. Amet sint anim id anim sunt. Adipisicing sint eiusmod ex ex pariatur.",
	},
	{
		name: "Emily Davis",
		text: "Non reprehenderit elit commodo occaecat laborum Lorem minim eu cupidatat tempor officia anim deserunt. Esse ipsum do labore.",
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

	const springConfig = { damping: 25, stiffness: 200 };
	const xSpring = useSpring(x, springConfig);
	const ySpring = useSpring(y, springConfig);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const distanceX = (e.clientX - centerX) * 0.1;
		const distanceY = (e.clientY - centerY) * 0.1;

		x.set(distanceX);
		y.set(distanceY);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	const variants = {
		hidden: { opacity: 0, y: 30, scale: 0.95 },
		visible: { opacity: 1, y: 0, scale: 1 },
	};

	return (
		<motion.div
			ref={ref}
			className="group relative"
			initial="hidden"
			variants={variants}
			whileInView="visible"
			style={{ x: xSpring, y: ySpring }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<motion.div
				className="relative flex h-[180px] flex-col space-y-1.5 overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-shadow duration-300 group-hover:shadow-xl"
				whileHover={{ scale: 1.02, zIndex: 10 }}
				transition={{ type: "spring", stiffness: 400, damping: 25 }}
			>
				<motion.div
					className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-br from-primary/5 via-transparent to-transparent"
					initial={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				/>

				<div className="relative z-10">
					<h3 className="mb-2 font-semibold tracking-tight">{testimonial.name}</h3>
					<p className="text-muted-foreground text-sm leading-relaxed">{testimonial.text}</p>
				</div>

				<motion.div
					className="pointer-events-none absolute top-4 right-4 text-foreground/30"
					viewport={{ once: true }}
					initial={{ scale: 0, rotate: -10 }}
					whileInView={{ scale: 1, rotate: 0 }}
					transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200, damping: 15 }}
				>
					<QuotesIcon />
				</motion.div>

				<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 rounded-b-lg bg-linear-to-b from-transparent to-background" />
			</motion.div>
		</motion.div>
	);
}

export function Testimonials() {
	return (
		<section id="testimonials" className="flex flex-col gap-y-8 p-4 md:p-8 xl:py-16">
			<div className="space-y-4">
				<h2 className="font-semibold text-2xl tracking-tight md:text-4xl xl:text-5xl">
					<Trans>Testimonials</Trans>
				</h2>

				<p className="text-muted-foreground leading-relaxed">
					<Trans>
						Hear from the people who are using Reactive Resume to build their careers. If you have a story to share,
						please reach out to me at <a href="mailto:hello@amruthpillai.com">hello@amruthpillai.com</a>.
					</Trans>
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:gap-8">
				{testimonials.map((testimonial, index) => (
					<TestimonialCard key={index} testimonial={testimonial} index={index} />
				))}
			</div>
		</section>
	);
}
