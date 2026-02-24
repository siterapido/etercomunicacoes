"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import {
  createClient,
  updateClient,
  deleteClient,
} from "@/lib/db/queries/clients";

export async function createClientAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const name = formData.get("name") as string;
  const contactName = (formData.get("contactName") as string) || null;
  const contactEmail = (formData.get("contactEmail") as string) || null;
  const brandColor = (formData.get("brandColor") as string) || null;
  const toneOfVoice = (formData.get("toneOfVoice") as string) || null;

  if (!name) {
    throw new Error("Nome é obrigatório");
  }

  const client = await createClient({
    name,
    contactName,
    contactEmail,
    brandColor,
    toneOfVoice,
  });

  revalidatePath("/clients");

  if (client) {
    redirect("/clients");
  }
}

export async function updateClientAction(id: string, formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const name = formData.get("name") as string;
  const contactName = (formData.get("contactName") as string) || null;
  const contactEmail = (formData.get("contactEmail") as string) || null;
  const brandColor = (formData.get("brandColor") as string) || null;
  const toneOfVoice = (formData.get("toneOfVoice") as string) || null;

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (contactName !== null) updates.contactName = contactName;
  if (contactEmail !== null) updates.contactEmail = contactEmail;
  if (brandColor !== null) updates.brandColor = brandColor;
  if (toneOfVoice !== null) updates.toneOfVoice = toneOfVoice;

  await updateClient(id, updates);

  revalidatePath("/clients");
}

export async function deleteClientAction(id: string) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  await deleteClient(id);

  revalidatePath("/clients");
  redirect("/clients");
}
