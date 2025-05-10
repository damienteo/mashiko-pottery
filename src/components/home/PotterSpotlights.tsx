"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPottersList,
  selectAllPotters,
  selectPottersListIsLoading,
  selectPottersListError,
} from "@/store/potters/pottersListSlice";

export default function PotterSpotlights() {
  const t = useTranslations();
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const potters = useAppSelector(selectAllPotters);
  const isLoading = useAppSelector(selectPottersListIsLoading);
  const error = useAppSelector(selectPottersListError);

  React.useEffect(() => {
    dispatch(fetchPottersList());
  }, [dispatch]);

  if (isLoading) {
    return (
      <section className="py-12 bg-white text-center">
        <p className="text-gray-600">{t("potterSpotlights.loading")}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white text-center">
        <p className="text-red-600">{t("potterSpotlights.error")}</p>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t("potterSpotlights.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {potters.map((potter) => (
            <Link
              key={potter.id}
              href={`/${locale}/potters/${potter.id}`}
              className="block"
            >
              <div className="w-full aspect-square mb-4 relative rounded-lg overflow-hidden">
                <Image
                  src={potter.image}
                  alt={potter.name[locale as keyof typeof potter.name]}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-center mb-2">
                {potter.name[locale as keyof typeof potter.name]}
              </h3>
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
