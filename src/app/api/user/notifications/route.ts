import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { emailOnApproval, emailOnComment, emailOnAssign, emailOnDeadline } = body;

    const [updated] = await db
      .update(users)
      .set({
        notificationPreferences: {
          emailOnApproval: Boolean(emailOnApproval),
          emailOnComment: Boolean(emailOnComment),
          emailOnAssign: Boolean(emailOnAssign),
          emailOnDeadline: Boolean(emailOnDeadline),
        },
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email))
      .returning({ notificationPreferences: users.notificationPreferences });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update notifications:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar notificações" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ notificationPreferences: users.notificationPreferences })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    return NextResponse.json(
      user?.notificationPreferences ?? {
        emailOnApproval: true,
        emailOnComment: true,
        emailOnAssign: true,
        emailOnDeadline: true,
      }
    );
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return NextResponse.json(
      { error: "Falha ao buscar notificações" },
      { status: 500 }
    );
  }
}
