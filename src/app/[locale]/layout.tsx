import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
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

import { Inter, Playfair_Display } from 'next/font/google'

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
  setRequestLocale(locale)

  // Latin only: CJK glyphs use the locale system stacks in globals.css.
  // Instantiating Noto here would emit every unicode-range @font-face on
  // every locale, including the unused family's CSS.
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <NextIntlClientProvider>
          <StoreProvider>
            <AuthLoader />
            {process.env.NEXT_PUBLIC_GA_ID ? (
              <Suspense fallback={null}>
                <Analytics />
              </Suspense>
            ) : null}
            <main className="flex-grow">
              <Navbar />
              <ToasterContainer />
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' ? <SpeedInsights /> : null}
      </body>
    </html>
  )
}
