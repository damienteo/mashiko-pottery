import SellerPayoutDetailsClient from "./SellerPayoutDetailsClient";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seller.payouts" });

  return {
    title: t("details.meta.title"),
    description: t("details.meta.description"),
  };
}

export default function SellerPayoutDetailsPage() {
  return <SellerPayoutDetailsClient />;
}
