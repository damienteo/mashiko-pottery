import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import RegisterCompleteProfileClient from './CompleteProfileClient'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

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
    namespace: 'register',
  })
  return {
    title: t('completeProfile.title'),
    description: t('completeProfile.description') ?? t('completeProfile.title'),
  }
}

export default async function RegisterPage() {
  return <RegisterCompleteProfileClient />
}
