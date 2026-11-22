import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function Footer() {
  const t = await getTranslations()
  const locale = await getLocale()

  return (
    <footer className="bg-white py-6 px-4">
      <nav className="flex justify-center space-x-6 mb-4">
        <Link
          href={`/${locale}/products`}
          prefetch={false}
          className="hover:underline"
        >
          {t('footer.nav.shop')}
        </Link>
        <Link
          href={`/${locale}/products`}
          prefetch={false}
          className="hover:underline"
        >
          {t('footer.nav.about')}
        </Link>
        <Link
          href={`/${locale}/products`}
          prefetch={false}
          className="hover:underline"
        >
          {t('footer.nav.faq')}
        </Link>
        <Link
          href={`/${locale}/products`}
          prefetch={false}
          className="hover:underline"
        >
          {t('footer.nav.contact')}
        </Link>
      </nav>
      <div className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Mashiko Pottery
      </div>
    </footer>
  )
}
