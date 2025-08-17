"use client";

import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";

// import { useToast } from "@/components/ui/Toast";
import ProductCard from "@/components/products/ProductCard";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAllProducts,
  selectProductsListIsLoading,
  selectProductsListError,
} from "@/store/products/productsListSlice";
import { fetchProductsList } from "@/store/thunks/fetchProductsList";
// import { addToCart } from "@/store/cartSlice";
import type { Locale } from "@/types/i18n";

export default function ProductsPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const dispatch = useAppDispatch();
  // const { success } = useToast();

  const products = useAppSelector(selectAllProducts);
  const isLoading = useAppSelector(selectProductsListIsLoading);
  const error = useAppSelector(selectProductsListError);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && !isLoading && products.length === 0) {
      dispatch(fetchProductsList({ limit: 50 }));
      hasFetched.current = true;
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
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              locale={locale}
              // onAddToCart={(prod) => {
              //   dispatch(
              //     addToCart({
              //       id: prod.id,
              //       title: prod.title[locale] ?? "",
              //       price: prod.price ?? 0,
              //       quantity: 1,
              //       image: prod.photos[0],
              //     })
              //   );
              //   success("Added to cart");
              // }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
