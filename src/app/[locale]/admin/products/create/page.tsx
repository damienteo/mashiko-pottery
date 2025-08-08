"use client";

import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createAdminProduct,
  selectAdminProductLoading,
  selectAdminProductError,
} from "@/store/admin/productSlice";
import { SubmitHandler } from "react-hook-form";
import type { UnifiedFormValues } from "@/components/forms/ProductForm";
import ProductForm from "@/components/forms/ProductForm";
import { useToast } from "@/components/ui/Toast";

export default function AdminProductCreate() {
  const t = useTranslations("admin.pages.products");
  const dispatch = useAppDispatch();

  const { success, error: toastError } = useToast();
  const isLoading = useAppSelector(selectAdminProductLoading);
  const error = useAppSelector(selectAdminProductError);

  const defaults: UnifiedFormValues = {
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

  const onSubmit: SubmitHandler<UnifiedFormValues> = async (data) => {
    const resultAction = await dispatch(createAdminProduct(data));
    if (createAdminProduct.fulfilled.match(resultAction)) {
      success(t("product.create.success"));
    } else {
      toastError(error || t("product.create.error"));
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center mb-4">
        <span>{t("createTitle")}</span>
        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      <ProductForm
        initialValues={defaults}
        onSubmit={onSubmit}
        submitText={t("actions.create")}
        isLoading={isLoading}
        errorsFromServer={error}
      />
    </div>
  );
}
