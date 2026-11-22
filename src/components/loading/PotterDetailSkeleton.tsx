import LoadingStatus from '@/components/loading/LoadingStatus'
import {
  SkeletonAspectSquare,
  SkeletonCatalogCard,
  SkeletonLine,
  SkeletonTitleBar,
} from '@/components/loading/skeletonBlocks'

type PotterDetailSkeletonProps = {
  loadingText: string
}

export default function PotterDetailSkeleton({
  loadingText,
}: PotterDetailSkeletonProps) {
  return (
    <LoadingStatus loadingText={loadingText} skeleton="potter-detail">
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="w-full lg:h-full">
            <SkeletonAspectSquare className="rounded" />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <SkeletonLine className="h-9 w-3/4" />
            <div className="space-y-2">
              <SkeletonLine className="h-5 w-full" />
              <SkeletonLine className="h-5 w-full" />
              <SkeletonLine className="h-5 w-10/12" />
            </div>
            <div className="space-y-2 pt-2">
              <SkeletonLine className="h-4 w-24" />
              <SkeletonLine className="h-4 w-32" />
            </div>
          </div>
        </div>

        <section className="pt-12">
          <SkeletonTitleBar className="h-7 w-56 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }, (_, i) => (
              <SkeletonCatalogCard key={i} />
            ))}
          </div>
        </section>
      </div>
    </LoadingStatus>
  )
}
