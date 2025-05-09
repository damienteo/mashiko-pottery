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
  params: { locale: string };
}): Promise<Metadata> {
  // Fetch localized messages for the login page
  const t = await getTranslations({
    locale: params.locale,
    namespace: "login",
  });
  return {
    title: t("title"),
    description: t("description") ?? t("title"),
  };
}

export default function LoginPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { callback?: string };
}) {
  // Decode the callback or fall back to root of this locale.
  const raw = searchParams.callback ?? `/${params.locale}`;
  const callback = decodeURIComponent(raw);

  return <LoginClient callback={callback} />;
}
