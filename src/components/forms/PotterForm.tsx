"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export interface PotterFormValues {
  userId?: string;
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

interface PotterFormProps {
  initialValues?: PotterFormValues;
  onSubmit: (data: PotterFormValues) => void;
  isLoading: boolean;
  errorsFromServer?: string | null;
  submitText?: string;
}

const schema: yup.ObjectSchema<PotterFormValues> = yup.object({
  userId: yup.string().optional(),
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

export default function PotterForm({
  initialValues,
  onSubmit,
  isLoading,
  errorsFromServer,
  submitText,
}: PotterFormProps) {
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PotterFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {initialValues?.userId && (
        <input
          type="hidden"
          value={initialValues.userId}
          {...register("userId")}
        />
      )}

      {/* Localized Name */}
      <fieldset className="space-y-2">
        <legend className="font-semibold mb-1">
          {t("potter.create.name")}
        </legend>
        {(["en", "ja", "zh"] as const).map((lang) => (
          <div key={lang}>
            <label htmlFor={`name.${lang}`} className="block text-sm">
              {t(`potter.create.name${lang.toUpperCase()}`)}
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
        <legend className="font-semibold mb-1">{t("potter.create.bio")}</legend>
        {(["en", "ja", "zh"] as const).map((lang) => (
          <div key={lang}>
            <label htmlFor={`bio.${lang}`} className="block text-sm">
              {t(`potter.create.bio${lang.toUpperCase()}`)}
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
          {t("potter.create.style")}
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
          {t("potter.create.imageUrl")}
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
          ? t("potter.create.submitting")
          : (submitText ?? t("potter.create.submit"))}
      </Button>

      {errorsFromServer && (
        <p className="text-red-600 mt-2 text-sm">{errorsFromServer}</p>
      )}
    </form>
  );
}
