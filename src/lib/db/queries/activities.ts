import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { taskActivities } from "@/lib/db/schema";

interface LogActivityData {
  taskId: string;
  userId: string;
  action: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(data: LogActivityData) {
  const result = await db
    .insert(taskActivities)
    .values({
      taskId: data.taskId,
      userId: data.userId,
      action: data.action,
      metadata: data.metadata ?? null,
    })
    .returning();
  return result[0];
}

export async function getRecentActivities(limit = 20) {
  return db.query.taskActivities.findMany({
    orderBy: desc(taskActivities.createdAt),
    limit,
    with: {
      user: true,
      task: true,
    },
  });
}
