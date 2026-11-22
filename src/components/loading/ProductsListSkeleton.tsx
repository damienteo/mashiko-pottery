import LoadingStatus from '@/components/loading/LoadingStatus'
import {
  SkeletonCatalogCard,
  SkeletonProductsToolbar,
  SkeletonTitleBar,
} from '@/components/loading/skeletonBlocks'

type ProductsListSkeletonProps = {
  loadingText: string
}

export default function ProductsListSkeleton({
  loadingText,
}: ProductsListSkeletonProps) {
  return (
    <LoadingStatus loadingText={loadingText} skeleton="products-list">
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonTitleBar className="h-9 w-48" />
          <SkeletonProductsToolbar />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }, (_, i) => (
              <SkeletonCatalogCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </LoadingStatus>
  )
}
