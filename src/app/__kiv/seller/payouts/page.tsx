import SellerPayoutListClient from './SellerPayoutListClient'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seller.payouts' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default function SellerPayoutListPage() {
  return <SellerPayoutListClient />
}
