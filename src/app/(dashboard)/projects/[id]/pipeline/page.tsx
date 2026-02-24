import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProjectById } from "@/lib/db/queries/projects";
import { getTasksByProject } from "@/lib/db/queries/tasks";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import type { ColumnData } from "@/hooks/use-tasks";

interface PipelinePageProps {
  params: Promise<{ id: string }>;
}

export default async function PipelinePage({ params }: PipelinePageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const columnsData = await getTasksByProject(id);

  // Transform to the shape expected by the KanbanBoard
  const initialColumns: ColumnData[] = columnsData.map((col) => ({
    id: col.id,
    name: col.name,
    position: col.position,
    color: col.color,
    tasks: col.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      position: task.position,
      columnId: task.columnId,
      createdBy: task.createdBy,
    })),
  }));

  return (
    <div className="min-h-screen pt-28 px-8 md:px-16 pb-8 flex flex-col">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone mb-6">
        <Link
          href="/projects"
          className="hover:text-champagne transition-colors no-underline text-stone"
        >
          Projetos
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/projects/${id}`}
          className="hover:text-champagne transition-colors no-underline text-stone"
        >
          {project.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-champagne">Pipeline</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-marble">
            Pipeline
          </h1>
          <p className="text-stone text-sm mt-1">
            {project.name}
            {project.clientName ? ` — ${project.clientName}` : ""}
          </p>
        </div>

        {/* Tab navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href={`/projects/${id}`}
            className="px-4 py-2 text-sm font-medium text-stone hover:text-champagne rounded-[2px] no-underline transition-colors"
          >
            Visão Geral
          </Link>
          <Link
            href={`/projects/${id}/pipeline`}
            className="px-4 py-2 text-sm font-medium text-marble bg-teal-light rounded-lg no-underline"
          >
            Pipeline
          </Link>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1">
        <KanbanBoard projectId={id} initialColumns={initialColumns} />
      </div>
    </div>
  );
}
