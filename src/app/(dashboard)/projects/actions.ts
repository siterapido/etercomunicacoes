"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/db/queries/projects";

export async function createProjectAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const name = formData.get("name") as string;
  const clientId = formData.get("clientId") as string;
  const description = (formData.get("description") as string) || null;
  const status =
    (formData.get("status") as "active" | "paused" | "completed" | "archived") ||
    "active";
  const startDate = (formData.get("startDate") as string) || null;
  const dueDate = (formData.get("dueDate") as string) || null;

  if (!name || !clientId) {
    throw new Error("Nome e cliente são obrigatórios");
  }

  const project = await createProject({
    name,
    clientId,
    description,
    status,
    startDate,
    dueDate,
    createdBy: session.user.id,
  });

  revalidatePath("/projects");

  if (project) {
    redirect(`/projects/${project.id}`);
  }
}

export async function updateProjectAction(id: string, formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const name = formData.get("name") as string;
  const clientId = formData.get("clientId") as string;
  const description = (formData.get("description") as string) || null;
  const status =
    (formData.get("status") as "active" | "paused" | "completed" | "archived") ||
    undefined;
  const startDate = (formData.get("startDate") as string) || null;
  const dueDate = (formData.get("dueDate") as string) || null;

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (clientId) updates.clientId = clientId;
  if (description !== null) updates.description = description;
  if (status) updates.status = status;
  if (startDate !== null) updates.startDate = startDate;
  if (dueDate !== null) updates.dueDate = dueDate;

  await updateProject(id, updates);

  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
}

export async function deleteProjectAction(id: string) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  await deleteProject(id);

  revalidatePath("/projects");
  redirect("/projects");
}
