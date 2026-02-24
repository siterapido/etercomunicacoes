export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-sand pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-3 w-24 bg-charcoal rounded animate-pulse mb-4" />
          <div className="h-8 w-64 bg-charcoal rounded animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-void border border-graphite rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-graphite animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-20 bg-graphite rounded animate-pulse" />
                <div className="h-5 w-40 bg-graphite rounded animate-pulse" />
                <div className="h-2 w-full bg-graphite rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
