import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getTasksByProject } from "@/lib/db/queries/tasks";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const columns = await getTasksByProject(id);

    return NextResponse.json(columns);
  } catch (error) {
    console.error("Failed to fetch project tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch project tasks" },
      { status: 500 }
    );
  }
}
