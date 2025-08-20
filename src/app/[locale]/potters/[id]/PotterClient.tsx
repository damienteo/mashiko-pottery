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
import Gallery from "@/components/ui/Gallery";

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
    if (id && (!potter || String(potter.id) !== id)) {
      if (typeof id === "string") {
        dispatch(fetchPotterDetails(id));
      }
    }
    // Only refetch when potter changes or id changes
  }, [dispatch, id, potter]);

  if (isLoading) return <p className="p-8">{t("loading")}</p>;
  if (!isLoading && !isSuccess)
    return <p className="p-8 text-red-600">{error}</p>;
  if (!potter) return <p className="p-8">{t("loading")}</p>;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full lg:h-full">
          <Gallery
            images={(potter.imageUrl ? [potter.imageUrl] : [])
              .concat(
                Array.isArray(potter.photos)
                  ? potter.photos.filter(Boolean)
                  : []
              )
              .filter(Boolean)
              .filter((v, i, a) => a.indexOf(v) === i)
              .concat(
                !potter.imageUrl &&
                  (!potter.photos || potter.photos.length === 0)
                  ? ["/images/potter-fallback.webp"]
                  : []
              )}
            title={potter.name[locale as keyof typeof potter.name] || "Potter"}
            imagePriority
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-semibold mb-4">
            {potter.name[locale as keyof typeof potter.name]}
          </h1>
          <p className="text-gray-700 text-lg">
            {potter.bio[locale as keyof typeof potter.bio]}
          </p>
        </div>
      </div>
    </div>
  );
}
