"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Calendar, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskData {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  dueDate?: string | null;
  position: number;
  columnId: string;
  createdBy?: string | null;
}

interface KanbanCardProps {
  task: TaskData;
  index: number;
  onClick?: (task: TaskData) => void;
}

const priorityLabels: Record<string, string> = {
  urgent: "Urgente",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

function isOverdue(dueDate: string): boolean {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  const overdue = task.dueDate ? isOverdue(task.dueDate) : false;
  const priorityVariant = task.priority as "urgent" | "high" | "medium" | "low";

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "relative bg-void border border-graphite rounded-lg p-4 mb-2 cursor-pointer",
            "transition-all duration-200 group",
            "border-l-2 border-l-brass",
            "hover:-translate-y-0.5 hover:border-stone/40 hover:shadow-md",
            snapshot.isDragging && "shadow-xl rotate-[2deg] border-brass/40"
          )}
          onClick={() => onClick?.(task)}
        >
          {/* Drag handle */}
          <div
            {...provided.dragHandleProps}
            className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-stone" />
          </div>

          {/* Title */}
          <h4 className="text-sm font-medium text-marble leading-snug line-clamp-2 pr-5">
            {task.title}
          </h4>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* Priority badge */}
            <Badge variant={priorityVariant} className="text-[10px] px-2 py-0.5">
              {priorityLabels[task.priority] ?? task.priority}
            </Badge>

            {/* Due date */}
            {task.dueDate && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px]",
                  overdue ? "text-crimson" : "text-stone"
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
