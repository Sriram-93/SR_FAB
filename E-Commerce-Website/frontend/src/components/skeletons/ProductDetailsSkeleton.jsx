const ProductDetailsSkeleton = () => {
  return (
    <div className="animate-fade-in py-10" aria-hidden="true">
      <div className="mb-8 h-3 w-36 animate-pulse rounded bg-primary/10" />
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-primary/10" />
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-primary/10" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-primary/10" />
          <div className="h-16 w-full animate-pulse rounded bg-primary/10" />
          <div className="h-8 w-40 animate-pulse rounded bg-primary/10" />
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="h-12 animate-pulse rounded bg-primary/10" />
            <div className="h-12 animate-pulse rounded bg-primary/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
