import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateStaticParams() {
  // build-time locales
  return [{ locale: 'en' }, { locale: 'ja' }, { locale: 'zh' }]
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
  return {
    title: t('title'),
    description: t('description'),
  }
}
