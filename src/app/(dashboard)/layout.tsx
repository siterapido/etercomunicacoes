import { getServerSession } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-sand">
      <Navbar
        user={{
          name: session?.user.name ?? "Visitante",
          email: session?.user.email ?? "",
          role: session?.user.role || "designer",
          avatarUrl: session?.user.avatarUrl,
        }}
      />
      <main>{children}</main>
    </div>
  );
}
