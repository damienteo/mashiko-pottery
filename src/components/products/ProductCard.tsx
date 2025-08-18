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
  const title = product.title?.[locale] ?? "";
  const description = product.description?.[locale] ?? "";

  const imageSrc = product.mainImage || product.photos?.[0] || FALLBACK_IMG;
  const productHref = href ?? `/${locale}/products/${product.id}`;

  return (
    <article className="group flex flex-col h-full">
      <Link
        href={productHref}
        className="block"
        aria-label={title || "Product"}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageSrc}
            alt={title || "Product image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            priority={false}
          />
        </div>
        <div className="mt-3 flex flex-col items-center text-center">
          <h3 className="text-2xl leading-snug font-serif line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-800">{formatYen(product.price)}</p>
          {!!description && (
            <p className="mt-1 text-md text-justify text-gray-600 line-clamp-4">
              {description}
            </p>
          )}
        </div>
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
