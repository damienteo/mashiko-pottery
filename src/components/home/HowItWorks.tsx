import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function HowItWorks() {
  const t = useTranslations()

  const steps = [
    {
      icon: '/icons/step1.svg',
      title: t('howItWorks.step1'),
      description: t('howItWorks.step1'),
    },
    {
      icon: '/icons/step2.svg',
      title: t('howItWorks.step2'),
      description: t('howItWorks.step2'),
    },
    {
      icon: '/icons/step3.svg',
      title: t('howItWorks.step3'),
      description: t('howItWorks.step3'),
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t('howItWorks.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="w-16 h-16 mb-4 relative">
                <Image
                  src={step.icon}
                  alt={step.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
