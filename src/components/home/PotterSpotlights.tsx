import IntentLink from '@/components/ui/IntentLink'
import { getLocale, getTranslations } from 'next-intl/server'
import SmartImage from '@/components/ui/SmartImage'
import type { Potter } from '@/types/potter'

export default async function PotterSpotlights({
  potters,
}: {
  potters: Potter[]
}) {
  const t = await getTranslations()
  const locale = await getLocale()

  if (potters.length === 0) {
    return (
      <section className="py-12 bg-white min-h-[24rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {t('potterSpotlights.title')}
          </h2>
          <p className="text-center text-gray-500">
            {t('potterSpotlights.empty')}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t('potterSpotlights.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {potters.map((potter) => (
            <IntentLink
              key={potter.id}
              href={`/${locale}/potters/${potter.id}`}
              className="block"
            >
              <div className="w-full aspect-square mb-4 relative rounded-lg overflow-hidden bg-gray-100">
                <SmartImage
                  src={potter.imageUrl ?? '/images/potter-fallback.webp'}
                  alt={potter.name[locale as keyof typeof potter.name]}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-center mb-2">
                {potter.name[locale as keyof typeof potter.name]}
              </h3>
              <p className="text-gray-600 text-center">
                {potter.bio[locale as keyof typeof potter.bio]}
              </p>
            </IntentLink>
          ))}
        </div>
      </div>
    </section>
  )
}
