import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, clients, pipelineColumns } from "@/lib/db/schema";
import type { NewProject } from "@/types";

const DEFAULT_COLUMNS = [
  { name: "Briefing", position: 0 },
  { name: "Em Produção", position: 1 },
  { name: "Revisão Interna", position: 2 },
  { name: "Aprovação Cliente", position: 3 },
  { name: "Concluído", position: 4 },
];

export async function getProjects() {
  return db
    .select({
      id: projects.id,
      clientId: projects.clientId,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      startDate: projects.startDate,
      dueDate: projects.dueDate,
      coverImageUrl: projects.coverImageUrl,
      createdBy: projects.createdBy,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      clientName: clients.name,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .orderBy(desc(projects.updatedAt));
}

export async function getProjectById(id: string) {
  const result = await db
    .select({
      id: projects.id,
      clientId: projects.clientId,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      startDate: projects.startDate,
      dueDate: projects.dueDate,
      coverImageUrl: projects.coverImageUrl,
      createdBy: projects.createdBy,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      clientName: clients.name,
      clientBrandColor: clients.brandColor,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.id, id));

  return result[0] ?? null;
}

export async function createProject(
  data: Omit<NewProject, "id" | "createdAt" | "updatedAt">
) {
  const result = await db.insert(projects).values(data).returning();
  const project = result[0];

  if (project) {
    await db.insert(pipelineColumns).values(
      DEFAULT_COLUMNS.map((col) => ({
        projectId: project.id,
        name: col.name,
        position: col.position,
      }))
    );
  }

  return project;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<NewProject, "id" | "createdAt">>
) {
  const result = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
}
