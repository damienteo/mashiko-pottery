"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductsList,
  selectAllProducts,
  selectProductsListIsLoading,
  selectProductsListError,
} from "@/store/products/productsListSlice";
import { formatYen } from "@/utils/format";
import { addToCart } from "@/store/cartSlice";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

export default function ProductsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const { success } = useToast();

  const products = useAppSelector(selectAllProducts);
  const isLoading = useAppSelector(selectProductsListIsLoading);
  const error = useAppSelector(selectProductsListError);

  useEffect(() => {
    if (!isLoading && products.length === 0) {
      dispatch(fetchProductsList({}));
    }
  }, [dispatch, isLoading, products.length]);

  if (isLoading) {
    return (
      <p className="p-8 text-center text-gray-500">{t("common.loading")}</p>
    );
  }

  if (error) {
    return <p className="p-8 text-center text-red-600">{error}</p>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("featured.title")}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => {
            const title = p.title[locale as keyof typeof p.title];
            const desc = p.description?.[locale as keyof typeof p.description];

            return (
              <div key={p.id} className="block">
                <Link href={`/${locale}/products/${p.id}`} className="block">
                  <div className="w-full aspect-square relative mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={p.photos[0]}
                      alt={title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <h2 className="text-xl font-medium text-center">{title}</h2>
                  <p className="mt-1 text-gray-700 text-center">
                    {formatYen(p.price)}
                  </p>
                  {desc && (
                    <p className="mt-2 text-sm text-gray-600 text-center">
                      {desc}
                    </p>
                  )}
                </Link>
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      dispatch(
                        addToCart({
                          id: p.id,
                          title,
                          price: p.price,
                          quantity: 1,
                          image: p.photos[0],
                        })
                      );
                      success("Added to cart");
                    }}
                    variant="primary"
                    className="mt-4"
                  >
                    {t("product.addToCart")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
