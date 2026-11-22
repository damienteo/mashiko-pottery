import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { SpeedInsights } from '@vercel/speed-insights/next'

import Analytics from './ClientAnalytics'
import StoreProvider from './StoreProvider'
import AuthLoader from '@/components/auth/AuthLoader'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ToasterContainer } from '@/components/ui/Toast'
import './globals.css'

import {
  Inter,
  Playfair_Display,
  Noto_Sans_JP,
  Noto_Serif_SC,
} from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})
const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  const t = await getTranslations({
    locale,
    namespace: 'meta.home',
  })
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  }
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const bodyFont =
    locale === 'ja'
      ? notoSansJP.variable
      : locale === 'zh'
        ? notoSerifSC.variable
        : inter.variable

  return (
    <html
      lang={locale}
      className={`${bodyFont} ${playfair.variable} antialiased`}
    >
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <NextIntlClientProvider>
          <StoreProvider>
            <AuthLoader />
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
            <main className="flex-grow">
              <Navbar />
              <ToasterContainer />
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
