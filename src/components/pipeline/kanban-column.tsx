"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { KanbanCard } from "./kanban-card";
import { CreateTaskForm } from "./create-task-form";
import { useState } from "react";

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

interface KanbanColumnProps {
  columnId: string;
  name: string;
  color?: string | null;
  tasks: TaskData[];
  projectId: string;
  onCreateTask: (input: {
    projectId: string;
    columnId: string;
    title: string;
    priority?: string;
  }) => Promise<void>;
  onTaskClick?: (task: TaskData) => void;
}

export function KanbanColumn({
  columnId,
  name,
  color,
  tasks,
  projectId,
  onCreateTask,
  onTaskClick,
}: KanbanColumnProps) {
  const [showForm, setShowForm] = useState(false);

  const handleCreateTask = async (title: string, priority?: string) => {
    await onCreateTask({
      projectId,
      columnId,
      title,
      priority,
    });
    setShowForm(false);
  };

  return (
    <div className="min-w-[300px] max-w-[300px] flex flex-col bg-charcoal border border-graphite rounded-xl max-h-full">
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-graphite">
        <div className="flex items-center gap-2.5">
          {color && (
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
          )}
          <h3 className="text-sm font-semibold text-champagne uppercase tracking-wider">
            {name}
          </h3>
          <span className="text-[11px] text-stone bg-graphite px-1.5 py-0.5 rounded-[2px] font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="p-1 text-stone hover:text-champagne hover:bg-teal-light rounded-md transition-colors cursor-pointer"
          title="Adicionar tarefa"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tasks list */}
      <Droppable droppableId={columnId} type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 overflow-y-auto p-2 min-h-[80px] transition-colors duration-200",
              snapshot.isDraggingOver && "bg-brass/[0.04]"
            )}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Quick add form */}
      {showForm && (
        <div className="p-2 border-t border-graphite">
          <CreateTaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
