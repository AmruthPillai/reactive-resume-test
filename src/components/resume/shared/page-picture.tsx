import { cn } from "@/utils/style";
import { useResumePreview } from "../hooks/use-resume-preview";

export function PagePicture() {
	const name = useResumePreview((data) => data.basics.name);
	const picture = useResumePreview((data) => data.picture);

	return (
		<div
			className={cn("page-picture overflow-hidden", picture.hidden && "hidden", picture.url === "" && "hidden")}
			style={{
				maxWidth: `${picture.size}pt`,
				maxHeight: `${picture.size}pt`,
				aspectRatio: picture.aspectRatio,
				borderRadius: `${picture.borderRadius}%`,
				boxShadow: picture.shadow ? "0 0 5pt 0 rgba(0, 0, 0, 0.25)" : "none",
				border: picture.border ? `5pt solid var(--page-primary-color)` : "none",
			}}
		>
			<img
				alt={name}
				src={picture.url}
				className="size-full object-cover"
				style={{
					transform: `rotate(${picture.rotation}deg)`,
					filter: picture.grayscale ? "grayscale(100%)" : "none",
				}}
			/>
		</div>
	);
}
