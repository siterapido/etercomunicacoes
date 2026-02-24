import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/lib/db/queries/projects";

const statusLabels: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  completed: "Concluído",
  archived: "Arquivado",
};

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let error = false;

  try {
    projects = await getProjects();
  } catch {
    error = true;
  }

  return (
    <div className="px-6 py-12 md:px-16 lg:px-24">
      <div className="flex items-start justify-between gap-6">
        <SectionHeader label="Projetos" title="Seus projetos em andamento" />
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brass px-6 py-2.5 text-sm font-medium tracking-wide text-white shadow-sm transition-all hover:-translate-y-px hover:bg-navy"
        >
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Link>
      </div>

      {error ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="mb-4 h-12 w-12 text-stone" />
          <p className="text-lg font-medium text-champagne">
            Não foi possível carregar os projetos
          </p>
          <p className="mt-2 text-sm text-stone">
            Verifique a conexão com o banco de dados e tente novamente.
          </p>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="mb-4 h-12 w-12 text-stone" />
          <p className="text-lg font-medium text-champagne">
            Nenhum projeto encontrado
          </p>
          <p className="mt-2 text-sm text-stone">
            Crie seu primeiro projeto para começar a gerenciar suas entregas.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}/pipeline`}>
              <Card hoverable className="group cursor-pointer p-0">
                {/* Cover image */}
                <div className="relative h-36 w-full overflow-hidden bg-graphite">
                  {project.coverImageUrl ? (
                    <img
                      src={project.coverImageUrl}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal to-graphite">
                      <FolderOpen className="h-10 w-10 text-stone" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {project.clientName && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">
                      {project.clientName}
                    </p>
                  )}
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-marble">
                    {project.name}
                  </h3>

                  {/* Progress bar placeholder */}
                  <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-graphite">
                    <div
                      className="h-full rounded-full bg-brass transition-all"
                      style={{
                        width:
                          project.status === "completed"
                            ? "100%"
                            : project.status === "active"
                              ? "45%"
                              : "0%",
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Badge
                      variant={
                        project.status as
                          | "active"
                          | "paused"
                          | "completed"
                      }
                    >
                      {statusLabels[project.status] ?? project.status}
                    </Badge>
                    {project.dueDate && (
                      <span className="text-xs text-stone">
                        {project.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
