import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { approvals, tasks, projects, clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { sendApprovalEmail } from "@/lib/email";

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, clientEmail, clientName, notes } = body;

    if (!taskId) {
      return NextResponse.json({ error: "taskId é obrigatório" }, { status: 400 });
    }

    // Get task + project info
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
      with: { project: { with: { client: true } } },
    });

    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }

    const publicToken = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const [approval] = await db.insert(approvals).values({
      taskId,
      projectId: task.projectId,
      requestedBy: session.user.id,
      clientEmail: clientEmail || (task.project as { client?: { contactEmail?: string } })?.client?.contactEmail || null,
      clientName: clientName || (task.project as { client?: { name?: string } })?.client?.name || null,
      notes,
      publicToken,
      expiresAt,
    }).returning();

    // Send email if client email is provided
    const recipientEmail = clientEmail || (task.project as { client?: { contactEmail?: string } })?.client?.contactEmail;
    if (recipientEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      await sendApprovalEmail({
        to: recipientEmail,
        clientName: clientName || (task.project as { client?: { name?: string } })?.client?.name || "Cliente",
        taskTitle: task.title,
        projectName: (task.project as { name: string })?.name ?? "",
        approvalUrl: `${appUrl}/approve/${publicToken}`,
        requesterName: session.user.name,
        notes,
      });
    }

    return NextResponse.json(approval, { status: 201 });
  } catch (error) {
    console.error("Failed to create approval:", error);
    return NextResponse.json({ error: "Falha ao criar aprovação" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const query = db.query.approvals.findMany({
      orderBy: desc(approvals.createdAt),
      with: {
        task: true,
        project: true,
        requestedByUser: {
          columns: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      ...(projectId ? { where: eq(approvals.projectId, projectId) } : {}),
    });

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch approvals:", error);
    return NextResponse.json({ error: "Falha ao buscar aprovações" }, { status: 500 });
  }
}
