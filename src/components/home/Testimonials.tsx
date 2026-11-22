import { getLocale, getTranslations } from 'next-intl/server'

interface Testimonial {
  quote: Record<string, string>
  author: Record<string, string>
}

const mockTestimonials: Testimonial[] = [
  {
    quote: {
      en: 'I love my Mashiko vase. The craftsmanship is exquisite.',
      ja: '益子焼の花瓶がとても気に入りました。仕事の細かさが伝わってきます。',
      zh: '我很喜欢这只益子花瓶，工艺细致，耐看。',
    },
    author: {
      en: 'Aiko T.',
      ja: '田中愛子',
      zh: '李艾子',
    },
  },
  {
    quote: {
      en: 'The piece arrived well packed and in perfect condition. I would order again.',
      ja: '丁寧な梱包で、作品は傷ひとつなく届きました。またお願いしたいです。',
      zh: '包装仔细，作品完好送达。还会再买。',
    },
    author: {
      en: 'Ken W.',
      ja: '山本健',
      zh: '王建',
    },
  },
  {
    quote: {
      en: 'The pieces are even more beautiful in person. I will be back.',
      ja: '実物は写真以上に美しかったです。また伺います。',
      zh: '实物比照片更美。我还会再来。',
    },
    author: {
      en: 'Mina S.',
      ja: '佐藤美奈',
      zh: '王美娜',
    },
  },
]

export default async function Testimonials() {
  const t = await getTranslations()
  const locale = await getLocale()

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t('testimonials.title')}
        </h2>
        <div className="space-y-8 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
          {mockTestimonials.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center px-4"
            >
              <p className="text-gray-600 italic mb-2">
                “{item.quote[locale]}”
              </p>
              <p className="font-semibold text-gray-800">
                {item.author[locale]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
