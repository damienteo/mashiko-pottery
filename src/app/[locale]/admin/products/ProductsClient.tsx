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
import { addToCart } from "@/store/cartSlice";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { formatYen } from "@/utils/format";

export default function ProductsClient() {
  const t = useTranslations("admin.pages.products");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const isLoading = useAppSelector(selectProductsListIsLoading);
  const error = useAppSelector(selectProductsListError);
  const { success } = useToast();

  useEffect(() => {
    if (!isLoading && products.length === 0) {
      dispatch(fetchProductsList());
    }
  }, [dispatch, isLoading, products.length]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{t("error")}</p>
        <Button onClick={() => dispatch(fetchProductsList())} className="mt-4">
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const title =
            p.title[locale as keyof typeof p.title] || String(p.title);
          const desc = p.description
            ? p.description[locale as keyof typeof p.description]
            : "";

          return (
            <div
              key={p.id}
              className="flex flex-col bg-white border rounded-lg overflow-hidden shadow-sm"
            >
              <div className="w-full aspect-square relative">
                <Image
                  src={p.photos[0]}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-grow p-4 flex flex-col">
                <h2 className="text-lg font-medium mb-1">{title}</h2>
                <p className="text-gray-700 mb-2">{formatYen(p.price)}</p>
                {desc && (
                  <p className="text-sm text-gray-600 flex-grow">{desc}</p>
                )}
                <div className="mt-4">
                  <Button
                    variant="primary"
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
                      success(t("addToCart.success"));
                    }}
                    className="w-full"
                  >
                    {t("addToCart.label")}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
