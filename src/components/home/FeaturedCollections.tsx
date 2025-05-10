"use client";
import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { mockProducts } from "@/mocks/products";

export default function FeaturedCollections() {
  const t = useTranslations();
  const locale = useLocale();
  // Display first 6 featured products
  const featured = mockProducts.slice(0, 6);

  return (
    <section className="py-12 px-4">
      <h2 className="text-2xl font-semibold mb-4">{t("featured.title")}</h2>
      <p className="mb-6 italic text-gray-600">{t("featured.season")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((p) => (
          <Link
            key={p.id}
            href={`/${locale}/product/${p.id}`}
            className="border p-4 rounded hover:shadow"
          >
            <h3 className="font-medium text-lg">
              {String(p.title[locale as keyof typeof p.title])}
            </h3>
            <p className="mt-1 text-gray-700">¥{p.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href={`/${locale}/product`} className="text-blue-600 underline">
          {t("featured.viewAll")}
        </Link>
      </div>
    </section>
  );
}
