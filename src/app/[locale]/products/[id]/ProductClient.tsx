"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductDetails,
  selectProductDetails,
  selectProductDetailsIsLoading,
  selectProductDetailsIsSuccess,
  selectProductDetailsError,
} from "@/store/products/productDetailsSlice";
import { logViewItem } from "@/lib/analytics";
import { addToCart } from "@/store/cartSlice";
import { formatYen } from "@/utils/format";
import { ToasterContainer, useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

export default function ProductClient() {
  const t = useTranslations("product");
  const locale = useLocale();
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const { success } = useToast();
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

  // Typed accessors for localized fields
  const title = product.title[locale as keyof typeof product.title];
  const description =
    product.description?.[locale as keyof typeof product.description];

  return (
    <>
      <ToasterContainer />
      <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 max-w-3xl mx-auto">
        <div className="w-full aspect-square relative mb-6 overflow-hidden rounded-lg">
          <Image
            src={product.photos[0]}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && <p className="mt-2 text-gray-700">{description}</p>}
        <p className="mt-2 text-gray-700">{formatYen(product.price)}</p>
        <Button
          onClick={() => {
            dispatch(
              addToCart({
                id: product.id,
                title: title,
                price: product.price,
                quantity: 1,
              })
            );
            success("Added to cart");
          }}
          variant="primary"
          className="mt-4"
        >
          {t("addToCart")}
        </Button>
      </div>
    </>
  );
}
