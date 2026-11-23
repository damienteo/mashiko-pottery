import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

const STEPS = [
  { icon: '/icons/step1.svg', key: 'step1' },
  { icon: '/icons/step2.svg', key: 'step2' },
  { icon: '/icons/step3.svg', key: 'step3' },
  { icon: '/icons/step4.svg', key: 'step4' },
] as const

export default async function HowItWorks() {
  const t = await getTranslations()

  const steps = STEPS.map((step) => ({
    icon: step.icon,
    title: t(`howItWorks.${step.key}.title`),
    description: t(`howItWorks.${step.key}.description`),
  }))

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t('howItWorks.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="w-16 h-16 mb-4 relative">
                <Image
                  src={step.icon}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-contain"
                  sizes="64px"
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
