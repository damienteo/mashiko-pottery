'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()

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
