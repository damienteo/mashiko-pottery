import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import SellerInventoryClient from './SellerInventoryClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('seller.inventory')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function SellerInventoryPage() {
  const t = await getTranslations('seller.inventory')

  return <SellerInventoryClient title={t('title')} />
}
