"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPotterDetails,
  selectPotterDetails,
  selectPotterDetailsIsLoading,
  selectPotterDetailsIsSuccess,
  selectPotterDetailsError,
} from "@/store/potters/potterDetailsSlice";
import Image from "next/image";

export default function PotterClient() {
  const t = useTranslations("potter");
  const locale = useLocale();
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();

  const potter = useAppSelector(selectPotterDetails);
  const isLoading = useAppSelector(selectPotterDetailsIsLoading);
  const isSuccess = useAppSelector(selectPotterDetailsIsSuccess);
  const error = useAppSelector(selectPotterDetailsError);

  useEffect(() => {
    if (id && !isLoading && !isSuccess) {
      if (typeof id === "string") {
        dispatch(fetchPotterDetails(id));
      }
    }
  }, [dispatch, id, isLoading, isSuccess]);

  if (isLoading) return <p className="p-8">{t("loading")}</p>;
  if (!isLoading && !isSuccess)
    return <p className="p-8 text-red-600">{error}</p>;
  if (!potter) return <p className="p-8">{t("loading")}</p>;

  return (
    <div className="p-8">
      <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden">
        <Image
          src={potter.image}
          alt={potter.name[locale as keyof typeof potter.name]}
          fill
          className="object-cover"
          priority
        />
      </div>
      <h1 className="text-3xl font-semibold">
        {potter.name[locale as keyof typeof potter.name]}
      </h1>
      <p className="mt-2 text-gray-700">{potter.bio[locale]}</p>
    </div>
  );
}
