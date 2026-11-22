import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function FeaturedCollections() {
  const t = await getTranslations()
  const locale = await getLocale()

  return (
    <section className="py-12 px-4">
      <h2 className="text-2xl font-semibold mb-4">{t('featured.title')}</h2>
      <p className="mb-6 italic text-gray-600">{t('featured.season')}</p>

      <div className="mt-6 text-center">
        <Link href={`/${locale}/products`} className="text-blue-600 underline">
          {t('featured.viewAll')}
        </Link>
      </div>
    </section>
  )
}
