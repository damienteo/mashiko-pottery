import IntentLink from '@/components/ui/IntentLink'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function Footer() {
  const t = await getTranslations()
  const locale = await getLocale()

  return (
    <footer className="bg-white py-6 px-4">
      <nav className="flex justify-center space-x-6 mb-4">
        <IntentLink href={`/${locale}/products`} className="hover:underline">
          {t('footer.nav.shop')}
        </IntentLink>
        <IntentLink href={`/${locale}/products`} className="hover:underline">
          {t('footer.nav.about')}
        </IntentLink>
        <IntentLink href={`/${locale}/products`} className="hover:underline">
          {t('footer.nav.faq')}
        </IntentLink>
        <IntentLink href={`/${locale}/products`} className="hover:underline">
          {t('footer.nav.contact')}
        </IntentLink>
      </nav>
      <div className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Mashiko Pottery
      </div>
    </footer>
  )
}
