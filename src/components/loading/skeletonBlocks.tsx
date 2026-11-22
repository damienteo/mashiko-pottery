const pulse = 'bg-gray-200 animate-pulse rounded'

export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`${pulse} ${className}`} aria-hidden />
}

export function SkeletonTitleBar({
  className = 'h-9 w-56',
}: {
  className?: string
}) {
  return <SkeletonLine className={`mx-auto mb-8 ${className}`} />
}

export function SkeletonAspectSquare({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={`relative w-full aspect-square overflow-hidden ${className}`}
      aria-hidden
    >
      <div className={`absolute inset-0 ${pulse}`} />
    </div>
  )
}

export function SkeletonCatalogCard() {
  return (
    <div className="flex flex-col h-full" aria-hidden>
      <SkeletonAspectSquare className="rounded-lg mb-4" />
      <SkeletonLine className="h-5 w-3/4 mx-auto mb-2" />
      <SkeletonLine className="h-4 w-1/2 mx-auto mb-2" />
      <SkeletonLine className="h-4 w-2/3 mx-auto" />
    </div>
  )
}

export function SkeletonPotterCard() {
  return (
    <div aria-hidden>
      <SkeletonAspectSquare className="rounded-lg mb-4" />
      <SkeletonLine className="h-6 w-2/3 mx-auto mb-2" />
      <SkeletonLine className="h-4 w-full mb-1" />
      <SkeletonLine className="h-4 w-5/6 mx-auto" />
    </div>
  )
}

export function SkeletonProductsToolbar() {
  return (
    <div className="space-y-4" aria-hidden>
      <SkeletonLine className="h-10 w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <SkeletonLine className="h-10" />
        <SkeletonLine className="h-10" />
        <SkeletonLine className="h-10" />
        <SkeletonLine className="h-10" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SkeletonLine className="h-9 w-32" />
        <SkeletonLine className="h-9 w-48" />
      </div>
    </div>
  )
}
