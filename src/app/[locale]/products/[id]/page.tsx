import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import {
  catalogForStaticPage,
  catalogForStaticPageWithBuildFallback,
  isProductionBuild,
  withCatalogGuard,
} from '@/lib/catalog/guard'
import {
  emptyProductList,
  getCachedProductById,
  getCachedProductList,
  safeListProductIds,
} from '@/lib/catalog/products'
import { getCachedPotterById } from '@/lib/catalog/potters'
import { localizedText } from '@/lib/catalog/serialize'
import { documentTitle, trimAtBoundary } from '@/lib/catalog/trimAtBoundary'
import { pickRelatedProducts } from '@/lib/catalog/relatedProducts'
import ProductDetails from '@/components/products/ProductDetails'
import ViewItemBeacon from '@/components/analytics/ViewItemBeacon'
import type { Locale } from '@/types/i18n'

export const revalidate = 60

export async function generateStaticParams() {
  const ids = await safeListProductIds()
  return routing.locales.flatMap((locale) =>
    ids.map((id) => ({ locale, id: String(id) }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const tNotFound = await getTranslations({
    locale,
    namespace: 'product.notFound',
  })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const brand = tCommon('site.title')
  const idNum = Number(id)
  if (Number.isNaN(idNum)) {
    return { title: tNotFound('title'), description: tNotFound('description') }
  }

  let product
  try {
    product = await withCatalogGuard(() => getCachedProductById(idNum))
  } catch (error) {
    if (!isProductionBuild()) {
      throw error
    }
    return { title: brand }
  }
  if (!product) {
    return { title: tNotFound('title'), description: tNotFound('description') }
  }

  const titleText = localizedText(product.title, locale)
  const description = trimAtBoundary(localizedText(product.description, locale))
  const title = documentTitle(titleText, brand)
  const images = [product.mainImage, ...(product.photos ?? [])].filter(
    (url): url is string => Boolean(url)
  )

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: images.map((url) => ({ url })),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const typedLocale = locale as Locale
  const idNum = Number(id)
  if (Number.isNaN(idNum)) notFound()

  const { value: product, buildFallback: productBuildFallback } =
    await catalogForStaticPageWithBuildFallback(
      () => getCachedProductById(idNum),
      null
    )
  const potter =
    product?.potterId != null
      ? await catalogForStaticPage(
          () => getCachedPotterById(product.potterId),
          null
        )
      : null
  const related =
    product?.potterId != null
      ? await catalogForStaticPage(
          () =>
            getCachedProductList(
              JSON.stringify({
                potterId: product.potterId,
                page: 1,
                limit: 50,
              })
            ),
          emptyProductList({
            potterId: product.potterId,
            page: 1,
            limit: 50,
          })
        )
      : null

  if (!product) {
    if (productBuildFallback) {
      const tCommon = await getTranslations('common')
      return <p className="p-8 text-gray-500">{tCommon('loading')}</p>
    }
    notFound()
  }

  const relatedProducts = pickRelatedProducts(
    related?.products ?? [],
    product.id
  )

  return (
    <>
      <ViewItemBeacon
        id={product.id}
        title={product.title[typedLocale]}
        price={product.price}
      />
      <ProductDetails
        product={product}
        locale={typedLocale}
        potter={potter}
        relatedProducts={relatedProducts}
      />
    </>
  )
}
