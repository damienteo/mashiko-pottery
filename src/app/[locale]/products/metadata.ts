import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateStaticParams() {
  // build-time locales
  return [{ locale: "en" }, { locale: "ja" }, { locale: "zh" }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "meta.products",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}
