export function ProductCardSkeleton() {
  return (
    <div className="group">
      <div className="shimmer aspect-[3/4] w-full" />
      <div className="mt-4 space-y-2">
        <div className="shimmer h-3 w-1/3" />
        <div className="shimmer h-4 w-2/3" />
        <div className="shimmer h-4 w-1/4" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="h-[70vh] w-full shimmer" />
  );
}

export function LineSkeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}
