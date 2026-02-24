import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  tasks,
  projects,
  clients,
  pipelineColumns,
  taskActivities,
} from "@/lib/db/schema";

export async function getDashboardMetrics(userId: string) {
  // Tasks in production: tasks in columns named "Em Produção"
  const tasksInProductionResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .innerJoin(pipelineColumns, eq(tasks.columnId, pipelineColumns.id))
    .where(eq(pipelineColumns.name, "Em Produção"));

  // Pending approvals: tasks in columns named "Aprovação Cliente"
  const pendingApprovalsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .innerJoin(pipelineColumns, eq(tasks.columnId, pipelineColumns.id))
    .where(eq(pipelineColumns.name, "Aprovação Cliente"));

  // Deadlines this week
  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);

  const todayStr = now.toISOString().split("T")[0];
  const endOfWeekStr = endOfWeek.toISOString().split("T")[0];

  const deadlinesResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .where(
      and(
        gte(tasks.dueDate, todayStr),
        lte(tasks.dueDate, endOfWeekStr)
      )
    );

  return {
    tasksInProduction: Number(tasksInProductionResult[0]?.count ?? 0),
    pendingApprovals: Number(pendingApprovalsResult[0]?.count ?? 0),
    deadlinesThisWeek: Number(deadlinesResult[0]?.count ?? 0),
    aiGenerations: 0,
  };
}

export async function getActiveProjects(limit = 5) {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      status: projects.status,
      coverImageUrl: projects.coverImageUrl,
      updatedAt: projects.updatedAt,
      clientName: clients.name,
      clientBrandColor: clients.brandColor,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.status, "active"))
    .orderBy(desc(projects.updatedAt))
    .limit(limit);
}

export async function getRecentActivity(limit = 10) {
  return db.query.taskActivities.findMany({
    orderBy: desc(taskActivities.createdAt),
    limit,
    with: {
      user: true,
      task: true,
    },
  });
}
