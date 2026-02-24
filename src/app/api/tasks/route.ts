import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { createTask } from "@/lib/db/queries/tasks";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.projectId || !body.columnId || !body.title) {
      return NextResponse.json(
        { error: "Missing required fields: projectId, columnId, title" },
        { status: 400 }
      );
    }

    const task = await createTask({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
