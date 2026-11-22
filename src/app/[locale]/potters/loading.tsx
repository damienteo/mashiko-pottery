import { getTranslations } from 'next-intl/server'
import PottersListSkeleton from '@/components/loading/PottersListSkeleton'

export default async function PottersLoading() {
  const t = await getTranslations('potters')
  return <PottersListSkeleton loadingText={t('loading')} />
}
