"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductDetail,
  selectProductDetail,
  selectProductDetailIsLoading,
  selectProductDetailIsSuccess,
  selectProductDetailError,
} from "@/store/products/productDetailSlice";
import { logViewItem } from "@/lib/analytics";
import { addToCart } from "@/store/cartSlice";

export default function ProductClient() {
  const t = useTranslations();
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProductDetail);
  const isLoading = useAppSelector(selectProductDetailIsLoading);
  const isSuccess = useAppSelector(selectProductDetailIsSuccess);
  const error = useAppSelector(selectProductDetailError);

  useEffect(() => {
    if (id && !isLoading && !isSuccess) {
      dispatch(fetchProductDetail(id));
    }
  }, [dispatch, id, isLoading, isSuccess]);

  useEffect(() => {
    if (isSuccess && product) {
      logViewItem({
        id: product.id,
        title: product.title,
        price: product.price,
      });
    }
  }, [isSuccess, product]);

  if (isLoading) return <p className="p-8">{t("product.loading")}</p>;
  if (!isLoading && !isSuccess)
    return <p className="p-8 text-red-600">{error}</p>;
  if (!product) return <p className="p-8">{t("product.loading")}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">{product.title}</h1>
      <p className="mt-2 text-gray-700">¥{product.price.toLocaleString()}</p>
      <button
        onClick={() =>
          dispatch(
            addToCart({
              id: product.id,
              title: product.title,
              price: product.price,
              quantity: 1,
            })
          )
        }
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {t("product.addToCart")}
      </button>
    </div>
  );
}
