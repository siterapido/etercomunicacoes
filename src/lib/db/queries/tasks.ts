import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks, pipelineColumns, taskAssignees } from "@/lib/db/schema";
import type { NewTask } from "@/types";

export async function getTasksByProject(projectId: string) {
  const columns = await db
    .select()
    .from(pipelineColumns)
    .where(eq(pipelineColumns.projectId, projectId))
    .orderBy(asc(pipelineColumns.position));

  const columnsWithTasks = await Promise.all(
    columns.map(async (column) => {
      const columnTasks = await db.query.tasks.findMany({
        where: eq(tasks.columnId, column.id),
        orderBy: asc(tasks.position),
        with: {
          assignees: {
            with: {
              user: true,
            },
          },
        },
      });

      return {
        ...column,
        tasks: columnTasks,
      };
    })
  );

  return columnsWithTasks;
}

export async function createTask(
  data: Omit<NewTask, "id" | "createdAt" | "updatedAt"> & {
    assigneeIds?: string[];
  }
) {
  const { assigneeIds, ...taskData } = data;

  const result = await db.insert(tasks).values(taskData).returning();
  const task = result[0];

  if (task && assigneeIds && assigneeIds.length > 0) {
    await db.insert(taskAssignees).values(
      assigneeIds.map((userId) => ({
        taskId: task.id,
        userId,
      }))
    );
  }

  return task;
}

export async function updateTask(
  id: string,
  data: Partial<Omit<NewTask, "id" | "createdAt">>
) {
  const result = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();
  return result[0] ?? null;
}

export async function moveTask(
  taskId: string,
  newColumnId: string,
  newPosition: number
) {
  const result = await db
    .update(tasks)
    .set({
      columnId: newColumnId,
      position: newPosition,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();
  return result[0] ?? null;
}

export async function deleteTask(id: string) {
  await db.delete(tasks).where(eq(tasks.id, id));
}
