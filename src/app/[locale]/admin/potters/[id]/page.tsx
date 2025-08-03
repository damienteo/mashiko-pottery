"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPottersList,
  selectAllPotters,
} from "@/store/potters/pottersListSlice";

import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/ui/Button";

const potterSchema = yup.object({
  name: yup.string().required("Name is required"),
  bio: yup.string().required("Bio is required"),
  style: yup.string().nullable().required("Style is required"), // Make required but allow null
  imageUrl: yup.string().url().nullable().required("Image URL is required"), // same here
  active: yup.boolean().required("Active is required"),
});
type PotterFormValues = yup.InferType<typeof potterSchema>;

export default function AdminPotterDetail() {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("admin.pages.potters");
  const dispatch = useAppDispatch();
  const potters = useAppSelector(selectAllPotters);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current && potters.length === 0) {
      dispatch(fetchPottersList({}));
      hasFetched.current = true;
    }
  }, [dispatch, potters.length]);

  // TODO: This needs to be updated to find potter directly
  // Find potter and derive localized defaults
  const potter = potters.find((p) => String(p.id) === id);
  const defaults: PotterFormValues = potter
    ? {
        name: potter.name[locale as keyof typeof potter.name] ?? "",
        bio: potter.bio[locale as keyof typeof potter.bio] ?? "",
        style: potter.style ?? "", // ensure it's a string, not null
        imageUrl: potter.imageUrl ?? "", // ensure it's a string
        active: potter.active,
      }
    : {
        name: "",
        bio: "",
        style: "",
        imageUrl: "",
        active: true,
      };

  // Initialize form hooks unconditionally
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PotterFormValues>({
    mode: "onChange",
    resolver: yupResolver(potterSchema),
    defaultValues: defaults,
  });

  if (!potter) {
    return <p>{t("error")}</p>;
  }

  const onSubmit: SubmitHandler<PotterFormValues> = (data) => {
    console.log("Updated potter:", data);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center mb-4">
        <span>
          {t("title")} – {defaults.name}
        </span>
        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">{t("table.name")}</label>
          <input
            {...register("name")}
            className="mt-1 block w-full border p-2 rounded bg-white focus:bg-gray-100"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">{t("table.bio")}</label>
          <textarea
            {...register("bio")}
            rows={4}
            className="mt-1 block w-full border p-2 rounded bg-white focus:bg-gray-100"
          />
          {errors.bio && (
            <p className="text-red-600 text-xs mt-1">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            {t("table.style")}
          </label>
          <input
            {...register("style")}
            className="mt-1 block w-full border p-2 rounded bg-white focus:bg-gray-100"
          />
          {errors.style && (
            <p className="text-red-600 text-xs mt-1">{errors.style.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            {t("table.imageUrl")}
          </label>
          <input
            {...register("imageUrl")}
            className="mt-1 block w-full border p-2 rounded bg-white focus:bg-gray-100"
          />
          {errors.imageUrl && (
            <p className="text-red-600 text-xs mt-1">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register("active")} id="active" />
          <label htmlFor="active" className="text-sm font-medium">
            {t("table.active")}
          </label>
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
