import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { type CSSProperties, forwardRef, type HTMLAttributes, useCallback, useState } from "react";
import { match } from "ts-pattern";
import { useResumeData } from "@/builder/-hooks/resume";
import { useResumeStore } from "@/builder/-store/resume";
import type { SectionType } from "@/schema/resume/data";
import { cn } from "@/utils/style";

type ColumnId = "main" | "sidebar";

const getColumnLabel = (columnId: ColumnId): string => {
	return match(columnId)
		.with("main", () => t`Main`)
		.with("sidebar", () => t`Sidebar`)
		.exhaustive();
};

export function LayoutOrder() {
	const [activeId, setActiveId] = useState<string | null>(null);

	const layout = useResumeData((state) => state.metadata.layout);
	const updateResume = useResumeStore((state) => state.updateResume);

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

	/**
	 * Returns the column ("main" or "sidebar") that contains the given section id.
	 * If the id itself is a column id, returns it directly.
	 * If not found in either column, returns null.
	 */
	const findContainer = useCallback(
		(id: string): ColumnId | null => {
			if (id === "main" || id === "sidebar") return id;
			if (layout.order.main.includes(id)) return "main";
			if (layout.order.sidebar.includes(id)) return "sidebar";
			return null;
		},
		[layout.order.main, layout.order.sidebar],
	);

	const handleDragStart = useCallback((event: DragStartEvent) => setActiveId(String(event.active.id)), []);

	const handleDragEnd = useCallback(
		({ active, over }: DragEndEvent) => {
			setActiveId(null);
			if (!over) return;

			const activeIdStr = String(active.id);
			const overIdStr = String(over.id);

			if (activeIdStr === overIdStr) return;

			const activeCol = findContainer(activeIdStr);
			const overCol = findContainer(overIdStr);
			if (!activeCol || !overCol) return;

			if (activeCol === overCol) {
				const items = layout.order[activeCol];
				const oldIdx = items.indexOf(activeIdStr);
				let newIdx = items.indexOf(overIdStr);
				if (oldIdx === -1 || oldIdx === newIdx) return;
				if (newIdx === -1) newIdx = items.length - 1;

				updateResume((draft) => {
					const colOrder = draft.metadata.layout.order[activeCol];
					draft.metadata.layout.order[activeCol] = arrayMove(colOrder, oldIdx, newIdx);
				});
				return;
			}

			const fromItems = layout.order[activeCol];
			const toItems = layout.order[overCol];
			const fromIdx = fromItems.indexOf(activeIdStr);
			if (fromIdx === -1) return;

			let toIdx = toItems.indexOf(overIdStr);
			if (toIdx === -1) toIdx = toItems.length;

			updateResume((draft) => {
				const order = draft.metadata.layout.order;
				const from = order[activeCol];
				const to = order[overCol];
				from.splice(fromIdx, 1);
				to.splice(Math.min(toIdx, to.length), 0, activeIdStr);
			});
		},
		[findContainer, layout.order, updateResume],
	);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragCancel={() => setActiveId(null)}
		>
			<div className="grid w-full @md:grid-cols-2 gap-x-4 gap-y-2 font-medium">
				<LayoutColumn columnId="main" items={layout.order.main} />
				<LayoutColumn columnId="sidebar" items={layout.order.sidebar} />
			</div>

			<DragOverlay>{activeId ? <LayoutItemContent id={activeId} isDragging isOverlay /> : null}</DragOverlay>
		</DndContext>
	);
}

type LayoutColumnProps = {
	columnId: ColumnId;
	items: string[];
};

function LayoutColumn({ columnId, items }: LayoutColumnProps) {
	const { setNodeRef, isOver } = useDroppable({ id: columnId });

	return (
		<SortableContext id={columnId} items={items} strategy={verticalListSortingStrategy}>
			<div className="@md:row-start-1 pl-4 font-medium text-xs">{getColumnLabel(columnId)}</div>

			<div
				ref={setNodeRef}
				className={cn(
					"space-y-2.5 rounded-md border border-dashed bg-background/40 p-3 pb-8 transition-colors",
					isOver && "border-primary/60 bg-primary/5",
				)}
			>
				{items.map((id) => (
					<SortableLayoutItem key={id} id={id} />
				))}

				{items.length === 0 && (
					<div className="rounded-sm border border-dashed p-4 font-medium text-muted-foreground text-xs">
						<Trans>Drag and drop sections here to move them between columns</Trans>
					</div>
				)}
			</div>
		</SortableContext>
	);
}

type SortableLayoutItemProps = {
	id: string;
};

function SortableLayoutItem({ id }: SortableLayoutItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition };

	return (
		<LayoutItemContent ref={setNodeRef} id={id} style={style} isDragging={isDragging} {...attributes} {...listeners} />
	);
}

type LayoutItemContentProps = HTMLAttributes<HTMLDivElement> & {
	id: string;
	isDragging?: boolean;
	isOverlay?: boolean;
};

const LayoutItemContent = forwardRef<HTMLDivElement, LayoutItemContentProps>(
	({ id, isDragging, isOverlay, className, style, ...rest }, ref) => {
		const title = useResumeData((state) => {
			if (id === "summary") return state.summary.title;
			if (id in state.sections) return state.sections[id as SectionType].title;
			const customSection = state.customSections.find((section) => section.id === id);
			if (customSection) return customSection.title;
			return id;
		});

		return (
			<div
				ref={ref}
				style={style}
				data-overlay={isOverlay ? "true" : undefined}
				data-dragging={isDragging ? "true" : undefined}
				className={cn(
					"group/item flex cursor-grab touch-none select-none items-center gap-x-2 rounded-sm border border-border bg-background px-2 py-1.5 font-medium text-sm transition-all duration-200 ease-out",
					"hover:bg-secondary/20 active:cursor-grabbing active:border-primary/60 active:bg-secondary/20",
					"data-[overlay=true]:cursor-grabbing data-[overlay=true]:border-primary/60 data-[overlay=true]:bg-background",
					"data-[dragging=true]:cursor-grabbing data-[dragging=true]:border-primary/60 data-[dragging=true]:bg-background",
					className,
				)}
				{...rest}
			>
				<DotsSixVerticalIcon className="opacity-40 transition-opacity group-hover/item:opacity-100" />
				<span className="truncate">{title}</span>
			</div>
		);
	},
);

LayoutItemContent.displayName = "LayoutItemContent";
