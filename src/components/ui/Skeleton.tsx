export function CardSkeleton() {
  return (
    <div className="card animate-pulse space-y-3 p-4">
      <div className="h-4 w-2/3 rounded bg-matcha-100 dark:bg-white/10" />
      <div className="h-3 w-full rounded bg-matcha-50 dark:bg-white/5" />
      <div className="h-3 w-1/2 rounded bg-matcha-50 dark:bg-white/5" />
      <div className="flex gap-2 pt-1">
        <div className="h-6 w-16 rounded-full bg-matcha-50 dark:bg-white/5" />
        <div className="h-6 w-20 rounded-full bg-matcha-50 dark:bg-white/5" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="card animate-pulse space-y-3 p-5">
      <div className="h-3 w-20 rounded bg-matcha-50 dark:bg-white/5" />
      <div className="h-7 w-12 rounded bg-matcha-100 dark:bg-white/10" />
    </div>
  );
}
