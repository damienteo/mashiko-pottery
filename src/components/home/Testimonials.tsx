import React from "react";
import { useTranslations, useLocale } from "next-intl";

interface Testimonial {
  quote: Record<string, string>;
  author: Record<string, string>;
}

const mockTestimonials: Testimonial[] = [
  {
    quote: {
      en: "I absolutely love my new Mashiko vase. The craftsmanship is exquisite!",
      ja: "新しい益子焼の花瓶が本当に気に入りました。職人技が素晴らしいです！",
      zh: "我非常喜欢我的新Mashiko花瓶。工艺精湛！",
    },
    author: {
      en: "Aiko T.",
      ja: "田中愛子",
      zh: "李艾子",
    },
  },
  {
    quote: {
      en: "Fast shipping and the pottery arrived in perfect condition. Highly recommend!",
      ja: "迅速な配送で陶器が完璧な状態で届きました。強くおすすめします！",
      zh: "快速发货，陶器完好无损送达。强烈推荐！",
    },
    author: {
      en: "Ken W.",
      ja: "山本健",
      zh: "王建",
    },
  },
  {
    quote: {
      en: "The pieces are even more beautiful in person. I will be a returning customer for sure.",
      ja: "実物はさらに美しかったです。必ずまた購入します。",
      zh: "实物比照片更美。我一定会再次光顾。",
    },
    author: {
      en: "Mina S.",
      ja: "佐藤美奈",
      zh: "王美娜",
    },
  },
];

export default function Testimonials() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t("testimonials.title")}
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
  );
}
