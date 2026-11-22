import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { catalogForStaticPage } from '@/lib/catalog/guard'
import { getCachedPotterById, safeListPotterIds } from '@/lib/catalog/potters'
import { emptyProductList, getCachedProductList } from '@/lib/catalog/products'
import { uniqueGalleryImages } from '@/lib/catalog/galleryImages'
import Gallery from '@/components/ui/Gallery'
import ProductGrid from '@/components/products/ProductGrid'
import PotterProductsCatalog from './PotterProductsCatalog'
import type { Locale } from '@/types/i18n'

export const revalidate = 60

export async function generateStaticParams() {
  const ids = await safeListPotterIds()
  return routing.locales.flatMap((locale) =>
    ids.map((id) => ({ locale, id: String(id) }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'ja' | 'zh')) notFound()

  const t = await getTranslations({ locale, namespace: 'meta.potter' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function PotterPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const typedLocale = locale as Locale
  const t = await getTranslations('potter')
  const idNum = Number(id)
  const potter = Number.isNaN(idNum)
    ? null
    : await catalogForStaticPage(() => getCachedPotterById(idNum), null)
  const products =
    potter != null
      ? await catalogForStaticPage(
          () =>
            getCachedProductList(
              JSON.stringify({
                potterId: potter.id,
                page: 1,
                limit: 20,
              })
            ),
          emptyProductList({ potterId: potter.id, page: 1, limit: 20 })
        )
      : emptyProductList({ potterId: idNum, page: 1, limit: 20 })

  if (!potter) {
    return <p className="p-8 text-red-600">{t('loading')}</p>
  }

  const images = uniqueGalleryImages([
    potter.imageUrl,
    ...(Array.isArray(potter.photos) ? potter.photos : []),
  ])
  const galleryImages =
    images.length > 0 ? images : ['/images/potter-fallback.webp']

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full lg:h-full">
          <Gallery
            images={galleryImages}
            title={potter.name[typedLocale] || 'Potter'}
            imagePriority
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-semibold mb-4">
            {potter.name[typedLocale]}
          </h1>
          <p className="text-gray-700 text-lg">{potter.bio[typedLocale]}</p>
          <dl className="mt-4 text-gray-600">
            {potter.style && (
              <>
                <dt className="font-medium">{t('style')}</dt>
                <dd className="mb-2">{potter.style}</dd>
              </>
            )}
            <dt className="font-medium">{t('active')}</dt>
            <dd className="mb-2">{potter.active ? t('yes') : t('no')}</dd>
          </dl>
        </div>
      </div>

      <PotterProductsCatalog
        potterId={potter.id}
        locale={typedLocale}
        initialData={products}
        serverGrid={
          <ProductGrid
            products={products.products}
            locale={typedLocale}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          />
        }
      />
    </div>
  )
}
