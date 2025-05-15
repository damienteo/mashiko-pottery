"use client";

import { useAppSelector } from "@/store/hooks";
import { selectSellerProfile } from "@/store/seller/sellerSlice";
import { useTranslations } from "next-intl";
import { localeLabels } from "@/constants/localeLabels";
import RichTextViewer from "@/components/ui/RichTextViewer";
import Button from "@/components/ui/Button";

type SellerProfileViewProps = {
  onEdit: () => void;
};

export function SellerProfileView({ onEdit }: SellerProfileViewProps) {
  const t = useTranslations("seller.profile");
  const profile = useAppSelector(selectSellerProfile);

  return (
    <div className="mt-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["en", "ja", "zh-CN"] as const).map((loc) => (
          <div key={loc}>
            <h2 className="font-medium">
              {t("fields.name")} ({localeLabels[loc]})
            </h2>
            <p>{profile?.name[loc]}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["en", "ja", "zh-CN"] as const).map((loc) => (
          <div key={loc}>
            <h2 className="font-medium">
              {t("fields.bio")} ({localeLabels[loc]})
            </h2>
            <RichTextViewer html={profile?.bio[loc] || ""} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["en", "ja", "zh-CN"] as const).map((loc) => (
          <div key={loc}>
            <h2 className="font-medium">
              {t("fields.portfolio")} ({localeLabels[loc]})
            </h2>
            <p>{profile?.portfolio[loc]}</p>
          </div>
        ))}
      </div>

      <Button variant="primary" onClick={onEdit}>
        {t("actions.edit")}
      </Button>
    </div>
  );
}
