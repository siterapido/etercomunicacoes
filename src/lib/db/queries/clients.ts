import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import type { NewClient } from "@/types";

export async function getClients() {
  return db.select().from(clients).orderBy(asc(clients.name));
}

export async function getClientById(id: string) {
  const result = await db.select().from(clients).where(eq(clients.id, id));
  return result[0] ?? null;
}

export async function createClient(
  data: Omit<NewClient, "id" | "createdAt">
) {
  const result = await db.insert(clients).values(data).returning();
  return result[0];
}

export async function updateClient(
  id: string,
  data: Partial<Omit<NewClient, "id" | "createdAt">>
) {
  const result = await db
    .update(clients)
    .set(data)
    .where(eq(clients.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteClient(id: string) {
  await db.delete(clients).where(eq(clients.id, id));
}
