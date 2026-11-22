"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAllPotters,
  selectPottersListIsLoading,
  selectPottersListError,
  hydratePottersList,
} from "@/store/potters/pottersListSlice";
import { fetchPottersList } from "@/store/thunks/fetchPottersList";
import SmartImage from "@/components/ui/SmartImage";
import type { PotterListResult } from "@/lib/catalog/potters";

export default function PottersClient({
  initialData,
}: {
  initialData: PotterListResult;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const storePotters = useAppSelector(selectAllPotters);
  const isLoading = useAppSelector(selectPottersListIsLoading);
  const error = useAppSelector(selectPottersListError);
  const potters = storePotters.length > 0 ? storePotters : initialData.potters;

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    if (initialData.potters.length > 0) {
      dispatch(hydratePottersList(initialData));
      return;
    }
    if (!isLoading && potters.length === 0) {
      dispatch(fetchPottersList({}));
    }
  }, [dispatch, initialData, isLoading, potters.length]);

  if (isLoading && potters.length === 0) {
    return <p className="p-8 text-center text-gray-500">{t("loading")}</p>;
  }
  if (error && potters.length === 0) {
    return <p className="p-8 text-center text-red-600">{error}</p>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("potterSpotlights.title")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {potters.map((potter, index) => (
            <Link
              key={potter.id}
              href={`/${locale}/potters/${potter.id}`}
              className="block"
            >
              <div className="w-full aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-100">
                <SmartImage
                  src={potter.imageUrl ?? "/images/potter-fallback.webp"}
                  alt={potter.name[locale as keyof typeof potter.name]}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  priority={index === 0}
                />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">
                {potter.name[locale as keyof typeof potter.name]}
              </h2>
              <p className="text-gray-600 text-center">
                {potter.bio[locale as keyof typeof potter.bio]}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
