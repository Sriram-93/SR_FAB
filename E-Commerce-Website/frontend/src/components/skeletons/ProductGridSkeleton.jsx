const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div
      className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="h-full space-y-3">
          <div className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-primary/10" />
          <div className="space-y-2 px-1">
            <div className="h-2.5 w-1/3 animate-pulse rounded bg-primary/10" />
            <div className="h-3.5 w-4/5 animate-pulse rounded bg-primary/10" />
            <div className="h-3.5 w-1/2 animate-pulse rounded bg-primary/10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
