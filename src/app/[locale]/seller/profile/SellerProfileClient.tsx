"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSellerProfile,
  updateSellerProfile,
  selectSellerProfile,
  selectSellerLoading,
  selectSellerError,
} from "@/store/sellerSlice";
import Button from "@/components/ui/Button";

const profileSchema = yup.object({
  name: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    "zh-CN": yup.string().required(),
  }),
  bio: yup.object({
    en: yup.string().max(500).required(),
    ja: yup.string().max(500).required(),
    "zh-CN": yup.string().max(500).required(),
  }),
  portfolio: yup.object({
    en: yup
      .string()
      .max(200, "Max 200 characters")
      .required("Portfolio is required"),
    ja: yup
      .string()
      .max(200, "Max 200 characters")
      .required("Portfolio is required"),
    "zh-CN": yup
      .string()
      .max(200, "Max 200 characters")
      .required("Portfolio is required"),
  }),
});
type ProfileFormValues = yup.InferType<typeof profileSchema>;

export default function SellerProfileClient() {
  const t = useTranslations("seller.profile");
  const dispatch = useAppDispatch();

  const profile = useAppSelector(selectSellerProfile);
  const isLoading = useAppSelector(selectSellerLoading);
  const error = useAppSelector(selectSellerError);

  // Load profile on mount
  useEffect(() => {
    if (!profile && !isLoading) {
      dispatch(fetchSellerProfile());
    }
  }, [dispatch, profile, isLoading]);

  // Prepare default values once profile arrives
  const defaults: ProfileFormValues = profile
    ? {
        name: {
          en: profile.name?.en ?? "",
          ja: profile.name?.ja ?? "",
          "zh-CN": profile.name?.["zh-CN"] ?? "",
        },
        bio: {
          en: profile.bio?.en ?? "",
          ja: profile.bio?.ja ?? "",
          "zh-CN": profile.bio?.["zh-CN"] ?? "",
        },
        portfolio: {
          en: profile.portfolio?.en ?? "",
          ja: profile.portfolio?.ja ?? "",
          "zh-CN": profile.portfolio?.["zh-CN"] ?? "",
        },
      }
    : {
        name: { en: "", ja: "", "zh-CN": "" },
        bio: { en: "", ja: "", "zh-CN": "" },
        portfolio: { en: "", ja: "", "zh-CN": "" },
      };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProfileFormValues>({
    mode: "onChange",
    resolver: yupResolver(profileSchema),
    defaultValues: defaults,
  });

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      reset(defaults);
    }
  }, [profile, reset]);

  if (isLoading) {
    return <p className="p-8">{t("loading")}</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{t("error")}</p>;
  }

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    dispatch(updateSellerProfile(data));
  };

  return (
    <div className="mt-8 p-8 max-w-7xl mx-auto space-y-6 bg-gray-50 border-l-4 border-blue-500">
      <h1 className="text-2xl font-bold text-blue-700">{t("title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">
              {t("fields.name")} (EN)
            </label>
            <input
              {...register("name.en")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.name?.en && (
              <p className="text-red-600 text-xs mt-1">
                {errors.name.en.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.name")} (JA)
            </label>
            <input
              {...register("name.ja")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.name?.ja && (
              <p className="text-red-600 text-xs mt-1">
                {errors.name.ja.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.name")} (ZH-CN)
            </label>
            <input
              {...register("name.zh-CN")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.name?.["zh-CN"] && (
              <p className="text-red-600 text-xs mt-1">
                {errors.name["zh-CN"]?.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">
              {t("fields.bio")} (EN)
            </label>
            <textarea
              {...register("bio.en")}
              rows={3}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.bio?.en && (
              <p className="text-red-600 text-xs mt-1">
                {errors.bio.en.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.bio")} (JA)
            </label>
            <textarea
              {...register("bio.ja")}
              rows={3}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.bio?.ja && (
              <p className="text-red-600 text-xs mt-1">
                {errors.bio.ja.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.bio")} (ZH-CN)
            </label>
            <textarea
              {...register("bio.zh-CN")}
              rows={3}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.bio?.["zh-CN"] && (
              <p className="text-red-600 text-xs mt-1">
                {errors.bio["zh-CN"]?.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">
              {t("fields.portfolio")} (EN)
            </label>
            <input
              {...register("portfolio.en")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.portfolio?.en && (
              <p className="text-red-600 text-xs mt-1">
                {errors.portfolio.en.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.portfolio")} (JA)
            </label>
            <input
              {...register("portfolio.ja")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.portfolio?.ja && (
              <p className="text-red-600 text-xs mt-1">
                {errors.portfolio.ja.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.portfolio")} (ZH-CN)
            </label>
            <input
              {...register("portfolio.zh-CN")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.portfolio?.["zh-CN"] && (
              <p className="text-red-600 text-xs mt-1">
                {errors.portfolio["zh-CN"]?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" variant="primary" disabled={!isValid}>
            {t("actions.save")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset(defaults)}
          >
            {t("actions.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
