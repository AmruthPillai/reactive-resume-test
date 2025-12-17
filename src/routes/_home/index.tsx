import { createFileRoute } from "@tanstack/react-router";
import { FAQ } from "./-sections/faq";
import { Features } from "./-sections/features";
import { Footer } from "./-sections/footer";
import { Hero } from "./-sections/hero";
import { Prefooter } from "./-sections/prefooter";
import { Statistics } from "./-sections/statistics";
import { Templates } from "./-sections/templates";
import { Testimonials } from "./-sections/testimonials";

export const Route = createFileRoute("/_home/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Hero />

			<div className="container mx-auto px-6 lg:px-12">
				<div className="border-x [&>section:first-child]:border-t-0 [&>section]:border-t">
					<Statistics />
					<Features />
					<Templates />
					<Testimonials />
					<FAQ />
					<Prefooter />
					<Footer />
				</div>
			</div>
		</>
	);
}
