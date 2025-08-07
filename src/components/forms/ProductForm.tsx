"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "@/components/ui/Button";
import PhotoUploadField from "@/components/forms/PhotoUploadField";
import { useTranslations } from "next-intl";

export interface ProductFormValues {
  id?: number;
  potterId: number;
  title: {
    en: string;
    ja: string;
    zh: string;
  };
  description: {
    en: string;
    ja: string;
    zh: string;
  };
  price: number;
  stock: number;
  weight?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  leadTimeDays?: number;
  photos: string[];
  mainImage?: string;
  tags?: (string | undefined)[];
  category?: string;
  isDraft?: boolean;
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSubmit: (data: ProductFormValues) => void;
  isLoading: boolean;
  errorsFromServer?: string | null;
  submitText?: string;
}

const schema: yup.ObjectSchema<ProductFormValues> = yup.object({
  id: yup.number().optional(),
  potterId: yup.number().required(),
  title: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    zh: yup.string().required(),
  }),
  description: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    zh: yup.string().required(),
  }),
  price: yup.number().required().min(0),
  stock: yup.number().required().min(0),
  weight: yup.number().optional(),
  lengthCm: yup.number().optional(),
  widthCm: yup.number().optional(),
  heightCm: yup.number().optional(),
  leadTimeDays: yup.number().optional(),
  photos: yup
    .array()
    .of(yup.string().url("Must be a valid URL").required())
    .min(1, "At least one photo is required")
    .required("Photos are required"),
  mainImage: yup.string().url().optional(),
  tags: yup.array().of(yup.string().optional()).optional(),
  category: yup.string().optional(),
  isDraft: yup.boolean().optional(),
});

export default function ProductForm({
  initialValues,
  onSubmit,
  isLoading,
  errorsFromServer,
  submitText,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const t = useTranslations();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {initialValues?.id && (
        <input type="hidden" value={initialValues.id} {...register("id")} />
      )}
      <div>
        <label htmlFor="potterId" className="block font-medium mb-1">
          {t("product.create.potterId")}
        </label>
        <input
          id="potterId"
          type="number"
          {...register("potterId")}
          className="w-full p-2 border rounded"
        />
        {errors.potterId && (
          <p className="text-red-600 text-sm mt-1">{errors.potterId.message}</p>
        )}
      </div>

      <fieldset className="border p-3 rounded">
        <legend className="font-semibold mb-2">
          {t("product.create.titleSection")}
        </legend>
        {(["en", "ja", "zh"] as const).map((lang) => (
          <div key={lang} className="mb-2">
            <label htmlFor={`title.${lang}`} className="block font-medium mb-1">
              {t(`product.create.title.${lang}`)}
            </label>
            <input
              id={`title.${lang}`}
              {...register(`title.${lang}`)}
              className="w-full p-2 border rounded"
            />
            {errors.title?.[lang] && (
              <p className="text-red-600 text-sm mt-1">
                {errors.title[lang]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>

      <fieldset className="border p-3 rounded">
        <legend className="font-semibold mb-2">
          {t("product.create.descriptionSection")}
        </legend>
        {(["en", "ja", "zh"] as const).map((lang) => (
          <div key={lang} className="mb-2">
            <label
              htmlFor={`description.${lang}`}
              className="block font-medium mb-1"
            >
              {t(`product.create.description.${lang}`)}
            </label>
            <textarea
              id={`description.${lang}`}
              {...register(`description.${lang}`)}
              rows={3}
              className="w-full p-2 border rounded"
            />
            {errors.description?.[lang] && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description[lang]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>

      <div>
        <label htmlFor="price" className="block font-medium mb-1">
          {t("product.create.price")}
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price")}
          className="w-full p-2 border rounded"
        />
        {errors.price && (
          <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="stock" className="block font-medium mb-1">
          {t("product.create.stock")}
        </label>
        <input
          id="stock"
          type="number"
          {...register("stock")}
          className="w-full p-2 border rounded"
        />
        {errors.stock && (
          <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="weight" className="block font-medium mb-1">
          {t("product.create.weight")}
        </label>
        <input
          id="weight"
          type="number"
          step="0.1"
          {...register("weight")}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="lengthCm" className="block font-medium mb-1">
          {t("product.create.lengthCm")}
        </label>
        <input
          id="lengthCm"
          type="number"
          step="0.1"
          {...register("lengthCm")}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="widthCm" className="block font-medium mb-1">
          {t("product.create.widthCm")}
        </label>
        <input
          id="widthCm"
          type="number"
          step="0.1"
          {...register("widthCm")}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="heightCm" className="block font-medium mb-1">
          {t("product.create.heightCm")}
        </label>
        <input
          id="heightCm"
          type="number"
          step="0.1"
          {...register("heightCm")}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="leadTimeDays" className="block font-medium mb-1">
          {t("product.create.leadTimeDays")}
        </label>
        <input
          id="leadTimeDays"
          type="number"
          {...register("leadTimeDays")}
          className="w-full p-2 border rounded"
        />
      </div>

      <PhotoUploadField<ProductFormValues>
        name="photos"
        control={control}
        label={t("product.create.photos")}
        multiple
      />

      <div>
        <label htmlFor="mainImage" className="block font-medium mb-1">
          {t("product.create.mainImage")}
        </label>
        <input
          id="mainImage"
          type="url"
          {...register("mainImage")}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block font-medium mb-1">
          {t("product.create.tags")}
        </label>
        <input
          id="tags"
          type="text"
          {...register("tags")}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="category" className="block font-medium mb-1">
          {t("product.create.category")}
        </label>
        <input
          id="category"
          type="text"
          {...register("category")}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input id="isDraft" type="checkbox" {...register("isDraft")} />
        <label htmlFor="isDraft" className="font-medium">
          {t("product.create.isDraft")}
        </label>
      </div>

      <Button type="submit" disabled={isLoading || isSubmitting}>
        {submitText ?? t("product.create.submit")}
      </Button>
      {errorsFromServer && (
        <p className="text-red-600 text-sm mt-2">{errorsFromServer}</p>
      )}
    </form>
  );
}
