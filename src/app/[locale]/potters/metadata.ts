// src/app/[locale]/potters/metadata.ts
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }, { locale: "zh" }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "meta.potters",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}
