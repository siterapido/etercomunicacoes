"use client";

import { useState, useEffect, useCallback } from "react";

export interface TaskData {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  dueDate?: string | null;
  position: number;
  columnId: string;
  createdBy?: string | null;
}

export interface ColumnData {
  id: string;
  name: string;
  position: number;
  color?: string | null;
  tasks: TaskData[];
}

interface CreateTaskInput {
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}

export function useTasks(projectId: string) {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/projects/${projectId}/tasks`);
      if (res.ok) {
        const data = await res.json();
        setColumns(data);
      } else {
        setError("Falha ao carregar tarefas");
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Falha ao carregar tarefas");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          throw new Error("Failed to create task");
        }

        const newTask = await res.json();

        // Optimistically add to the correct column
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id === input.columnId) {
              return {
                ...col,
                tasks: [
                  ...col.tasks,
                  {
                    id: newTask.id,
                    title: newTask.title,
                    description: newTask.description,
                    priority: newTask.priority,
                    dueDate: newTask.dueDate,
                    position: newTask.position,
                    columnId: newTask.columnId,
                    createdBy: newTask.createdBy,
                  },
                ],
              };
            }
            return col;
          })
        );

        return newTask;
      } catch (err) {
        console.error("Failed to create task:", err);
        // Refetch to ensure consistency
        await fetchTasks();
        throw err;
      }
    },
    [fetchTasks]
  );

  const moveTask = useCallback(
    async (taskId: string, sourceColumnId: string, destinationColumnId: string, newPosition: number) => {
      // Save previous state for rollback
      const previousColumns = columns;

      // Optimistic update
      setColumns((prev) => {
        const newColumns = prev.map((col) => ({
          ...col,
          tasks: [...col.tasks],
        }));

        // Find source column and remove task
        const sourceCol = newColumns.find((col) => col.id === sourceColumnId);
        const destCol = newColumns.find((col) => col.id === destinationColumnId);

        if (!sourceCol || !destCol) return prev;

        const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return prev;

        const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);
        movedTask.columnId = destinationColumnId;
        movedTask.position = newPosition;

        // Insert at new position
        destCol.tasks.splice(newPosition, 0, movedTask);

        // Re-index positions in affected columns
        sourceCol.tasks.forEach((task, idx) => {
          task.position = idx;
        });
        if (sourceColumnId !== destinationColumnId) {
          destCol.tasks.forEach((task, idx) => {
            task.position = idx;
          });
        }

        return newColumns;
      });

      // Call API
      try {
        const res = await fetch(`/api/tasks/${taskId}/move`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            columnId: destinationColumnId,
            position: newPosition,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to move task");
        }
      } catch (err) {
        console.error("Failed to move task:", err);
        // Rollback on failure
        setColumns(previousColumns);
      }
    },
    [columns]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: { title?: string; description?: string; priority?: string; dueDate?: string }) => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          throw new Error("Failed to update task");
        }

        const updatedTask = await res.json();

        // Optimistic update
        setColumns((prev) =>
          prev.map((col) => ({
            ...col,
            tasks: col.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    ...updates,
                  }
                : task
            ),
          }))
        );

        return updatedTask;
      } catch (err) {
        console.error("Failed to update task:", err);
        await fetchTasks();
        throw err;
      }
    },
    [fetchTasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      // Save previous state for rollback
      const previousColumns = columns;

      // Optimistic removal
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        }))
      );

      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
      } catch (err) {
        console.error("Failed to delete task:", err);
        // Rollback on failure
        setColumns(previousColumns);
      }
    },
    [columns]
  );

  return {
    columns,
    setColumns,
    isLoading,
    error,
    createTask,
    moveTask,
    updateTask,
    deleteTask,
    refresh: fetchTasks,
  };
}
