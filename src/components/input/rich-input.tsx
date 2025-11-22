import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CodeBlockIcon,
	CodeSimpleIcon,
	HighlighterCircleIcon,
	KeyReturnIcon,
	LinkBreakIcon,
	LinkIcon,
	ListBulletsIcon,
	ListNumbersIcon,
	MinusIcon,
	ParagraphIcon,
	PlusIcon,
	TableIcon,
	TextAlignCenterIcon,
	TextAlignJustifyIcon,
	TextAlignLeftIcon,
	TextAlignRightIcon,
	TextBolderIcon,
	TextHFiveIcon,
	TextHFourIcon,
	TextHOneIcon,
	TextHSixIcon,
	TextHThreeIcon,
	TextHTwoIcon,
	TextIndentIcon,
	TextItalicIcon,
	TextOutdentIcon,
	TextStrikethroughIcon,
	TextUnderlineIcon,
} from "@phosphor-icons/react";
import Highlight from "@tiptap/extension-highlight";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import {
	type Editor,
	EditorContent,
	EditorContext,
	type UseEditorOptions,
	useEditor,
	useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import { toast } from "sonner";
import z from "zod";
import { usePrompt } from "@/hooks/use-prompt";
import { cn } from "@/utils/style";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Toggle } from "../ui/toggle";

const extensions = [
	StarterKit.configure({
		heading: {
			levels: [1, 2, 3, 4, 5, 6],
		},
		link: {
			openOnClick: false,
			enableClickSelection: true,
			defaultProtocol: "https",
			protocols: ["http", "https"],
		},
		codeBlock: {
			enableTabIndentation: true,
			HTMLAttributes: {
				class: "bg-zinc-950! text-zinc-50! text-xs! leading-relaxed",
			},
		},
	}),
	Highlight.configure({
		HTMLAttributes: {
			class: "bg-(--page-primary-color) text-(--page-background-color) rounded-md px-0.5 py-px",
		},
	}),
	TextAlign.configure({ types: ["heading", "paragraph"] }),
	TableKit.configure(),
];

type Props = UseEditorOptions & {
	value: string;
	onChange: (value: string) => void;
};

export function RichInput({ value, onChange, ...options }: Props) {
	const editor = useEditor({
		content: value,
		extensions,
		immediatelyRender: false,
		shouldRerenderOnTransaction: false,
		editorProps: {
			attributes: {
				spellcheck: "false",
				"data-editor": "true",
				class: cn(
					"group tiptap-content",
					"max-h-[400px] min-h-[100px] overflow-y-auto p-3 pb-0 focus:outline-none",
					"rounded-md rounded-t-none border focus-visible:border-ring",
				),
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		...options,
	});

	const providerValue = useMemo(() => ({ editor }), [editor]);

	if (!editor) return null;

	return (
		<EditorContext value={providerValue}>
			<div className="rounded-md">
				<EditorToolbar editor={editor} />
				<EditorContent editor={editor} />
			</div>
		</EditorContext>
	);
}

function EditorToolbar({ editor }: { editor: Editor }) {
	const prompt = usePrompt();

	const state = useEditorState({
		editor,
		selector: (ctx) => {
			return {
				// Bold
				isBold: ctx.editor.isActive("bold") ?? false,
				canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
				toggleBold: () => ctx.editor.chain().focus().toggleBold().run(),

				// Italic
				isItalic: ctx.editor.isActive("italic") ?? false,
				canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
				toggleItalic: () => ctx.editor.chain().focus().toggleItalic().run(),

				// Underline
				isUnderline: ctx.editor.isActive("underline") ?? false,
				canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
				toggleUnderline: () => ctx.editor.chain().focus().toggleUnderline().run(),

				// Strike
				isStrike: ctx.editor.isActive("strike") ?? false,
				canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
				toggleStrike: () => ctx.editor.chain().focus().toggleStrike().run(),

				// Highlight
				isHighlight: ctx.editor.isActive("highlight") ?? false,
				canHighlight: ctx.editor.can().chain().toggleHighlight().run() ?? false,
				toggleHighlight: () => ctx.editor.chain().focus().toggleHighlight().run(),

				// Heading 1
				isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
				canHeading1: ctx.editor.can().chain().toggleHeading({ level: 1 }).run() ?? false,
				toggleHeading1: () => ctx.editor.chain().focus().toggleHeading({ level: 1 }).run(),

				// Heading 2
				isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
				canHeading2: ctx.editor.can().chain().toggleHeading({ level: 2 }).run() ?? false,
				toggleHeading2: () => ctx.editor.chain().focus().toggleHeading({ level: 2 }).run(),

				// Heading 3
				isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
				canHeading3: ctx.editor.can().chain().toggleHeading({ level: 3 }).run() ?? false,
				toggleHeading3: () => ctx.editor.chain().focus().toggleHeading({ level: 3 }).run(),

				// Heading 4
				isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
				canHeading4: ctx.editor.can().chain().toggleHeading({ level: 4 }).run() ?? false,
				toggleHeading4: () => ctx.editor.chain().focus().toggleHeading({ level: 4 }).run(),

				// Heading 5
				isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
				canHeading5: ctx.editor.can().chain().toggleHeading({ level: 5 }).run() ?? false,
				toggleHeading5: () => ctx.editor.chain().focus().toggleHeading({ level: 5 }).run(),

				// Heading 6
				isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
				canHeading6: ctx.editor.can().chain().toggleHeading({ level: 6 }).run() ?? false,
				toggleHeading6: () => ctx.editor.chain().focus().toggleHeading({ level: 6 }).run(),

				// Paragraph
				isParagraph: ctx.editor.isActive("paragraph") ?? false,
				canParagraph: ctx.editor.can().chain().setParagraph().run() ?? false,
				setParagraph: () => ctx.editor.chain().focus().setParagraph().run(),

				// Left Align
				isLeftAlign: ctx.editor.isActive({ textAlign: "left" }) ?? false,
				canLeftAlign: ctx.editor.can().chain().toggleTextAlign("left").run() ?? false,
				toggleLeftAlign: () => ctx.editor.chain().focus().toggleTextAlign("left").run(),

				// Center Align
				isCenterAlign: ctx.editor.isActive({ textAlign: "center" }) ?? false,
				canCenterAlign: ctx.editor.can().chain().toggleTextAlign("center").run() ?? false,
				toggleCenterAlign: () => ctx.editor.chain().focus().toggleTextAlign("center").run(),

				// Right Align
				isRightAlign: ctx.editor.isActive({ textAlign: "right" }) ?? false,
				canRightAlign: ctx.editor.can().chain().toggleTextAlign("right").run() ?? false,
				toggleRightAlign: () => ctx.editor.chain().focus().toggleTextAlign("right").run(),

				// Justify Align
				isJustifyAlign: ctx.editor.isActive({ textAlign: "justify" }) ?? false,
				canJustifyAlign: ctx.editor.can().chain().toggleTextAlign("justify").run() ?? false,
				toggleJustifyAlign: () => ctx.editor.chain().focus().toggleTextAlign("justify").run(),

				// Bullet List
				isBulletList: ctx.editor.isActive("bulletList") ?? false,
				canBulletList: ctx.editor.can().chain().toggleBulletList().run() ?? false,
				toggleBulletList: () => ctx.editor.chain().focus().toggleBulletList().run(),

				// Ordered List
				isOrderedList: ctx.editor.isActive("orderedList") ?? false,
				canOrderedList: ctx.editor.can().chain().toggleOrderedList().run() ?? false,
				toggleOrderedList: () => ctx.editor.chain().focus().toggleOrderedList().run(),

				// Outdent List Item
				canLiftListItem: ctx.editor.can().chain().liftListItem("listItem").run() ?? false,
				liftListItem: () => ctx.editor.chain().focus().liftListItem("listItem").run(),

				// Indent List Item
				canSinkListItem: ctx.editor.can().chain().sinkListItem("listItem").run() ?? false,
				sinkListItem: () => ctx.editor.chain().focus().sinkListItem("listItem").run(),

				// Link
				isLink: ctx.editor.isActive("link") ?? false,
				setLink: async () => {
					const url = await prompt(t`Please enter the URL you want to link to:`, {
						defaultValue: "https://",
					});

					if (!url || url.trim() === "") {
						ctx.editor.chain().focus().unsetLink().run();
						return;
					}

					if (!z.url({ protocol: /^https?$/ }).safeParse(url).success) {
						toast.error(t`The URL you entered is not valid.`, {
							description: t`Valid URLs must start with http:// or https://.`,
						});
						return;
					}

					ctx.editor
						.chain()
						.focus()
						.setLink({ href: url, target: "_blank", rel: "noopener noreferrer nofollow" })
						.run();
				},
				unsetLink: () => ctx.editor.chain().focus().unsetLink().run(),

				// Inline Code
				isInlineCode: ctx.editor.isActive("code") ?? false,
				canInlineCode: ctx.editor.can().chain().toggleCode().run() ?? false,
				toggleInlineCode: () => ctx.editor.chain().focus().toggleCode().run(),

				// Code Block
				isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
				canCodeBlock: ctx.editor.can().chain().toggleCodeBlock().run() ?? false,
				toggleCodeBlock: () => ctx.editor.chain().focus().toggleCodeBlock().run(),

				// Table
				insertTable: () => ctx.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
				addColumnBefore: () => ctx.editor.chain().focus().addColumnBefore().run(),
				addColumnAfter: () => ctx.editor.chain().focus().addColumnAfter().run(),
				addRowBefore: () => ctx.editor.chain().focus().addRowBefore().run(),
				addRowAfter: () => ctx.editor.chain().focus().addRowAfter().run(),
				deleteColumn: () => ctx.editor.chain().focus().deleteColumn().run(),
				deleteRow: () => ctx.editor.chain().focus().deleteRow().run(),
				deleteTable: () => ctx.editor.chain().focus().deleteTable().run(),

				// Hard Break
				setHardBreak: () => ctx.editor.chain().focus().setHardBreak().run(),

				// Horizontal Rule
				setHorizontalRule: () => ctx.editor.chain().focus().setHorizontalRule().run(),
			};
		},
	});

	return (
		<div className="flex flex-wrap items-center gap-y-0.5 rounded-md rounded-b-none border border-b-0">
			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Bold`}
				pressed={state.isBold}
				disabled={!state.canBold}
				onPressedChange={state.toggleBold}
			>
				<TextBolderIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Italic`}
				pressed={state.isItalic}
				disabled={!state.canItalic}
				onPressedChange={state.toggleItalic}
			>
				<TextItalicIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Underline`}
				pressed={state.isUnderline}
				disabled={!state.canUnderline}
				onPressedChange={state.toggleUnderline}
			>
				<TextUnderlineIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Strike`}
				pressed={state.isStrike}
				disabled={!state.canStrike}
				onPressedChange={state.toggleStrike}
			>
				<TextStrikethroughIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Highlight`}
				pressed={state.isHighlight}
				disabled={!state.canHighlight}
				onPressedChange={state.toggleHighlight}
			>
				<HighlighterCircleIcon className="size-3.5" />
			</Toggle>

			<div className="mx-1 h-5 w-px bg-border" />

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Heading 1`}
				pressed={state.isHeading1}
				disabled={!state.canHeading1}
				onPressedChange={state.toggleHeading1}
			>
				<TextHOneIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Heading 2`}
				pressed={state.isHeading2}
				disabled={!state.canHeading2}
				onPressedChange={state.toggleHeading2}
			>
				<TextHTwoIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Heading 3`}
				pressed={state.isHeading3}
				disabled={!state.canHeading3}
				onPressedChange={state.toggleHeading3}
			>
				<TextHThreeIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Heading 4`}
				pressed={state.isHeading4}
				disabled={!state.canHeading4}
				onPressedChange={state.toggleHeading4}
			>
				<TextHFourIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Heading 5`}
				pressed={state.isHeading5}
				disabled={!state.canHeading5}
				onPressedChange={state.toggleHeading5}
			>
				<TextHFiveIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Heading 6`}
				pressed={state.isHeading6}
				disabled={!state.canHeading6}
				onPressedChange={state.toggleHeading6}
			>
				<TextHSixIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Paragraph`}
				pressed={state.isParagraph}
				disabled={!state.canParagraph}
				onPressedChange={state.setParagraph}
			>
				<ParagraphIcon className="size-3.5" />
			</Toggle>

			<div className="mx-1 h-5 w-px bg-border" />

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Left Align`}
				pressed={state.isLeftAlign}
				disabled={!state.canLeftAlign}
				onPressedChange={state.toggleLeftAlign}
			>
				<TextAlignLeftIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Center Align`}
				pressed={state.isCenterAlign}
				disabled={!state.canCenterAlign}
				onPressedChange={state.toggleCenterAlign}
			>
				<TextAlignCenterIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Right Align`}
				pressed={state.isRightAlign}
				disabled={!state.canRightAlign}
				onPressedChange={state.toggleRightAlign}
			>
				<TextAlignRightIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Justify Align`}
				pressed={state.isJustifyAlign}
				disabled={!state.canJustifyAlign}
				onPressedChange={state.toggleJustifyAlign}
			>
				<TextAlignJustifyIcon className="size-3.5" />
			</Toggle>

			<div className="mx-1 h-5 w-px bg-border" />

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Bullet List`}
				pressed={state.isBulletList}
				disabled={!state.canBulletList}
				onPressedChange={state.toggleBulletList}
			>
				<ListBulletsIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Ordered List`}
				pressed={state.isOrderedList}
				disabled={!state.canOrderedList}
				onPressedChange={state.toggleOrderedList}
			>
				<ListNumbersIcon className="size-3.5" />
			</Toggle>

			<Button
				size="sm"
				tabIndex={-1}
				variant="ghost"
				className="rounded-none"
				disabled={!state.canLiftListItem}
				onClick={state.liftListItem}
			>
				<TextOutdentIcon className="size-3.5" />
			</Button>

			<Button
				size="sm"
				tabIndex={-1}
				variant="ghost"
				className="rounded-none"
				disabled={!state.canSinkListItem}
				onClick={state.sinkListItem}
			>
				<TextIndentIcon className="size-3.5" />
			</Button>

			<div className="mx-1 h-5 w-px bg-border" />

			{state.isLink ? (
				<Button size="sm" tabIndex={-1} variant="ghost" className="rounded-none" onClick={state.unsetLink}>
					<LinkBreakIcon className="size-3.5" />
				</Button>
			) : (
				<Button size="sm" tabIndex={-1} variant="ghost" className="rounded-none" onClick={state.setLink}>
					<LinkIcon className="size-3.5" />
				</Button>
			)}

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Inline Code`}
				pressed={state.isInlineCode}
				disabled={!state.canInlineCode}
				onPressedChange={state.toggleInlineCode}
			>
				<CodeSimpleIcon className="size-3.5" />
			</Toggle>

			<Toggle
				size="sm"
				tabIndex={-1}
				className="rounded-none"
				title={t`Code Block`}
				pressed={state.isCodeBlock}
				disabled={!state.canCodeBlock}
				onPressedChange={state.toggleCodeBlock}
			>
				<CodeBlockIcon className="size-3.5" />
			</Toggle>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="sm" tabIndex={-1} variant="ghost" className="rounded-none" title={t`Table`}>
						<TableIcon className="size-3.5" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuItem onSelect={state.insertTable}>
						<PlusIcon />
						<Trans>Insert Table</Trans>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={state.addColumnBefore}>
						<Trans>Add Column Before</Trans>
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={state.addColumnAfter}>
						<Trans>Add Column After</Trans>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={state.addRowBefore}>
						<Trans>Add Row Before</Trans>
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={state.addRowAfter}>
						<Trans>Add Row After</Trans>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={state.deleteColumn}>
						<Trans>Delete Column</Trans>
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={state.deleteRow}>
						<Trans>Delete Row</Trans>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive" onSelect={state.deleteTable}>
						<Trans>Delete Table</Trans>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Button
				size="sm"
				tabIndex={-1}
				variant="ghost"
				className="rounded-none"
				title={t`New Line`}
				onClick={state.setHardBreak}
			>
				<KeyReturnIcon className="size-3.5" />
			</Button>

			<Button
				size="sm"
				tabIndex={-1}
				variant="ghost"
				className="rounded-none"
				title={t`Separator`}
				onClick={state.setHorizontalRule}
			>
				<MinusIcon className="size-3.5" />
			</Button>
		</div>
	);
}

type TiptapContentProps = React.ComponentProps<"div"> & {
	content: string;
};

export function TiptapContent({ content, className, ...props }: TiptapContentProps) {
	return (
		<div>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Safe to render HTML content */}
			<div className={cn("tiptap-content", className)} dangerouslySetInnerHTML={{ __html: content }} {...props} />
		</div>
	);
}
