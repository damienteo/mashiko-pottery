import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function ShippingGuarantee() {
  const t = useTranslations()

  return (
    <section className="py-10 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4 flex flex-col items-center text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 relative flex-shrink-0">
          <Image
            src="/icons/shipping-guarantee.svg"
            alt={t('shippingGuarantee.iconAlt')}
            fill
            className="object-contain"
            sizes="56px"
            priority
          />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
          {t('shippingGuarantee.title')}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          {t('shippingGuarantee.description')}
        </p>
      </div>
    </section>
  )
}
