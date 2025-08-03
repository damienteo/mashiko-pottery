"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPottersList,
  selectAllPotters,
  selectPottersListIsLoading,
  selectPottersListError,
} from "@/store/potters/pottersListSlice";

export default function PottersClient() {
  const t = useTranslations();
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const potters = useAppSelector(selectAllPotters);
  const isLoading = useAppSelector(selectPottersListIsLoading);
  const error = useAppSelector(selectPottersListError);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current && !isLoading && potters.length === 0) {
      dispatch(fetchPottersList({}));
      hasFetched.current = true;
    }
  }, [dispatch, potters.length, isLoading]);

  if (isLoading) {
    return <p className="p-8 text-center text-gray-500">{t("loading")}</p>;
  }
  if (error) {
    return <p className="p-8 text-center text-red-600">{error}</p>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("potterSpotlights.title")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {potters.map((potter) => (
            <Link
              key={potter.id}
              href={`/${locale}/potters/${potter.id}`}
              className="block"
            >
              <div className="w-full aspect-square relative mb-4 overflow-hidden rounded-lg">
                <Image
                  src={potter.imageUrl ?? "/fallback.jpg"}
                  alt={potter.name[locale as keyof typeof potter.name]}
                  fill
                  className="object-cover"
                  priority
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
