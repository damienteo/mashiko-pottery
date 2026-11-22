import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { safeCachedPotterById, safeListPotterIds } from '@/lib/catalog/potters'
import { safeCachedProductList } from '@/lib/catalog/products'
import PotterClient from './PotterClient'

export const revalidate = 60

export async function generateStaticParams() {
  const ids = await safeListPotterIds()
  return routing.locales.flatMap((locale) =>
    ids.map((id) => ({ locale, id: String(id) }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'ja' | 'zh')) notFound()

  const t = await getTranslations({ locale, namespace: 'meta.potter' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function PotterPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id } = await params
  const idNum = Number(id)
  const potter = Number.isNaN(idNum) ? null : await safeCachedPotterById(idNum)
  const products =
    potter != null
      ? await safeCachedProductList({
          potterId: potter.id,
          page: 1,
          limit: 20,
        })
      : null

  return <PotterClient initialPotter={potter} initialProductList={products} />
}
