import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { AnimatePresence, motion } from "motion/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { useResumeData, useResumeStore } from "@/builder/-store/resume";
import { ColorPicker } from "@/components/input/color-picker";
import { IconPicker } from "@/components/input/icon-picker";
import { LevelTypeCombobox } from "@/components/level/combobox";
import { LevelDisplay } from "@/components/level/display";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { colorDesignSchema, levelDesignSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";

export function DesignSectionBuilder() {
	return (
		<SectionBase type="design" className="space-y-6">
			<ColorSectionForm />
			<Separator />
			<LevelSectionForm />
		</SectionBase>
	);
}

function ColorSectionForm() {
	const colors = useResumeData((state) => state.metadata.design.colors);
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<z.infer<typeof colorDesignSchema>>({
		mode: "onChange",
		resolver: zodResolver(colorDesignSchema),
		defaultValues: colors,
	});

	const onSubmit = (data: z.infer<typeof colorDesignSchema>) => {
		updateResume((draft) => {
			draft.metadata.design.colors = data;
		});
	};

	return (
		<FormProvider {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
				<Controller
					control={form.control}
					name="primary"
					render={({ field }) => (
						<Field className="flex flex-wrap gap-2.5 p-1">
							{quickColorOptions.map((color) => (
								<QuickColorCircle
									key={color}
									color={color}
									active={color === field.value}
									onSelect={(color) => {
										field.onChange(color);
										form.handleSubmit(onSubmit)();
									}}
								/>
							))}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="primary"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								<Trans>Primary Color</Trans>
							</FieldLabel>
							<div className="flex items-center gap-2">
								<ColorPicker
									value={field.value}
									onChange={(color) => {
										field.onChange(color);
										form.handleSubmit(onSubmit)();
									}}
								/>
								<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="text"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								<Trans>Text Color</Trans>
							</FieldLabel>
							<div className="flex items-center gap-2">
								<ColorPicker
									value={field.value}
									onChange={(color) => {
										field.onChange(color);
										form.handleSubmit(onSubmit)();
									}}
								/>
								<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="background"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								<Trans>Background Color</Trans>
							</FieldLabel>
							<div className="flex items-center gap-2">
								<ColorPicker
									value={field.value}
									onChange={(color) => {
										field.onChange(color);
										form.handleSubmit(onSubmit)();
									}}
								/>
								<Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</form>
		</FormProvider>
	);
}

const quickColorOptions = [
	"#E7000B", // red-600
	"#F54900", // orange-600
	"#E17100", // amber-600
	"#D08700", // yellow-600
	"#5EA500", // lime-600
	"#00A63E", // green-600
	"#009966", // emerald-600
	"#009689", // teal-600
	"#0092B8", // cyan-600
	"#0084D1", // sky-600
	"#155DFC", // blue-600
	"#4F39F6", // indigo-600
	"#7F22FE", // violet-600
	"#9810FA", // purple-600
	"#C800DE", // fuchsia-600
	"#E60076", // pink-600
	"#EC003F", // rose-600
	"#45556C", // slate-600
	"#4A5565", // gray-600
	"#52525C", // zinc-600
	"#525252", // neutral-600
	"#57534D", // stone-600
];

type QuickColorCircleProps = React.ComponentProps<"button"> & {
	color: string;
	active: boolean;
	onSelect: (color: string) => void;
};

function QuickColorCircle({ color, active, onSelect, className, ...props }: QuickColorCircleProps) {
	return (
		<button
			type="button"
			onClick={() => onSelect(color)}
			className={cn(
				"relative flex size-8 items-center justify-center rounded-sm bg-transparent",
				"scale-100 transition-transform hover:scale-120 hover:bg-secondary/80 active:scale-95",
				className,
			)}
			{...props}
		>
			<div style={{ backgroundColor: color }} className="size-6 shrink-0 rounded-sm" />

			<AnimatePresence>
				{active && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0 }}
						className="absolute inset-0 flex size-8 items-center justify-center"
					>
						<div className="size-4 rounded-sm bg-foreground" />
					</motion.div>
				)}
			</AnimatePresence>
		</button>
	);
}

function LevelSectionForm() {
	const colors = useResumeData((state) => state.metadata.design.colors);
	const levelDesign = useResumeData((state) => state.metadata.design.level);
	const updateResume = useResumeStore((state) => state.updateResume);

	const form = useForm<z.infer<typeof levelDesignSchema>>({
		mode: "onChange",
		resolver: zodResolver(levelDesignSchema),
		defaultValues: levelDesign,
	});

	const onSubmit = (data: z.infer<typeof levelDesignSchema>) => {
		updateResume((draft) => {
			draft.metadata.design.level = data;
		});
	};

	return (
		<FormProvider {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
				<h4 className="font-semibold text-lg leading-none tracking-tight">
					<Trans>Level</Trans>
				</h4>

				<div
					style={{ "--page-primary-color": colors.primary, backgroundColor: colors.background } as React.CSSProperties}
					className="flex items-center justify-center rounded-sm p-6"
				>
					<LevelDisplay
						level={3}
						type={form.watch("type")}
						icon={form.watch("icon")}
						className="w-full max-w-[220px] justify-center"
					/>
				</div>

				<div className="flex items-center gap-4">
					<Controller
						control={form.control}
						name="icon"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="shrink-0">
								<FieldLabel htmlFor={field.name}>
									<Trans>Icon</Trans>
								</FieldLabel>
								<IconPicker
									size="default"
									value={field.value}
									aria-invalid={fieldState.invalid}
									onChange={(value) => {
										field.onChange(value);
										form.handleSubmit(onSubmit)();
									}}
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="type"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="flex-1">
								<FieldLabel htmlFor={field.name}>
									<Trans>Type</Trans>
								</FieldLabel>
								<LevelTypeCombobox
									value={field.value}
									aria-invalid={fieldState.invalid}
									onValueChange={(value) => {
										if (!value) return;
										field.onChange(value);
										form.handleSubmit(onSubmit)();
									}}
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</div>
			</form>
		</FormProvider>
	);
}
