import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { safeCachedPotterList } from "@/lib/catalog/potters";
import PottersClient from "./PottersClient";

export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "meta.potters",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PottersPage() {
  const initialData = await safeCachedPotterList({
    page: 1,
    limit: 10,
    includeProducts: false,
  });

  return <PottersClient initialData={initialData} />;
}
