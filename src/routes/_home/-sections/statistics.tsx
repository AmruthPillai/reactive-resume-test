import { t } from "@lingui/core/macro";
import { CountUp } from "@/components/animation/count-up";

const getStatistics = () => [
	{
		id: "users",
		label: t`Users`,
		value: 650_000,
	},
	{
		id: "resumes",
		label: t`Resumes`,
		value: 840_000,
	},
];

export function Statistics() {
	return (
		<section id="statistics">
			{/* Statistics Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2">
				{getStatistics().map((statistic) => (
					<div
						key={statistic.id}
						className="flex flex-col items-center justify-center gap-y-3 border-r border-b p-8 last:border-r-0 last:border-b-0 sm:border-b-0 xl:py-16"
					>
						<CountUp
							key={statistic.id}
							separator=","
							duration={0.5}
							to={statistic.value}
							className="font-bold text-5xl tracking-tight"
						/>

						<p className="font-medium text-base text-muted-foreground tracking-tight">{statistic.label}</p>
					</div>
				))}
			</div>
		</section>
	);
}
