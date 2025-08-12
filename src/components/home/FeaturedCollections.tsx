"use client";
import React from "react";
import Link from "next/link";
// import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
// import { formatYen } from "@/utils/format";
// import { useAppDispatch } from "@/store/hooks";
// import { useToast } from "@/components/ui/Toast";
// import { addToCart } from "@/store/cartSlice";

export default function FeaturedCollections() {
  const t = useTranslations();
  const locale = useLocale();
  // const dispatch = useAppDispatch();
  // const { success } = useToast();

  return (
    <section className="py-12 px-4">
      <h2 className="text-2xl font-semibold mb-4">{t("featured.title")}</h2>
      <p className="mb-6 italic text-gray-600">{t("featured.season")}</p>

      {/* TODO: Fetch featured products from the store or API */}
      {/* 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded hover:shadow flex flex-col"
          >
            <Link href={`/${locale}/products/${p.id}`} className="mb-4">
              <div className="w-full aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={p.photos[0]}
                  alt={String(p.title[locale as keyof typeof p.title])}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Link>
            <Link
              href={`/${locale}/products/${p.id}`}
              className="font-medium text-lg mb-1"
            >
              {String(p.title[locale as keyof typeof p.title])}
            </Link>
            <p className="text-gray-700">{formatYen(p.price)}</p>
            <p className="mt-2 text-sm text-gray-600">
              {p.description[locale as keyof typeof p.description]}
            </p>
            <button
              type="button"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded transition-colors hover:bg-blue-700 active:bg-blue-800"
              onClick={() => {
                dispatch(
                  addToCart({
                    id: p.id,
                    title: String(p.title[locale as keyof typeof p.title]),
                    price: p.price,
                    quantity: 1,
                    image: p.photos[0],
                  })
                );
                success("Added to cart");
              }}
            >
              {t("product.addToCart")}
            </button>
          </div>
        ))}
      </div> */}

      <div className="mt-6 text-center">
        <Link href={`/${locale}/products`} className="text-blue-600 underline">
          {t("featured.viewAll")}
        </Link>
      </div>
    </section>
  );
}
