import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { catalogForStaticPage, withCatalogGuard } from '@/lib/catalog/guard'
import {
  emptyProductList,
  getCachedProductById,
  getCachedProductList,
  safeListProductIds,
} from '@/lib/catalog/products'
import { getCachedPotterById } from '@/lib/catalog/potters'
import { localizedText } from '@/lib/catalog/serialize'
import ProductClient from './ProductClient'

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
  const idNum = Number(id)
  if (Number.isNaN(idNum)) {
    return { title: 'Mashiko Pottery' }
  }

  let product
  try {
    product = await withCatalogGuard(() => getCachedProductById(idNum))
  } catch {
    return { title: 'Mashiko Pottery' }
  }
  if (!product) {
    return { title: 'Mashiko Pottery' }
  }

  const titleText = localizedText(product.title, locale)
  const description = localizedText(product.description, locale).slice(0, 150)
  const title = titleText ? `${titleText} – Mashiko Pottery` : 'Mashiko Pottery'
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
  const { id } = await params
  const idNum = Number(id)
  const product = Number.isNaN(idNum)
    ? null
    : await catalogForStaticPage(() => getCachedProductById(idNum), null)
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

  return (
    <ProductClient
      initialProduct={product}
      initialPotter={potter}
      initialProductList={related}
    />
  )
}
