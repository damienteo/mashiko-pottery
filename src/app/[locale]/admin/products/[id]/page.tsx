"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminProduct,
  updateAdminProduct,
  selectAdminProduct,
} from "@/store/admin/productSlice";
import { SubmitHandler } from "react-hook-form";
import type { UnifiedFormValues } from "@/components/forms/ProductForm";
import ProductForm from "@/components/forms/ProductForm";

export default function AdminProductDetail() {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("admin.pages.products");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminProduct(Number(id)));
    }
  }, [dispatch, id]);

  const product = useAppSelector(selectAdminProduct);

  const defaults: UnifiedFormValues = product
    ? {
        id: product.id,
        potterId: Number(product.potterId), // Ensure potterId is a number
        title: {
          en: product.title?.en ?? "",
          ja: product.title?.ja ?? "",
          zh: product.title?.zh ?? "",
        },
        description: {
          en: product.description?.en ?? "",
          ja: product.description?.ja ?? "",
          zh: product.description?.zh ?? "",
        },
        price: product.price,
        stock: product.stock ?? 0,
        weight: product.weight ?? 0,
        lengthCm: product.lengthCm ?? 0,
        widthCm: product.widthCm ?? 0,
        heightCm: product.heightCm ?? 0,
        leadTimeDays: product.leadTimeDays ?? 0,
        mainImage: product.mainImage ?? "",
        photos: product.photos ?? [],
        tags: product.tags ?? [],
        category: product.category ?? "",
        isDraft: product.isDraft ?? false,
      }
    : {
        potterId: 0,
        title: { en: "", ja: "", zh: "" },
        description: { en: "", ja: "", zh: "" },
        price: 0,
        stock: 0,
        weight: 0,
        lengthCm: 0,
        widthCm: 0,
        heightCm: 0,
        leadTimeDays: 0,
        mainImage: "",
        photos: [],
        tags: [],
        category: "",
        isDraft: true,
      };

  if (!product) {
    return <p>{t("error")}</p>;
  }

  const onSubmit: SubmitHandler<UnifiedFormValues> = (data) => {
    dispatch(updateAdminProduct(data));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center mb-4">
        <span>
          {t("title")} –{" "}
          {defaults?.title?.[locale as "en" | "ja" | "zh"] ||
            defaults?.title?.ja}
        </span>
        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      <ProductForm
        initialValues={defaults}
        onSubmit={onSubmit}
        submitText={t("actions.save")}
        isLoading={false}
        errorsFromServer={null}
      />
    </div>
  );
}
