import { getTranslations } from 'next-intl/server'
import PotterDetailSkeleton from '@/components/loading/PotterDetailSkeleton'

export default async function PotterDetailLoading() {
  const t = await getTranslations('potter')
  return <PotterDetailSkeleton loadingText={t('loading')} />
}
