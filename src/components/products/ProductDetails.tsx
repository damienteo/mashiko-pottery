"use client";

// Removed unused React import
import Image from "next/image";

// import Button from "@/components/ui/Button";

import type { Product } from "@/types/product";
import type { Locale } from "@/types/i18n";
import { formatYen } from "@/utils/format";

const LABELS: Record<
  Locale,
  {
    dimensions: string;
    weight: string;
    unitCm: string;
    unitG: string;
  }
> = {
  en: {
    dimensions: "Dimensions",
    weight: "Weight",
    unitCm: "cm",
    unitG: "g",
  },
  ja: {
    dimensions: "寸法",
    weight: "重さ",
    unitCm: "cm",
    unitG: "g",
  },
  zh: {
    dimensions: "尺寸",
    weight: "重量",
    unitCm: "厘米",
    unitG: "克",
  },
};

const formatNum = (n: number, locale: Locale) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n);

const compactNumber = (n?: number) =>
  Number.isFinite(n) ? (n as number) : undefined;

interface ProductDetailsProps {
  product: Product;
  locale: Locale;
  //   onAddToCart: () => void;
  //   addToCartText: string;
  imagePriority?: boolean; // whether to preload the main image
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  locale,
  //   onAddToCart,
  //   addToCartText,
  imagePriority = true,
}) => {
  const imageSrc =
    product.mainImage || (product.photos?.length ? product.photos[0] : "");
  const title = product.title[locale];

  const labels = LABELS[locale];
  const L = compactNumber(product.lengthCm);
  const W = compactNumber(product.widthCm);
  const H = compactNumber(product.heightCm);
  const dimParts = [L, W, H]
    .filter((v): v is number => typeof v === "number")
    .map((v) => formatNum(v, locale));
  const dimensionsStr = dimParts.length
    ? `${dimParts.join(" × ")} ${labels.unitCm}`
    : null;
  const weightStr =
    typeof product.weight === "number"
      ? `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(product.weight)} ${labels.unitG}`
      : null;

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {imageSrc && (
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded group">
          <Image
            src={imageSrc}
            alt={title || "Product image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={imagePriority}
          />
        </div>
      )}
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
                  <dt className="text-gray-500">{labels.dimensions}</dt>
                  <dd>{dimensionsStr}</dd>
                </>
              )}
              {weightStr && (
                <>
                  <dt className="text-gray-500">{labels.weight}</dt>
                  <dd>{weightStr}</dd>
                </>
              )}
            </dl>
          </section>
        )}
        {/* <Button onClick={onAddToCart}>{addToCartText}</Button> */}
      </div>
    </div>
  );
};

export default ProductDetails;
