import { MetricsSection } from "@/components/homepage/metrics-section";
import { ProjectsGallery } from "@/components/homepage/projects-gallery";
import { ActivitySection } from "@/components/homepage/activity-section";
import { getServerSession } from "@/lib/auth/session";
import {
  getDashboardMetrics,
  getActiveProjects,
  getRecentActivity,
} from "@/lib/db/queries/dashboard";

export default async function HomePage() {
  const session = await getServerSession();

  // Fetch real data in parallel
  const [metrics, projects, activities] = await Promise.all([
    getDashboardMetrics(session?.user?.id ?? ""),
    getActiveProjects(6),
    getRecentActivity(8),
  ]);

  // Format projects for the gallery component
  const formattedProjects = projects.map((p) => ({
    id: p.id,
    clientName: p.clientName ?? "Cliente",
    name: p.name,
    progress: 0, // Will be calculated with task data in next iteration
    remainingTasks: 0,
    coverImage:
      p.coverImageUrl ??
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  }));

  // Format activities for the component
  const formattedActivities = activities.map((a) => ({
    id: a.id,
    userName: (a as { user?: { name?: string } }).user?.name ?? "Sistema",
    action: a.action,
    targetName: (a as { task?: { title?: string } }).task?.title ?? "",
    time: formatRelativeTime(new Date(a.createdAt)),
  }));

  return (
    <div className="pt-20 pb-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <MetricsSection metrics={metrics} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <ProjectsGallery projects={formattedProjects} />
          </div>
          <div className="xl:col-span-1">
            <ActivitySection activities={formattedActivities} />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Agora mesmo";
  if (minutes < 60) return `Há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  if (hours < 24) return `Há ${hours} hora${hours > 1 ? "s" : ""}`;
  return `Há ${days} dia${days > 1 ? "s" : ""}`;
}
