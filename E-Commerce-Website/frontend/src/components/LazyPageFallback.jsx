const LazyPageFallback = () => {
  return (
    <div className="py-10" role="status" aria-live="polite">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="h-8 w-44 animate-pulse rounded bg-primary/10" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] animate-pulse rounded-2xl bg-primary/10" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-primary/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LazyPageFallback;
