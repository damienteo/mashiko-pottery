"use client";

import { useTranslations } from "next-intl";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createAdminPotter,
  selectAdminPotterLoading,
  selectAdminPotterError,
} from "@/store/admin/potterSlice";

import { useToast } from "@/components/ui/Toast";
import PotterForm from "@/components/forms/PotterForm";
import type { PotterFormValues } from "@/components/forms/PotterForm";

export default function PotterCreateClient() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { success, error: toastError } = useToast();

  const isLoading = useAppSelector(selectAdminPotterLoading);
  const error = useAppSelector(selectAdminPotterError);

  const onSubmit = async (data: PotterFormValues) => {
    const resultAction = await dispatch(createAdminPotter(data));
    if (createAdminPotter.fulfilled.match(resultAction)) {
      success(t("potter.create.success"));
    } else {
      toastError(t("potter.create.error"));
    }
  };

  const initialValues: PotterFormValues = {
    userId: "",
    name: { en: "", ja: "", zh: "" },
    bio: { en: "", ja: "", zh: "" },
    style: "",
    imageUrl: "",
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center mb-4">
        <span>{t("potter.create.title")}</span>
        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      <PotterForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitText={t("potter.create.submit")}
        isLoading={isLoading}
        errorsFromServer={error}
      />
    </div>
  );
}
