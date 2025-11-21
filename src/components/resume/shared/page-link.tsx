type Props = {
	url: string;
	label?: string;
};

export function PageLink({ url, label }: Props) {
	if (!url) return null;

	return (
		<a href={url} target="_blank" rel="noopener noreferrer">
			{label || url}
		</a>
	);
}
