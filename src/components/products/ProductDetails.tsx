"use client";

import React from "react";
import Image from "next/image";

// import Button from "@/components/ui/Button";

import type { Product } from "@/types/product";
import type { Locale } from "@/types/i18n";
import { formatYen } from "@/utils/format";

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
        {/* <Button onClick={onAddToCart}>{addToCartText}</Button> */}
      </div>
    </div>
  );
};

export default ProductDetails;
