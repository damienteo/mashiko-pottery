"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductsList,
  selectAllProducts,
} from "@/store/products/productsListSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/ui/Button";

const productSchema = yup.object({
  title: yup.string().required(),
  price: yup.number().positive().required(),
  description: yup.string().max(200),
});
type ProductFormValues = yup.InferType<typeof productSchema>;

export default function AdminProductDetail() {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("admin.pages.products");
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProductsList());
    }
  }, [dispatch, products.length]);

  // Find product and derive localized defaults
  const product = products.find((p) => String(p.id) === id);
  const defaults = product
    ? {
        title: product.title[locale as keyof typeof product.title],
        price: product.price,
        description: product.description
          ? product.description[locale as keyof typeof product.description]
          : "",
      }
    : { title: "", price: 0, description: "" };

  // Initialize form hooks unconditionally
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProductFormValues>({
    mode: "onChange",
    resolver: yupResolver(productSchema),
    defaultValues: defaults,
  });

  if (!product) {
    return <p>{t("error")}</p>;
  }

  const onSubmit: SubmitHandler<ProductFormValues> = (data) => {
    // TODO: dispatch updateProduct({ id: product.id, ...data })
    console.log("Updated", data);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        {t("title")} – {defaults.title}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            {t("table.title")}
          </label>
          <input
            {...register("title")}
            className="mt-1 block w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">
            {t("table.price")}
          </label>
          <input
            type="number"
            {...register("price")}
            className="mt-1 block w-full border p-2 rounded"
          />
          {errors.price && (
            <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">
            {t("table.description")}
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="mt-1 block w-full border p-2 rounded"
          />
          {errors.description && (
            <p className="text-red-600 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <Button type="submit" variant="primary" disabled={!isValid}>
          {t("actions.save")}
        </Button>
        <Button type="button" variant="secondary" onClick={() => reset()}>
          {t("actions.cancel")}
        </Button>
      </form>
    </div>
  );
}
