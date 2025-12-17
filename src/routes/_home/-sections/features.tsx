import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CloudArrowUpIcon,
	CodeSimpleIcon,
	CurrencyDollarIcon,
	DatabaseIcon,
	DotsThreeIcon,
	FileCssIcon,
	FilesIcon,
	GithubLogoIcon,
	GlobeIcon,
	type Icon,
	KeyIcon,
	LayoutIcon,
	LockSimpleIcon,
	PaletteIcon,
	ProhibitIcon,
	ShieldCheckIcon,
	TranslateIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { cn } from "@/utils/style";

type Feature = {
	id: string;
	icon: Icon;
	title: string;
	description: string;
};

type FeatureCardProps = Feature & {
	index: number;
};

export const getFeatures = (): Feature[] => [
	{
		id: "free",
		icon: CurrencyDollarIcon,
		title: t`Free`,
		description: t`Completely free, forever, no hidden costs.`,
	},
	{
		id: "open-source",
		icon: GithubLogoIcon,
		title: t`Open Source`,
		description: t`By the community, for the community.`,
	},
	{
		id: "no-ads",
		icon: ProhibitIcon,
		title: t`No Advertising, No Tracking`,
		description: t`For a secure and distraction-free experience.`,
	},
	{
		id: "data-security",
		icon: DatabaseIcon,
		title: t`Data Security`,
		description: t`Your data is secure, and never shared or sold to anyone.`,
	},
	{
		id: "self-host",
		icon: CloudArrowUpIcon,
		title: t`Self-Host with Docker`,
		description: t`You also have the option to deploy on your own servers using the Docker image.`,
	},
	{
		id: "languages",
		icon: TranslateIcon,
		title: t`Multilingual`,
		description: t`Available in multiple languages. If you would like to contribute, check out Crowdin.`,
	},
	{
		id: "auth",
		icon: KeyIcon,
		title: t`One-Click Sign-In`,
		description: t`Sign in with GitHub, Google or a custom OAuth provider.`,
	},
	{
		id: "2fa",
		icon: ShieldCheckIcon,
		title: t`Passkeys & 2FA`,
		description: t`Enhance the security of your account with additional layers of protection.`,
	},
	{
		id: "unlimited-resumes",
		icon: FilesIcon,
		title: t`Unlimited Resumes`,
		description: t`Create as many resumes as you want, without limits.`,
	},
	{
		id: "design",
		icon: PaletteIcon,
		title: t`Flexibility`,
		description: t`Personalize your resume with any colors, fonts or designs, and make it your own.`,
	},
	{
		id: "css",
		icon: FileCssIcon,
		title: t`Custom CSS`,
		description: t`Write your own CSS (or use an AI to generate it for you) to customize your resume to the fullest.`,
	},
	{
		id: "templates",
		icon: LayoutIcon,
		title: t`12+ Templates`,
		description: t`Beautiful templates to choose from, with more on the way.`,
	},
	{
		id: "public",
		icon: GlobeIcon,
		title: t`Shareable Links`,
		description: t`Share your resume with a public URL, and let others view it.`,
	},
	{
		id: "password-protection",
		icon: LockSimpleIcon,
		title: t`Password Protection`,
		description: t`Protect your resume with a password, and let only people with the password view it.`,
	},
	{
		id: "api-access",
		icon: CodeSimpleIcon,
		title: t`API Access`,
		description: t`Access your resumes and data programmatically using the API.`,
	},
	{
		id: "more",
		icon: DotsThreeIcon,
		title: t`And many more...`,
		description: t`New features are constantly being added and improved, so be sure to check back often.`,
	},
];

function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
	return (
		<div
			className={cn(
				"flex min-h-48 flex-col gap-4 border-b bg-background p-6 transition-colors hover:bg-secondary/20",
				"not-nth-[2n]:border-r xl:not-nth-[4n]:border-r",
			)}
		>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.45 }}
				transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
			>
				<Icon size={32} weight="thin" />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 12 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.45 }}
				transition={{ duration: 0.5, delay: index * 0.05 + 0.05, ease: "easeOut" }}
				className="flex flex-col gap-y-1"
			>
				<h3 className="font-medium text-base tracking-tight">{title}</h3>
				<p className="text-muted-foreground leading-relaxed">{description}</p>
			</motion.div>
		</div>
	);
}

export function Features() {
	return (
		<section id="features">
			{/* Header */}
			<div className="space-y-4 p-4 md:p-8 xl:py-16">
				<h2 className="font-semibold text-2xl tracking-tight md:text-4xl xl:text-5xl">
					<Trans>Features</Trans>
				</h2>

				<p className="text-muted-foreground leading-relaxed">
					<Trans>
						Everything you need to create, customize, and share professional resumes. Built with privacy in mind,
						powered by open source, and completely free forever.
					</Trans>
				</p>
			</div>

			{/* Features Grid */}
			<div className="grid grid-cols-2 border-t xl:grid-cols-4">
				{getFeatures().map((feature, index) => (
					<FeatureCard key={feature.id} {...feature} index={index} />
				))}
			</div>
		</section>
	);
}
