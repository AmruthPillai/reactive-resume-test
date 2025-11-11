import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData } from "@/builder/-hooks/resume";
import { useResumeStore } from "@/builder/-store/resume";
import { URLInput } from "@/components/input/url-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSectionStore } from "@/routes/builder/$resumeId/-store/section";
import { basicsSchema } from "@/schema/resume/data";
import { getSectionIcon, getSectionTitle } from "@/utils/resume/section";
import { cn } from "@/utils/style";
import { CustomFieldsSection } from "./custom-fields";

export function BasicsSectionBuilder() {
	const collapsed = useSectionStore((state) => state.sections.basics?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);

	return (
		<div id="sidebar-basics" className="space-y-4">
			<div className="flex items-center">
				<Button size="icon" variant="ghost" className="mr-1.5" onClick={() => toggleCollapsed("basics")}>
					<CaretDownIcon className={cn("transition-transform", collapsed && "-rotate-90")} />
				</Button>

				<div className="flex flex-1 items-center gap-x-4">
					{getSectionIcon("basics")}
					<h2 className="line-clamp-1 font-bold text-2xl tracking-tight">{getSectionTitle("basics")}</h2>
				</div>
			</div>

			<AnimatePresence>
				{!collapsed && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
					>
						<BasicsSectionForm />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function BasicsSectionForm() {
	const basics = useResumeData((state) => state.basics);
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm({
		resolver: zodResolver(basicsSchema),
		defaultValues: basics,
		mode: "onChange",
	});

	const onSubmit = (data: z.infer<typeof basicsSchema>) => {
		updateResume((draft) => {
			draft.basics = data;
		});
	};

	return (
		<Form {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Name</Trans>
							</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="headline"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Headline</Trans>
							</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Email</Trans>
							</FormLabel>
							<FormControl>
								<Input type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Phone</Trans>
							</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Location</Trans>
							</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="website"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<Trans>Website</Trans>
							</FormLabel>
							<FormControl>
								<URLInput {...field} value={field.value} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<CustomFieldsSection onSubmit={onSubmit} />
			</form>
		</Form>
	);
}
