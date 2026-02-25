"use client";

import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Loader2, RefreshCw } from "lucide-react";
import { useTasks, type ColumnData } from "@/hooks/use-tasks";
import { KanbanColumn } from "./kanban-column";
import { TaskDetailModal } from "./task-detail-modal";
import { useEffect, useState } from "react";

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

interface KanbanBoardProps {
  projectId: string;
  initialColumns: ColumnData[];
}

export function KanbanBoard({ projectId, initialColumns }: KanbanBoardProps) {
  const {
    columns,
    setColumns,
    isLoading,
    error,
    createTask,
    moveTask,
    refresh,
  } = useTasks(projectId);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  // Use initial columns from server on first render
  useEffect(() => {
    if (initialColumns.length > 0) {
      setColumns(initialColumns);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Task drag
    if (type === "TASK") {
      moveTask(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      );
    }
  };

  const handleCreateTask = async (input: {
    projectId: string;
    columnId: string;
    title: string;
    priority?: string;
  }) => {
    await createTask({
      projectId: input.projectId,
      columnId: input.columnId,
      title: input.title,
      priority: input.priority,
    });
  };

  if (isLoading && columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brass animate-spin" />
          <p className="text-stone text-sm">Carregando pipeline...</p>
        </div>
      </div>
    );
  }

  if (error && columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-crimson text-sm">{error}</p>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 text-sm text-champagne bg-charcoal border border-graphite rounded-lg hover:bg-teal-light transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-stone text-sm">
          Nenhuma coluna encontrada para este projeto.
        </p>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  columnId={column.id}
                  name={column.name}
                  color={column.color}
                  tasks={column.tasks}
                  projectId={projectId}
                  onCreateTask={handleCreateTask}
                  onTaskClick={(task) => setSelectedTask(task)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
}
