import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import HomeClient from './HomeClient'
import { routing } from '@/i18n/routing'
import { catalogForStaticPage } from '@/lib/catalog/guard'
import { emptyPotterList, getCachedPotterList } from '@/lib/catalog/potters'

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
    namespace: 'meta.home',
  })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const query = {
    page: 1,
    limit: 3,
    includeProducts: false as const,
  }
  const potters = await catalogForStaticPage(
    () => getCachedPotterList(JSON.stringify(query)),
    emptyPotterList(query)
  )
  return <HomeClient initialPotters={potters.potters} />
}
