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
  params: { locale: string };
}): Promise<Metadata> {
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
