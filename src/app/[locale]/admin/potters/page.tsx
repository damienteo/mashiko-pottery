import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductsClient from "./PottersClient";
import { routing } from "@/i18n/routing";

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
    namespace: "meta.admin.pages.products",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AdminProductsPage() {
  return <ProductsClient />;
}
