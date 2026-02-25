import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { subtasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subtaskId } = await params;
    const body = await request.json();
    const { completed, title } = body;

    const [updated] = await db
      .update(subtasks)
      .set({
        ...(completed !== undefined ? { completed } : {}),
        ...(title !== undefined ? { title } : {}),
        updatedAt: new Date(),
      })
      .where(eq(subtasks.id, subtaskId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update subtask:", error);
    return NextResponse.json({ error: "Falha ao atualizar subtarefa" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subtaskId } = await params;
    await db.delete(subtasks).where(eq(subtasks.id, subtaskId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete subtask:", error);
    return NextResponse.json({ error: "Falha ao deletar subtarefa" }, { status: 500 });
  }
}
