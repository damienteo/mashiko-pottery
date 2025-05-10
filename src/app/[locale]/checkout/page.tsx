import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CheckoutClient from "./CheckoutClient";
import { routing } from "@/i18n/routing";

// Ensure we render with the selected locale
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.checkout" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CheckoutPage() {
  return <CheckoutClient />;
}
