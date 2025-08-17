"use client";

import Image from "next/image";
import Link from "next/link";
// import { useTranslations } from "next-intl";

import type { Product } from "@/types/product";
import type { Locale } from "@/types/i18n";
import { formatYen } from "@/utils/format";

export interface ProductCardProps {
  product: Product;
  locale: Locale;
  href?: string;
  //   onAddToCart?: (product: Product) => void;
}

const FALLBACK_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="; // 1x1 transparent pixel

export default function ProductCard({
  product,
  locale,
  href,
  //   onAddToCart,
}: ProductCardProps) {
  //   const t = useTranslations();

  // Safely pick localized fields
  const titleMap = product?.title as Record<Locale, string> | undefined;
  const descMap = product?.description as Record<Locale, string> | undefined;
  const title: string = titleMap?.[locale] ?? "";
  const description: string = descMap?.[locale] ?? "";

  const imageSrc = product.mainImage || product.photos?.[0] || FALLBACK_IMG;
  const productHref = href ?? `/${locale}/products/${product.id}`;

  return (
    <article className="group flex flex-col h-full">
      <Link href={productHref} className="block">
        <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageSrc}
            alt={title || "Product image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            priority={false}
          />
        </div>
        <h3 className="mt-4 text-2xl leading-snug text-center font-serif">
          {title}
        </h3>
        <p className="mt-1 text-center text-gray-800">
          {formatYen(product.price)}
        </p>
        {!!description && (
          <p className="mt-3 text-center text-sm text-gray-600">
            {description}
          </p>
        )}
      </Link>

      {/* KIV: Until E-commerce is implemented, we will not show the "Add to Cart" button. */}
      {/* {onAddToCart && (
        <div className="mt-auto flex justify-center">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t("product.addToCart")}
          >
            {t("product.addToCart")}
          </button>
        </div>
      )} */}
    </article>
  );
}
