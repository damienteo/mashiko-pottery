import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { catalogForStaticPage } from '@/lib/catalog/guard'
import { emptyPotterList, getCachedPotterList } from '@/lib/catalog/potters'
import PotterGrid from '@/components/potters/PotterGrid'
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
    namespace: 'meta.potters',
  })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function PottersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const typedLocale = locale as Locale
  const t = await getTranslations()

  const query = {
    page: 1,
    limit: 10,
    includeProducts: false as const,
  }
  const initialData = await catalogForStaticPage(
    () => getCachedPotterList(JSON.stringify(query)),
    emptyPotterList(query)
  )

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t('potterSpotlights.title')}
        </h1>
        {initialData.potters.length === 0 ? (
          <p className="text-center text-gray-500">{t('potters.empty')}</p>
        ) : (
          <PotterGrid potters={initialData.potters} locale={typedLocale} />
        )}
      </div>
    </section>
  )
}
