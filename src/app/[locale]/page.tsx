import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HomeClient from "./HomeClient";
import { routing } from "@/i18n/routing";
import { safeCachedPotterList } from "@/lib/catalog/potters";

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
    namespace: "meta.home",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page() {
  const potters = await safeCachedPotterList({
    page: 1,
    limit: 3,
    includeProducts: false,
  });
  return <HomeClient initialPotters={potters.potters} />;
}
