import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import {
  safeCachedProductById,
  safeCachedProductList,
  safeListProductIds,
} from '@/lib/catalog/products'
import { safeCachedPotterById } from '@/lib/catalog/potters'
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

  const product = await safeCachedProductById(idNum)
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
    : await safeCachedProductById(idNum)
  const potter =
    product?.potterId != null
      ? await safeCachedPotterById(product.potterId)
      : null
  const related =
    product?.potterId != null
      ? await safeCachedProductList({
          potterId: product.potterId,
          page: 1,
          limit: 50,
        })
      : null

  return (
    <ProductClient
      initialProduct={product}
      initialPotter={potter}
      initialProductList={related}
    />
  )
}
