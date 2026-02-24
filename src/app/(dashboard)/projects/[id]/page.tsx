import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { getProjectById } from "@/lib/db/queries/projects";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

const statusLabels: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  completed: "Concluído",
  archived: "Arquivado",
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-28 px-8 md:px-16 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone mb-8">
        <Link
          href="/projects"
          className="hover:text-champagne transition-colors no-underline text-stone"
        >
          Projetos
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-champagne">{project.name}</span>
      </nav>

      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-stone hover:text-champagne transition-colors no-underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar aos projetos
      </Link>

      {/* Project header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-marble mb-2">
              {project.name}
            </h1>
            {project.clientName && (
              <p className="text-champagne text-sm tracking-wide uppercase">
                {project.clientName}
              </p>
            )}
          </div>

          <Badge variant={project.status as "active" | "paused" | "completed"}>
            {statusLabels[project.status] ?? project.status}
          </Badge>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-6 mt-6 text-sm text-stone">
          {project.startDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Início: {formatDate(project.startDate)}
            </span>
          )}
          {project.dueDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Prazo: {formatDate(project.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-graphite mb-8">
        <Link
          href={`/projects/${id}`}
          className="px-5 py-3 text-sm font-medium text-marble border-b-2 border-brass no-underline transition-colors"
        >
          Visão Geral
        </Link>
        <Link
          href={`/projects/${id}/pipeline`}
          className="px-5 py-3 text-sm font-medium text-stone hover:text-champagne border-b-2 border-transparent no-underline transition-colors"
        >
          Pipeline
        </Link>
      </div>

      {/* Overview content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Description */}
        <div className="lg:col-span-2">
          <div className="bg-void border border-graphite rounded-xl p-8">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-marble mb-4">
              Descrição
            </h2>
            {project.description ? (
              <p className="text-champagne text-sm leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            ) : (
              <p className="text-stone text-sm italic">
                Nenhuma descrição adicionada.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="bg-void border border-graphite rounded-xl p-6">
            <h3 className="text-xs font-medium uppercase tracking-widest text-stone mb-4">
              Detalhes
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-[11px] text-stone uppercase tracking-wider mb-1">
                  Status
                </dt>
                <dd>
                  <Badge variant={project.status as "active" | "paused" | "completed"}>
                    {statusLabels[project.status] ?? project.status}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-stone uppercase tracking-wider mb-1">
                  Cliente
                </dt>
                <dd className="text-sm text-champagne">
                  {project.clientName ?? "---"}
                </dd>
              </div>
              {project.startDate && (
                <div>
                  <dt className="text-[11px] text-stone uppercase tracking-wider mb-1">
                    Início
                  </dt>
                  <dd className="text-sm text-champagne">
                    {formatDate(project.startDate)}
                  </dd>
                </div>
              )}
              {project.dueDate && (
                <div>
                  <dt className="text-[11px] text-stone uppercase tracking-wider mb-1">
                    Prazo
                  </dt>
                  <dd className="text-sm text-champagne">
                    {formatDate(project.dueDate)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[11px] text-stone uppercase tracking-wider mb-1">
                  Criado em
                </dt>
                <dd className="text-sm text-champagne">
                  {formatDate(project.createdAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick link to pipeline */}
          <Link
            href={`/projects/${id}/pipeline`}
            className="flex items-center justify-between p-4 bg-void border border-graphite rounded-xl hover:border-brass/30 hover:shadow-md transition-all group no-underline"
          >
            <span className="text-sm font-medium text-marble">
              Abrir Pipeline
            </span>
            <ChevronRight className="w-4 h-4 text-stone group-hover:text-brass transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
