export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#1a1a1a] rounded-lg ${className}`}
    />
  );
}

export function ProjectSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
      <div className="space-y-3 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0d0d0d] border border-[#222] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded mt-0.5" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-72" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
