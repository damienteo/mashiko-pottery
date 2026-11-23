import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { catalogForStaticPage } from '@/lib/catalog/guard'
import { emptyProductList, getCachedProductList } from '@/lib/catalog/products'
import ProductGrid from '@/components/products/ProductGrid'
import ProductsCatalog from './ProductsCatalog'
import type { Locale } from '@/types/i18n'

export const revalidate = 60

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'meta.products',
  })
  const title = t('title')
  const description = t('description')
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const typedLocale = locale as Locale

  const query = { page: 1, limit: 10 }
  const initialData = await catalogForStaticPage(
    () => getCachedProductList(JSON.stringify(query)),
    emptyProductList(query)
  )

  return (
    <ProductsCatalog
      initialData={initialData}
      locale={typedLocale}
      serverGrid={
        <ProductGrid
          products={initialData.products}
          locale={typedLocale}
          variant="compact"
        />
      }
    />
  )
}
