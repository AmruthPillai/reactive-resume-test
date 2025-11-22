import { LevelDisplay } from "@/components/level/display";
import { useResumePreview } from "../hooks/use-resume-preview";

type Props = {
	level: number;
	className?: string;
};

export function PageLevel({ level, className }: Props) {
	const { icon, type } = useResumePreview((state) => state.metadata.design.level);

	return <LevelDisplay icon={icon} type={type} level={level} className={className} />;
}
