"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createAdminPotter,
  selectAdminPotterLoading,
  selectAdminPotterError,
} from "@/store/admin/potterSlice";

import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

interface FormData {
  userId: string;
  name: {
    en: string;
    ja: string;
    zh: string;
  };
  bio: {
    en: string;
    ja: string;
    zh: string;
  };
  style: string;
  imageUrl?: string;
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  userId: yup.string().required("User ID is required"),
  name: yup.object({
    en: yup.string().required("English name is required"),
    ja: yup.string().required("Japanese name is required"),
    zh: yup.string().required("Chinese name is required"),
  }),
  bio: yup.object({
    en: yup.string().required("English bio is required"),
    ja: yup.string().required("Japanese bio is required"),
    zh: yup.string().required("Chinese bio is required"),
  }),
  style: yup.string().required("Style is required"),
  imageUrl: yup.string().optional(),
});

export default function PotterCreateClient() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { success, error: toastError } = useToast();

  const isLoading = useAppSelector(selectAdminPotterLoading);
  const error = useAppSelector(selectAdminPotterError);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const resultAction = await dispatch(createAdminPotter(data));
    if (createAdminPotter.fulfilled.match(resultAction)) {
      success(t("admin.potter.create.success"));
      reset();
    } else {
      toastError(t("admin.potter.create.error"));
    }
  };

  return (
    <div className="max-w-xl mx-auto my-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">
        {t("admin.potter.create.title")}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block mb-1">
            {t("admin.potter.create.userId")}
          </label>
          <input
            id="userId"
            {...register("userId")}
            className="w-full p-2 border rounded"
          />
          {errors.userId && (
            <p className="text-red-600 text-sm">{errors.userId.message}</p>
          )}
        </div>

        {/* Localized Name */}
        <fieldset className="space-y-2">
          <legend className="font-semibold mb-1">
            {t("admin.potter.create.name")}
          </legend>
          {(["en", "ja", "zh"] as const).map((lang) => (
            <div key={lang}>
              <label htmlFor={`name.${lang}`} className="block text-sm">
                {t(`admin.potter.create.name${lang.toUpperCase()}`)}
              </label>
              <input
                id={`name.${lang}`}
                {...register(`name.${lang}`)}
                className="w-full p-2 border rounded"
              />
              {errors.name?.[lang] && (
                <p className="text-red-600 text-sm">
                  {errors.name[lang]?.message}
                </p>
              )}
            </div>
          ))}
        </fieldset>

        {/* Localized Bio */}
        <fieldset className="space-y-2">
          <legend className="font-semibold mb-1">
            {t("admin.potter.create.bio")}
          </legend>
          {(["en", "ja", "zh"] as const).map((lang) => (
            <div key={lang}>
              <label htmlFor={`bio.${lang}`} className="block text-sm">
                {t(`admin.potter.create.bio${lang.toUpperCase()}`)}
              </label>
              <textarea
                id={`bio.${lang}`}
                {...register(`bio.${lang}`)}
                rows={3}
                className="w-full p-2 border rounded"
              />
              {errors.bio?.[lang] && (
                <p className="text-red-600 text-sm">
                  {errors.bio[lang]?.message}
                </p>
              )}
            </div>
          ))}
        </fieldset>

        <div>
          <label htmlFor="style" className="block mb-1">
            {t("admin.potter.create.style")}
          </label>
          <input
            id="style"
            {...register("style")}
            className="w-full p-2 border rounded"
          />
          {errors.style && (
            <p className="text-red-600 text-sm">{errors.style.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block mb-1">
            {t("admin.potter.create.imageUrl")}
          </label>
          <input
            id="imageUrl"
            {...register("imageUrl")}
            className="w-full p-2 border rounded"
          />
          {errors.imageUrl && (
            <p className="text-red-600 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full"
        >
          {isLoading || isSubmitting
            ? t("admin.potter.create.submitting")
            : t("admin.potter.create.submit")}
        </Button>

        {error && (
          <p className="text-red-600 mt-2 text-sm">
            {t("admin.potter.create.error")}
          </p>
        )}
      </form>
    </div>
  );
}
