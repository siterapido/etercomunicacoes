import { auth } from "./server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface AppSession {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    avatarUrl: string | null;
  };
}

export async function getServerSession(): Promise<AppSession | null> {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return null;
  }

  // Look up app-specific user data (role, avatarUrl)
  const [appUser] = await db
    .select({ role: users.role, avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  // If no matching record in public.users, auto-create one
  if (!appUser) {
    const [newUser] = await db
      .insert(users)
      .values({
        email: session.user.email,
        name: session.user.name || session.user.email,
        role: "designer",
      })
      .returning({ role: users.role, avatarUrl: users.avatarUrl });

    return {
      user: {
        id: session.user.id,
        name: session.user.name || session.user.email,
        email: session.user.email,
        image: session.user.image ?? null,
        role: newUser?.role || "designer",
        avatarUrl: newUser?.avatarUrl || null,
      },
    };
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name || session.user.email,
      email: session.user.email,
      image: session.user.image ?? null,
      role: appUser.role,
      avatarUrl: appUser.avatarUrl,
    },
  };
}
