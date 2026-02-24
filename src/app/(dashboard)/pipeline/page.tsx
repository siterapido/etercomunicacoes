"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Columns3, FolderOpen, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectSummary {
  id: string;
  name: string;
  clientName: string | null;
  status: string;
}

const statusLabels: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  completed: "Concluído",
  archived: "Arquivado",
};

export default function PipelinePage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects?status=active");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch {
        // Silently fail - show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="px-6 py-12 md:px-16 lg:px-24">
      <SectionHeader label="Pipeline" title="Gerencie suas tarefas" />

      <Card className="mb-8 flex items-center gap-3 border-brass/20 bg-charcoal p-6">
        <Columns3 className="h-5 w-5 text-brass" />
        <p className="text-sm text-champagne">
          Selecione um projeto para visualizar o pipeline
        </p>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-[4px] bg-charcoal"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="mb-4 h-12 w-12 text-stone" />
          <p className="text-lg font-medium text-champagne">
            Nenhum projeto ativo
          </p>
          <p className="mt-2 text-sm text-stone">
            Crie um projeto para começar a usar o pipeline.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}/pipeline`}
            >
              <Card hoverable className="group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    {project.clientName && (
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">
                        {project.clientName}
                      </p>
                    )}
                    <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-marble">
                      {project.name}
                    </h3>
                    <div className="mt-2">
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
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-stone transition-transform group-hover:translate-x-1 group-hover:text-brass" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
