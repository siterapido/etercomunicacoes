import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { subtasks } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;

    const items = await db.query.subtasks.findMany({
      where: eq(subtasks.taskId, taskId),
      orderBy: asc(subtasks.createdAt),
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch subtasks:", error);
    return NextResponse.json({ error: "Falha ao buscar subtarefas" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    const body = await request.json();
    const { title } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
    }

    const [subtask] = await db.insert(subtasks).values({
      taskId,
      title: title.trim(),
      createdBy: session.user.id,
    }).returning();

    return NextResponse.json(subtask, { status: 201 });
  } catch (error) {
    console.error("Failed to create subtask:", error);
    return NextResponse.json({ error: "Falha ao criar subtarefa" }, { status: 500 });
  }
}
