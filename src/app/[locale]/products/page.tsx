import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { safeCachedProductList } from '@/lib/catalog/products'
import ProductsClient from './ProductsClient'

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
    namespace: 'products',
  })
  const tHome = await getTranslations({
    locale,
    namespace: 'meta.home',
  })
  return {
    title: `${t('title')} – Mashiko Pottery`,
    description: tHome('description'),
  }
}

export default async function ProductsPage() {
  const initialData = await safeCachedProductList({
    page: 1,
    limit: 10,
  })

  return (
    <Suspense>
      <ProductsClient initialData={initialData} />
    </Suspense>
  )
}
