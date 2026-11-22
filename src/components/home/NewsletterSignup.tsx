import { getTranslations } from 'next-intl/server'

export default async function NewsletterSignup() {
  const t = await getTranslations()

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {t('newsletter.title')}
        </h2>
        <p className="text-gray-600 mb-6">{t('newsletter.description')}</p>
        <p className="text-gray-700 font-medium mb-4">
          {t('newsletter.comingSoon')}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            disabled
            placeholder={t('newsletter.placeholder')}
            aria-disabled="true"
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded opacity-50 cursor-not-allowed"
          >
            {t('newsletter.button')}
          </button>
        </div>
      </div>
    </section>
  )
}
