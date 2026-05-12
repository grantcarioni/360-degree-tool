export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="ni-card animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-2/5" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-100 rounded" style={{ width: `${85 - i * 10}%` }} />
      ))}
    </div>
  );
}

export function SkeletonCompetency() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-3 bg-gray-100 rounded-md animate-pulse h-10" />
      ))}
    </div>
  );
}
