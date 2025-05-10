"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

export default function Hero() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="relative bg-gray-100">
      <div className="w-full h-64 relative">
        <Image
          src="/home/hero-banner.png"
          alt={t("home.tagline")}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">
          {t("home.tagline")}
        </h1>
        <div className="space-x-4">
          <Link
            href={`/${locale}/product`}
            className="bg-white text-black px-4 py-2 rounded"
          >
            {t("home.cta.shop")}
          </Link>
          <Link
            href={`/${locale}/potters`}
            className="bg-transparent border border-white text-white px-4 py-2 rounded"
          >
            {t("home.cta.meet")}
          </Link>
        </div>
      </div>
    </section>
  );
}
