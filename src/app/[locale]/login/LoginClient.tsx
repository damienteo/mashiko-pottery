"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import Button from "@/components/ui/Button";

interface Props {
  callback: string;
}

interface FormData {
  email: string;
}

const schema = yup.object({
  email: yup
    .string()
    .required("validation.email.required")
    .email("validation.email.invalid"),
});

// TODO:
// Client-side cooldown on submission
// API rate limitting
// CAPCHA

export default function LoginClient({ callback }: Props) {
  const t = useTranslations("common");
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate sending magic link email
      // Replace this with actual API call to send magic link
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmailSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError("email", { message: t("login.error") });
      } else {
        setFormError("email", { message: t("login.unknownError") });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">{t("login.title")}</h1>

      {emailSent && (
        <div className="text-center space-y-4">
          <p>
            {t("login.magicLinkSent")} {t("login.checkYourInbox")}
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="on"
      >
        <div>
          <label htmlFor="email" className="block mb-1">
            {t("login.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={`w-full p-2 border rounded ${errors.email ? "border-red-600" : ""}`}
          />
          {errors.email?.message && (
            <p className="text-red-600 mt-1">{t(errors.email.message)}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t("login.sending") : t("login.sendMagicLink")}
        </Button>
      </form>
    </div>
  );
}
