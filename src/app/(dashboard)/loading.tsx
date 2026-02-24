export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brass/30 border-t-brass rounded-full animate-spin" />
        <p className="text-xs text-stone tracking-[0.2em] uppercase">
          Carregando
        </p>
      </div>
    </div>
  );
}
