import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HomeClient from './HomeClient'
import { routing } from '@/i18n/routing'

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
    namespace: 'meta.home',
  })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function Page() {
  return <HomeClient />
}
