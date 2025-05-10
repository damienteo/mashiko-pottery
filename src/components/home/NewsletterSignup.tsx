"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslations } from "next-intl";

interface FormData {
  email: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  })
  .required();

export default function NewsletterSignup() {
  const t = useTranslations("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email }: FormData) => {
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // handle error globally or via formState
    }
  };

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {t("newsletter.title")}
        </h2>
        <p className="text-gray-600 mb-6">{t("newsletter.description")}</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="email"
            {...register("email")}
            placeholder={t("newsletter.placeholder")}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? t("newsletter.loading") : t("newsletter.button")}
          </button>
        </form>
        {errors.email && (
          <p className="mt-2 text-red-600 text-sm">{errors.email.message}</p>
        )}
        {isSubmitSuccessful && (
          <p className="mt-4 text-green-600">{t("newsletter.success")}</p>
        )}
      </div>
    </section>
  );
}
