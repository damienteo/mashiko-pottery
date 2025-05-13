import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

import SellerLayoutClient from "./SellerLayoutClient";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "meta.seller.profile",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SellerLayoutClient>{children}</SellerLayoutClient>;
}
