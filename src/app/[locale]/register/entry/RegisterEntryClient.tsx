"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  signUpWithOtp,
  selectAuthLoading,
  selectAuthError,
} from "@/store/user/authSlice";
import Button from "@/components/ui/Button";

interface FormData {
  email: string;
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  email: yup
    .string()
    .required("validation.email.required")
    .email("validation.email.invalid"),
});

export default function RegistryEntryClient() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(signUpWithOtp(data.email));
    if (signUpWithOtp.fulfilled.match(result)) {
      router.push("/register/email-sent");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">{t("register.title")}</h1>
      {authError && (
        <div className="mb-4 text-red-600 text-sm font-medium">
          {t("register.error")} – {authError}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="on"
      >
        <div>
          <label htmlFor="email" className="block mb-1">
            {t("register.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={`w-full p-2 border rounded ${errors.email ? "border-red-600" : ""}`}
          />
          {errors.email?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.email.message)}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t("common.loading") : t("register.submit")}
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          className="w-full"
          variant="secondary"
          onClick={() => router.push("/login")}
        >
          {t("register.loginInstead")}
        </Button>
      </form>
    </div>
  );
}
