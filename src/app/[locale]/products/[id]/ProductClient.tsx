"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

import ProductDetails from "@/components/products/ProductDetails";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductDetails,
  selectProductDetails,
  selectProductDetailsIsLoading,
  selectProductDetailsIsSuccess,
  selectProductDetailsError,
} from "@/store/products/productDetailsSlice";
import { logViewItem } from "@/lib/analytics";
import type { Locale } from "@/types/i18n";

export default function ProductClient() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProductDetails);
  const isLoading = useAppSelector(selectProductDetailsIsLoading);
  const isSuccess = useAppSelector(selectProductDetailsIsSuccess);
  const error = useAppSelector(selectProductDetailsError);

  useEffect(() => {
    if (id && !isLoading && !isSuccess) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id, isLoading, isSuccess]);

  useEffect(() => {
    if (isSuccess && product) {
      logViewItem({
        id: product.id,
        title: product.title[locale as keyof typeof product.title],
        price: product.price,
      });
    }
  }, [isSuccess, product]);

  if (isLoading) return <p className="p-8">{t("loading")}</p>;
  if (!isLoading && !isSuccess)
    return <p className="p-8 text-red-600">{error}</p>;
  if (!product) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <ProductDetails
      product={product}
      locale={locale}
      className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 max-w-3xl mx-auto"
    />
  );
}
