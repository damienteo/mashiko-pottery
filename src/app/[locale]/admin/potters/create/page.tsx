import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import PotterCreateClient from './PotterCreateClient'
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
    namespace: 'potter',
  })

  return {
    title: t('create.title'),
    description: t('create.description') ?? t('create.title'),
  }
}

export default function CreatePotterPage() {
  return <PotterCreateClient />
}
