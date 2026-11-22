import IntentLink from '@/components/ui/IntentLink'
import ProductGrid from '@/components/products/ProductGrid'
import { getLocale, getTranslations } from 'next-intl/server'
import type { Product } from '@/types/product'
import type { Locale } from '@/types/i18n'

export default async function FeaturedCollections({
  products,
}: {
  products: Product[]
}) {
  const t = await getTranslations()
  const locale = (await getLocale()) as Locale

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{t('featured.title')}</h2>
        <p className="mb-6 italic text-gray-600">{t('featured.season')}</p>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 min-h-[20rem] flex items-center justify-center">
            {t('featured.empty')}
          </p>
        ) : (
          <div className="min-h-[20rem]">
            <ProductGrid
              products={products}
              locale={locale}
              variant="compact"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            />
          </div>
        )}

        <div className="mt-6 text-center">
          <IntentLink
            href={`/${locale}/products`}
            className="text-blue-600 underline"
          >
            {t('featured.viewAll')}
          </IntentLink>
        </div>
      </div>
    </section>
  )
}
