import { MetricsSection } from "@/components/homepage/metrics-section";
import { ProjectsGallery } from "@/components/homepage/projects-gallery";
import { ActivitySection } from "@/components/homepage/activity-section";

// Mock data for now
const mockMetrics = {
  tasksInProduction: 12,
  pendingApprovals: 5,
  deadlinesThisWeek: 3,
  aiGenerations: 28,
};

const mockProjects = [
  {
    id: "1",
    clientName: "Construtora Apex",
    name: "Campanha Institucional 2026",
    progress: 72,
    remainingTasks: 8,
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    id: "2",
    clientName: "Lumiere Imoveis",
    name: "Social Media — Q1",
    progress: 45,
    remainingTasks: 14,
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: "3",
    clientName: "TechVault",
    name: "Lancamento de Produto",
    progress: 90,
    remainingTasks: 2,
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: "4",
    clientName: "Maison Belle",
    name: "Rebranding Completo",
    progress: 25,
    remainingTasks: 22,
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
];

const mockActivities = [
  {
    id: "1",
    userName: "Carolina Mendes",
    action: 'aprovou o material "Post Instagram — Fev/03" do projeto',
    targetName: "Lumiere Imoveis",
    time: "Ha 12 minutos",
  },
  {
    id: "2",
    userName: "Rafael Costa",
    action: 'moveu "Video Institucional" para',
    targetName: "Revisao Interna",
    time: "Ha 34 minutos",
  },
  {
    id: "3",
    userName: "Juliana Torres",
    action: "gerou 3 variacoes de legenda para",
    targetName: "Construtora Apex",
    time: "Ha 1 hora",
  },
  {
    id: "4",
    userName: "Marcos Alexandre",
    action: 'criou nova tarefa "Roteiro Reels — Marco" no projeto',
    targetName: "TechVault",
    time: "Ha 2 horas",
  },
  {
    id: "5",
    userName: "Maison Belle",
    action: 'solicitou alteracoes em "Identidade Visual v2"',
    targetName: "",
    time: "Ha 3 horas",
  },
];

export default function HomePage() {
  return (
    <div className="pt-20 pb-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <MetricsSection metrics={mockMetrics} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <ProjectsGallery projects={mockProjects} />
          </div>
          <div className="xl:col-span-1">
            <ActivitySection activities={mockActivities} />
          </div>
        </div>
      </div>
    </div>
  );
}
