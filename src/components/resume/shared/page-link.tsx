type Props = {
	url: string;
	label?: string;
	className?: string;
};

export function PageLink({ url, label, className }: Props) {
	if (!url) return null;

	return (
		<a href={url} target="_blank" rel="noopener noreferrer" className={className}>
			{label || url}
		</a>
	);
}
