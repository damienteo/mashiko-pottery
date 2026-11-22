import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import ProfileClient from './ProfileClient'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  // Build locale‐prefixed paths
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({
    locale: locale,
    namespace: 'profile',
  })
  return {
    title: t('title'),
    description: t('description') ?? t('title'),
  }
}

export default async function RegisterPage() {
  return <ProfileClient />
}
