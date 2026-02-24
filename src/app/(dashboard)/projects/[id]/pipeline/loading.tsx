export default function PipelineLoading() {
  return (
    <div className="min-h-screen bg-sand pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="h-3 w-48 bg-graphite rounded animate-pulse mb-8" />

        {/* Title skeleton */}
        <div className="h-7 w-56 bg-graphite rounded animate-pulse mb-10" />

        {/* Kanban columns skeleton */}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[300px] bg-charcoal border border-graphite rounded-xl flex-shrink-0"
            >
              <div className="p-3 border-b border-graphite">
                <div className="h-4 w-24 bg-graphite rounded animate-pulse" />
              </div>
              <div className="p-2 space-y-2">
                {Array.from({ length: 2 + (i % 3) }).map((_, j) => (
                  <div
                    key={j}
                    className="bg-void border border-graphite rounded-lg p-4 space-y-3"
                  >
                    <div className="h-4 w-3/4 bg-graphite rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-graphite rounded animate-pulse" />
                      <div className="h-5 w-20 bg-graphite rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
