import { getTranslations } from 'next-intl/server'
import ProductsListSkeleton from '@/components/loading/ProductsListSkeleton'

export default async function ProductsLoading() {
  const t = await getTranslations('common')
  return <ProductsListSkeleton loadingText={t('loading')} />
}
