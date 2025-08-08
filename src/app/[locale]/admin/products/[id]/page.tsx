"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminProduct,
  updateAdminProduct,
  selectAdminProduct,
  selectAdminProductError,
  selectAdminProductLoading,
} from "@/store/admin/productSlice";
import { SubmitHandler } from "react-hook-form";
import type { UnifiedFormValues } from "@/components/forms/ProductForm";
import ProductForm from "@/components/forms/ProductForm";
import { useToast } from "@/components/ui/Toast";

export default function AdminProductDetail() {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("product.update");
  const dispatch = useAppDispatch();

  const { success, error: toastError } = useToast();
  const isLoading = useAppSelector(selectAdminProductLoading);
  const error = useAppSelector(selectAdminProductError);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && id) {
      dispatch(fetchAdminProduct(Number(id)));
      hasFetched.current = true;
    }
  }, [dispatch, id]);

  const product = useAppSelector(selectAdminProduct);

  const initialValues: UnifiedFormValues = product
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

  const onSubmit: SubmitHandler<UnifiedFormValues> = async (data) => {
    const resultAction = await dispatch(updateAdminProduct(data));
    if (updateAdminProduct.fulfilled.match(resultAction)) {
      success(t("success"));
    } else {
      toastError(error || t("error"));
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center mb-4">
        <span>
          {t("title")} –{" "}
          {initialValues?.title?.[locale as "en" | "ja" | "zh"] ||
            initialValues?.title?.ja}
        </span>
        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      <ProductForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitText={t("submit")}
        isLoading={isLoading}
        errorsFromServer={error}
      />
    </div>
  );
}
