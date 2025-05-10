"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductsList,
  selectAllProducts,
  selectProductsListIsLoading,
  selectProductsListError,
} from "@/store/products/productsListSlice";
import Image from "next/image";
import { formatYen } from "@/utils/format";

export default function ProductsClient() {
  // Using admin messages (provided by AdminLayout), so t() looks in admin namespace
  const t = useTranslations("admin");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const isLoading = useAppSelector(selectProductsListIsLoading);
  const error = useAppSelector(selectProductsListError);

  useEffect(() => {
    if (!isLoading && products.length === 0) {
      dispatch(fetchProductsList());
    }
  }, [dispatch, isLoading, products.length]);

  if (isLoading) return <p className="p-8">{t("loading")}</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">{t("pages.products.title")}</h1>
      {products.map((p) => (
        <div
          key={p.id}
          className="flex items-start space-x-4 border p-4 rounded"
        >
          <div className="w-24 h-24 relative flex-shrink-0 overflow-hidden rounded">
            <Image
              src={p.photos[0]}
              alt={p.title[locale as keyof typeof p.title] || String(p.title)}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-grow">
            <p className="font-medium">
              {p.title[locale as keyof typeof p.title] || String(p.title)} —{" "}
              {formatYen(p.price)}
            </p>
            {p.description && (
              <p className="mt-1 text-sm text-gray-600">
                {p.description[locale as keyof typeof p.description]}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
