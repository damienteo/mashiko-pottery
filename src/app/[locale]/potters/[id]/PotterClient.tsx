"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPotterDetail,
  selectPotterDetail,
  selectPotterDetailIsLoading,
  selectPotterDetailIsSuccess,
  selectPotterDetailError,
} from "@/store/potters/potterDetailsSlice";

export default function PotterClient() {
  const t = useTranslations();
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();

  const potter = useAppSelector(selectPotterDetail);
  const isLoading = useAppSelector(selectPotterDetailIsLoading);
  const isSuccess = useAppSelector(selectPotterDetailIsSuccess);
  const error = useAppSelector(selectPotterDetailError);

  useEffect(() => {
    if (id && !isLoading && !isSuccess) {
      if (typeof id === "string") {
        dispatch(fetchPotterDetail(id));
      }
    }
  }, [dispatch, id, isLoading, isSuccess]);

  if (isLoading) return <p className="p-8">{t("potter.loading")}</p>;
  if (!isLoading && !isSuccess)
    return <p className="p-8 text-red-600">{error}</p>;
  if (!potter) return <p className="p-8">{t("potter.loading")}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">{potter.name}</h1>
      <p className="mt-2 text-gray-700">{potter.bio}</p>
    </div>
  );
}
