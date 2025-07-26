import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import RegisterClient from "./RegisterEntryClient";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  // Build locale‐prefixed paths
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale,
    namespace: "register.entry",
  });
  return {
    title: t("pageTitle"),
    description: t("pageDescription") ?? t("pageTitle"),
  };
}

export default async function RegisterEntryPage() {
  return <RegisterClient />;
}
