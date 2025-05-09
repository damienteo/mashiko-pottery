"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductsList,
  selectAllProducts,
  selectProductsListIsLoading,
  selectProductsListError,
} from "@/store/products/productsListSlice";

export default function ProductsClient() {
  const t = useTranslations();
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
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      {products.map((p) => (
        <div key={p.id} className="border p-4 rounded">
          <p>
            {p.title} — ¥{p.price.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
