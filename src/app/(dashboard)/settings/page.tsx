import { Settings, User } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const session = await getServerSession();

  return (
    <div className="px-6 py-12 md:px-16 lg:px-24">
      <SectionHeader label="Configurações" title="Gerencie sua conta" />

      <div className="max-w-2xl space-y-6">
        {/* User profile card */}
        <Card>
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brass">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-marble">
                {session?.user?.name ?? "Usuário"}
              </h3>
              <p className="mt-1 text-sm text-stone">
                {session?.user?.email ?? "email@exemplo.com"}
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-brass/12 px-2.5 py-1 text-xs font-medium text-champagne">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                  {session?.user?.role ?? "designer"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Placeholder notice */}
        <Card className="border-brass/10">
          <div className="flex items-center gap-4">
            <Settings className="h-5 w-5 text-brass" />
            <div>
              <p className="text-sm font-medium text-champagne">
                Funcionalidade completa em breve
              </p>
              <p className="mt-1 text-xs text-stone">
                Em breve você poderá editar seu perfil, alterar senha, configurar
                notificações e personalizar a plataforma.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
