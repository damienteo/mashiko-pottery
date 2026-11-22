// src/app/[locale]/potters/metadata.ts
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }, { locale: "zh" }];
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
