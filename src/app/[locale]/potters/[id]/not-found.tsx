import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import IntentLink from '@/components/ui/IntentLink'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'potter.notFound' })
  const title = t('title')
  const description = t('description')
  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default async function PotterNotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'potter.notFound' })

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('heading')}</h1>
        <p className="text-gray-600 mb-6">{t('description')}</p>
        <IntentLink
          href={`/${locale}/potters`}
          className="text-blue-600 underline"
        >
          {t('back')}
        </IntentLink>
      </div>
    </section>
  )
}
