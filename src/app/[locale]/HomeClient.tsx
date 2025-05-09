"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductsList,
  selectAllProducts,
  selectProductsListIsLoading,
  selectProductsListError,
} from "@/store/products/productsListSlice";

export default function HomeClient() {
  const t = useTranslations();
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

  if (isLoading) return <p className="p-8">{t("product.loading")}</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/${locale}/product/${product.id}`}
          className="border p-4 rounded hover:shadow"
        >
          <h2 className="font-semibold text-xl">{product.title}</h2>
          <p className="mt-2">¥{product.price.toLocaleString()}</p>
        </Link>
      ))}
    </div>
  );
}
