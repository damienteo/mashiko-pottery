import { getTranslations } from 'next-intl/server'
import ProductDetailSkeleton from '@/components/loading/ProductDetailSkeleton'

export default async function ProductDetailLoading() {
  const t = await getTranslations('product')
  return <ProductDetailSkeleton loadingText={t('loading')} />
}
