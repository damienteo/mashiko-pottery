import SellerPayoutListClient from "./SellerPayoutListClient";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seller.payouts" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function SellerPayoutListPage() {
  return <SellerPayoutListClient />;
}
