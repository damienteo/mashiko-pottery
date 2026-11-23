import IntentLink from '@/components/ui/IntentLink'
import SmartImage from '@/components/ui/SmartImage'
import { localizedText } from '@/lib/catalog/serialize'
import type { Potter } from '@/types/potter'
import type { Locale } from '@/types/i18n'

export default function PotterGrid({
  potters,
  locale,
}: {
  potters: Potter[]
  locale: Locale
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {potters.map((potter, index) => {
        const styleText = localizedText(potter.style, locale)
        return (
          <IntentLink
            key={potter.id}
            href={`/${locale}/potters/${potter.id}`}
            className="block"
          >
            <div className="w-full aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-100">
              <SmartImage
                src={potter.imageUrl ?? '/images/potter-fallback.webp'}
                alt={potter.name[locale]}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              {potter.name[locale]}
            </h2>
            <p className="text-gray-600 text-center">{potter.bio[locale]}</p>
            {styleText ? (
              <p className="text-gray-500 text-center text-sm mt-1">
                {styleText}
              </p>
            ) : null}
          </IntentLink>
        )
      })}
    </div>
  )
}
