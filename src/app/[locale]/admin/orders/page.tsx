// src/app/[locale]/admin/orders/page.tsx

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import OrdersClient from "./OrdersClient";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  // Next 15 passes params as a Promise<{locale:string}>
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  // await the promise to get the real params
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "meta.admin.pages.orders",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AdminOrdersPage() {
  return <OrdersClient />;
}
