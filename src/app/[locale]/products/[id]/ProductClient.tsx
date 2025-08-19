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
import {
  fetchPotterDetails,
  selectPotterDetails,
  selectPotterDetailsIsLoading,
  selectPotterDetailsIsSuccess,
  selectPotterDetailsError,
} from "@/store/potters/potterDetailsSlice";
import { fetchProductsList } from "@/store/thunks/fetchProductsList";
import {
  selectAllProducts,
  selectProductsListIsLoading,
  selectProductsListIsSuccess,
  selectProductsListError,
} from "@/store/products/productsListSlice";

export default function ProductClient() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProductDetails);
  const isLoading = useAppSelector(selectProductDetailsIsLoading);
  const isSuccess = useAppSelector(selectProductDetailsIsSuccess);
  const error = useAppSelector(selectProductDetailsError);

  const potter = useAppSelector(selectPotterDetails);
  const potterIsLoading = useAppSelector(selectPotterDetailsIsLoading);
  const potterIsSuccess = useAppSelector(selectPotterDetailsIsSuccess);
  const potterError = useAppSelector(selectPotterDetailsError);

  const allProducts = useAppSelector(selectAllProducts);
  const listIsLoading = useAppSelector(selectProductsListIsLoading);
  const listIsSuccess = useAppSelector(selectProductsListIsSuccess);
  const listError = useAppSelector(selectProductsListError);

  useEffect(() => {
    if (id && !isLoading && !isSuccess) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id, isLoading, isSuccess]);

  useEffect(() => {
    if (isSuccess && product) {
      logViewItem({
        id: product.id,
        title: product.title[locale],
        price: product.price,
      });
    }
  }, [isSuccess, product, locale]);

  useEffect(() => {
    if (
      isSuccess &&
      product?.potterId &&
      !potterIsLoading &&
      !potterIsSuccess &&
      !potterError // prevent continuous retries after a failure
    ) {
      dispatch(fetchPotterDetails(String(product.potterId)));
    }
  }, [
    dispatch,
    isSuccess,
    product?.potterId,
    potterIsLoading,
    potterIsSuccess,
    potterError, // watch error so it can block retries
  ]);

  useEffect(() => {
    if (
      isSuccess &&
      product?.potterId &&
      !listIsLoading &&
      !listIsSuccess &&
      !listError // prevent continuous retries after a failure
    ) {
      dispatch(
        fetchProductsList({
          filters: { potterId: product.potterId },
          limit: 50,
          page: 1,
        })
      );
    }
  }, [
    dispatch,
    isSuccess,
    product?.potterId, // depend on the id, not the whole product object
    listIsLoading,
    listIsSuccess,
    listError, // block retries when there's an error
  ]);

  // Derive related (assumes `allProducts` already filtered by potterId via API);
  // exclude the current product; optionally apply a *seeded* shuffle for stable variety.
  const relatedProducts = (() => {
    if (!product || !allProducts?.length) return [];

    // exclude the current product
    const base = allProducts.filter((p) => p.id !== product.id);

    // --- Seeded shuffle for stable, deterministic variety ---
    // Seed idea: combine product id and the current date (UTC day) so it changes once per day per product.
    const seedStr = `${product.id}-${new Date().toISOString().slice(0, 10)}`; // e.g., "47-2025-08-19"
    const seeded = base
      .map((item, idx) => {
        // simple deterministic hash -> number in [0,1)
        const h = Array.from(seedStr + idx).reduce(
          (acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0,
          0
        );
        // normalize hash to [0,1)
        const rand = ((h >>> 0) % 10000) / 10000;
        return { item, rand };
      })
      .sort((a, b) => a.rand - b.rand)
      .map(({ item }) => item);

    return seeded.slice(0, 8);
  })();

  // TODO: Pass potter and relatedProducts into ProductDetails once its API includes those props.
  if (isLoading) return <p className="p-8">{t("loading")}</p>;
  if (!isLoading && !isSuccess)
    return <p className="p-8 text-red-600">{error}</p>;
  if (!product) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <ProductDetails
      product={product}
      locale={locale}
      potter={potter}
      relatedProducts={relatedProducts}
    />
  );
}
