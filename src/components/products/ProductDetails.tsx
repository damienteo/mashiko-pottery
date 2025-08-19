"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";
import type { Locale } from "@/types/i18n";
import type { Potter } from "@/types/potter";
import { formatYen } from "@/utils/format";
import { useTranslations } from "next-intl";

const formatNum = (n: number, locale: Locale) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n);

const compactNumber = (n?: number) =>
  Number.isFinite(n) ? (n as number) : undefined;

interface ProductDetailsProps {
  product: Product;
  locale: Locale;
  imagePriority?: boolean;
  potter?: Potter | null;
  relatedProducts?: Product[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  locale,
  imagePriority = true,
  potter,
  relatedProducts,
}) => {
  const t = useTranslations("product");

  const images = useMemo(() => {
    const imgs: string[] = [];
    if (product.mainImage) {
      imgs.push(product.mainImage);
    }
    if (product.photos?.length) {
      product.photos.forEach((photo) => {
        if (photo && photo !== product.mainImage) {
          imgs.push(photo);
        }
      });
    }
    return imgs;
  }, [product.mainImage, product.photos]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex] || "";

  const title = product.title[locale];

  const L = compactNumber(product.lengthCm);
  const W = compactNumber(product.widthCm);
  const H = compactNumber(product.heightCm);
  const dimParts = [L, W, H]
    .filter((v): v is number => typeof v === "number")
    .map((v) => formatNum(v, locale));
  const dimensionsStr = dimParts.length
    ? `${dimParts.join(" × ")} ${t("unitCm")}`
    : null;
  const weightStr =
    typeof product.weight === "number"
      ? `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(product.weight)} ${t("unitG")}`
      : null;

  return (
    <>
      <div className="px-4 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-4 lg:px-8 lg:pt-12 lg:pb-5 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left column: images and thumbnails */}
        <div>
          <div className="md:flex md:items-start md:gap-4">
            {currentImage && (
              <>
                <div className="relative w-full aspect-square overflow-hidden rounded md:flex-1">
                  <Image
                    src={currentImage}
                    alt={title || "Product image"}
                    fill
                    className="object-cover transition-transform duration-300"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority={imagePriority}
                  />
                </div>
                {images.length > 1 && (
                  <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-[480px] w-20">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative w-16 h-16 rounded overflow-hidden border-2 focus:outline-none ${
                          idx === currentIndex
                            ? "border-blue-600"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${title || "Product"} thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                          priority={false}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="md:hidden mt-4 flex gap-3 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 focus:outline-none ${
                    idx === currentIndex
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${title || "Product"} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    priority={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: product details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <div className="text-xl font-semibold mb-4">
            {formatYen(product.price)}
          </div>
          <p className="mb-4 text-gray-700 text-justify">
            {product.description[locale]}
          </p>
          {(dimensionsStr || weightStr) && (
            <section aria-labelledby="specs-heading" className="mb-4">
              <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-gray-700">
                {dimensionsStr && (
                  <>
                    <dt className="text-gray-500">{t("dimensions")}</dt>
                    <dd>{dimensionsStr}</dd>
                  </>
                )}
                {weightStr && (
                  <>
                    <dt className="text-gray-500">{t("weight")}</dt>
                    <dd>{weightStr}</dd>
                  </>
                )}
              </dl>
            </section>
          )}
          {(product.category || (product.tags && product.tags.length > 0)) && (
            <section aria-labelledby="metadata-heading" className="mb-4">
              <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-gray-700">
                {product.category && (
                  <>
                    <dt className="text-gray-500">{t("category")}</dt>
                    <dd>{product.category}</dd>
                  </>
                )}
                {product.tags && product.tags.length > 0 && (
                  <>
                    <dt className="text-gray-500">{t("tags")}</dt>
                    <dd>{product.tags.join(", ")}</dd>
                  </>
                )}
              </dl>
            </section>
          )}
          {/* Removed potter and related products sections from here */}
          {/* <Button onClick={onAddToCart}>{addToCartText}</Button> */}
        </div>
      </div>

      {/* Secondary section: potter + related products */}
      {(potter || (relatedProducts && relatedProducts.length > 0)) && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-5 lg:px-8 lg:pb-6 max-w-5xl mx-auto">
          {potter && (
            <section aria-labelledby="potter-heading">
              <h2 id="potter-heading" className="text-lg font-semibold mb-3">
                {t("aboutPotter", { default: "About the potter" })}
              </h2>
              <div className="flex items-start gap-4">
                {potter.imageUrl && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                    <Image
                      src={potter.imageUrl}
                      alt={potter.name[locale] || "Potter"}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-medium">{potter.name[locale]}</div>
                  {potter.style && (
                    <div className="text-sm text-gray-600">{potter.style}</div>
                  )}
                  {potter.bio?.[locale] && (
                    <p className="mt-2 text-sm text-gray-700 line-clamp-3 text-justify">
                      {potter.bio[locale]}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {relatedProducts && relatedProducts.length > 0 && (
            <section aria-labelledby="related-heading" className="pt-8">
              <h2 id="related-heading" className="text-lg font-semibold mb-3">
                {t("moreFromThisPotter", { default: "More from this potter" })}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedProducts.slice(0, 8).map((rp) => {
                  const rpTitle = rp.title[locale];
                  const rpImg = rp.mainImage || (rp.photos?.[0] ?? "");
                  return (
                    <Link
                      key={rp.id}
                      href={`/${locale}/products/${rp.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded">
                        {rpImg && (
                          <Image
                            src={rpImg}
                            alt={rpTitle || "Product image"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                            priority={false}
                          />
                        )}
                      </div>
                      <div className="mt-2 text-sm font-medium line-clamp-1">
                        {rpTitle}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatYen(rp.price)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
};

export default ProductDetails;
