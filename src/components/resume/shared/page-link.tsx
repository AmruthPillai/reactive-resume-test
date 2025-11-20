type Props = {
	url: string;
	label?: string;
};

export function PageLink({ url, label }: Props) {
	if (!url) return null;

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="font-semibold underline underline-offset-2 print:no-underline"
		>
			{label || url}
		</a>
	);
}
