import LoadingStatus from '@/components/loading/LoadingStatus'
import {
  SkeletonPotterCard,
  SkeletonTitleBar,
} from '@/components/loading/skeletonBlocks'

type PottersListSkeletonProps = {
  loadingText: string
}

export default function PottersListSkeleton({
  loadingText,
}: PottersListSkeletonProps) {
  return (
    <LoadingStatus loadingText={loadingText}>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonTitleBar className="h-9 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonPotterCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </LoadingStatus>
  )
}
