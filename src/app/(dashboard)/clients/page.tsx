import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { getClients } from "@/lib/db/queries/clients";

export default async function ClientsPage() {
  let clients: Awaited<ReturnType<typeof getClients>> = [];
  let error = false;

  try {
    clients = await getClients();
  } catch {
    error = true;
  }

  return (
    <div className="px-6 py-12 md:px-16 lg:px-24">
      <div className="flex items-start justify-between gap-6">
        <SectionHeader label="Clientes" title="Gerencie seus clientes" />
        <Link
          href="/clients/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brass px-6 py-2.5 text-sm font-medium tracking-wide text-white shadow-sm transition-all hover:-translate-y-px hover:bg-navy"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Link>
      </div>

      {error ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-stone" />
          <p className="text-lg font-medium text-champagne">
            Não foi possível carregar os clientes
          </p>
          <p className="mt-2 text-sm text-stone">
            Verifique a conexão com o banco de dados e tente novamente.
          </p>
        </Card>
      ) : clients.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-stone" />
          <p className="text-lg font-medium text-champagne">
            Nenhum cliente encontrado
          </p>
          <p className="mt-2 text-sm text-stone">
            Adicione seu primeiro cliente para começar a organizar seus projetos.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clients.map((client) => (
            <Card key={client.id} hoverable className="group cursor-pointer">
              <div className="flex items-start gap-4">
                {/* Brand color dot */}
                <div
                  className="mt-1 h-3 w-3 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: client.brandColor || "#4A4A4A",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-marble truncate">
                    {client.name}
                  </h3>

                  {client.contactName && (
                    <p className="mt-2 text-sm text-champagne">
                      {client.contactName}
                    </p>
                  )}
                  {client.contactEmail && (
                    <p className="mt-1 text-xs text-stone truncate">
                      {client.contactEmail}
                    </p>
                  )}
                  {client.toneOfVoice && (
                    <p className="mt-3 text-xs text-stone line-clamp-2">
                      Tom: {client.toneOfVoice}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
