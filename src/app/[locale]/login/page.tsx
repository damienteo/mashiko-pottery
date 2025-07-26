import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import LoginClient from "./LoginClient";
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
    namespace: "common.login",
  });
  return {
    title: t("title"),
    description: t("description") ?? t("title"),
  };
}

export default async function LoginPage(context: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callback?: string }>;
}) {
  const { locale } = await context.params;
  const { callback: raw } = await context.searchParams;
  const rawCallback = raw ?? `/${locale}`;
  const callback = decodeURIComponent(rawCallback);

  return <LoginClient callback={callback} />;
}
