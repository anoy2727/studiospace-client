export function StudioCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden>
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading studios">
      {Array.from({ length: count }).map((_, i) => <StudioCardSkeleton key={i} />)}
    </div>
  );
}

export function PageSpinner({ label = "Loading" }) {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-ring loading-lg text-primary" />
        <p className="text-sm text-base-content/60">{label}…</p>
      </div>
    </div>
  );
}
