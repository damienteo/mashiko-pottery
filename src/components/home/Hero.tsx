import Link from 'next/link'
import SmartImage from '@/components/ui/SmartImage'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function Hero() {
  const t = await getTranslations()
  const locale = await getLocale()

  return (
    <section className="relative bg-gray-100">
      <div className="w-full h-64 md:h-96 relative">
        <SmartImage
          src="/home/hero-banner.webp"
          alt={t('home.tagline')}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black opacity-70 flex" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {t('home.tagline')}
        </h1>
        <div className="flex flex-col md:flex-row gap-2 md:space-x-4">
          <Link
            href={`/${locale}/products`}
            className="bg-white text-black px-4 py-2 rounded"
          >
            {t('home.cta.shop')}
          </Link>
          <Link
            href={`/${locale}/potters`}
            className="bg-transparent border border-white text-white px-4 py-2 rounded"
          >
            {t('home.cta.meet')}
          </Link>
        </div>
      </div>
    </section>
  )
}
