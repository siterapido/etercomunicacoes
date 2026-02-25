import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { approvals, tasks, pipelineColumns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendApprovalResultEmail } from "@/lib/email";

// Public route - get approval details by token
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const approval = await db.query.approvals.findFirst({
      where: eq(approvals.publicToken, token),
      with: {
        task: true,
        project: {
          with: { client: true },
        },
        requestedByUser: {
          columns: { id: true, name: true, email: true },
        },
      },
    });

    if (!approval) {
      return NextResponse.json({ error: "Aprovação não encontrada" }, { status: 404 });
    }

    if (approval.expiresAt && new Date() > new Date(approval.expiresAt)) {
      return NextResponse.json({ error: "Link de aprovação expirado" }, { status: 410 });
    }

    return NextResponse.json(approval);
  } catch (error) {
    console.error("Failed to fetch approval:", error);
    return NextResponse.json({ error: "Falha ao buscar aprovação" }, { status: 500 });
  }
}

// Public route - respond to approval
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { status, clientFeedback } = body;

    const validStatuses = ["approved", "changes_requested", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const approval = await db.query.approvals.findFirst({
      where: eq(approvals.publicToken, token),
      with: {
        task: true,
        project: true,
        requestedByUser: { columns: { id: true, name: true, email: true } },
      },
    });

    if (!approval) {
      return NextResponse.json({ error: "Aprovação não encontrada" }, { status: 404 });
    }

    if (approval.expiresAt && new Date() > new Date(approval.expiresAt)) {
      return NextResponse.json({ error: "Link de aprovação expirado" }, { status: 410 });
    }

    if (approval.status !== "pending") {
      return NextResponse.json({ error: "Esta aprovação já foi respondida" }, { status: 409 });
    }

    // Update approval status
    const [updated] = await db
      .update(approvals)
      .set({
        status,
        clientFeedback,
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(approvals.publicToken, token))
      .returning();

    // If approved, move task to "Concluído" column
    if (status === "approved") {
      const concludedColumn = await db.query.pipelineColumns.findFirst({
        where: eq(pipelineColumns.projectId, approval.projectId),
      });

      // Find the "Concluído" or last column
      const allColumns = await db.query.pipelineColumns.findMany({
        where: eq(pipelineColumns.projectId, approval.projectId),
        orderBy: (col, { desc }) => [desc(col.position)],
      });

      const lastColumn = allColumns[0];
      if (lastColumn) {
        await db.update(tasks)
          .set({ columnId: lastColumn.id, updatedAt: new Date() })
          .where(eq(tasks.id, approval.taskId));
      }
    }

    // Send notification email to requester
    if (approval.requestedByUser?.email) {
      await sendApprovalResultEmail({
        to: approval.requestedByUser.email,
        requesterName: approval.requestedByUser.name,
        taskTitle: approval.task?.title ?? "",
        projectName: (approval.project as { name: string })?.name ?? "",
        status,
        clientFeedback,
        clientName: approval.clientName ?? "Cliente",
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to respond to approval:", error);
    return NextResponse.json({ error: "Falha ao responder aprovação" }, { status: 500 });
  }
}
