import LoadingStatus from '@/components/loading/LoadingStatus'
import {
  SkeletonAspectSquare,
  SkeletonLine,
} from '@/components/loading/skeletonBlocks'

type ProductDetailSkeletonProps = {
  loadingText: string
}

export default function ProductDetailSkeleton({
  loadingText,
}: ProductDetailSkeletonProps) {
  return (
    <LoadingStatus loadingText={loadingText} skeleton="product-detail">
      <div className="px-4 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-4 lg:px-8 lg:pt-12 lg:pb-5 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <SkeletonAspectSquare className="rounded" />
        </div>
        <div className="space-y-4">
          <SkeletonLine className="h-8 w-4/5" />
          <SkeletonLine className="h-7 w-28" />
          <div className="space-y-2 pt-2">
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-11/12" />
            <SkeletonLine className="h-4 w-10/12" />
          </div>
          <div className="space-y-2 pt-4">
            <SkeletonLine className="h-4 w-32" />
            <SkeletonLine className="h-4 w-40" />
          </div>
        </div>
      </div>
    </LoadingStatus>
  )
}
