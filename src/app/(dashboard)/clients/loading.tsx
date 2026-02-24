export default function ClientsLoading() {
  return (
    <div className="min-h-screen bg-sand pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-3 w-20 bg-charcoal rounded animate-pulse mb-4" />
          <div className="h-8 w-48 bg-charcoal rounded animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-void border border-graphite rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-graphite animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-graphite rounded animate-pulse" />
                  <div className="h-3 w-24 bg-graphite rounded animate-pulse" />
                </div>
              </div>
              <div className="h-3 w-full bg-graphite rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-graphite rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
