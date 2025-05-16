"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSellerPayoutDetails,
  selectSellerPayoutDetails,
  selectSellerPayoutDetailsLoading,
  selectSellerPayoutDetailsError,
} from "@/store/seller/sellerPayoutDetailsSlice";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { formatYen } from "@/utils/format";

export default function SellerPayoutDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations("seller.payouts");

  const payout = useAppSelector(selectSellerPayoutDetails);
  const isLoading = useAppSelector(selectSellerPayoutDetailsLoading);
  const error = useAppSelector(selectSellerPayoutDetailsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchSellerPayoutDetails(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (error || !payout) {
    return (
      <div className="p-8 text-center text-red-600 space-y-4">
        <p>{t("error")}</p>
        <Button onClick={() => dispatch(fetchSellerPayoutDetails(id))}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white shadow-md rounded-md space-y-6">
      <h1 className="text-xl font-bold text-blue-700">{t("details.title")}</h1>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold text-gray-600">{t("table.id")}:</span>{" "}
          <span className="text-gray-800">{payout.id}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            {t("table.amount")}:
          </span>{" "}
          <span className="text-gray-800">{formatYen(payout.amount)}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            {t("table.status")}:
          </span>{" "}
          <span className="text-gray-800 capitalize">
            {t(`status.${payout.status}`)}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            {t("table.createdAt")}:
          </span>{" "}
          <span className="text-gray-800">
            {new Date(payout.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            {t("table.paidAt")}:
          </span>{" "}
          <span className="text-gray-800">
            {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : "-"}
          </span>
        </div>
      </div>
      <div className="pt-4">
        <Button onClick={() => router.back()} variant="secondary">
          {t("back")}
        </Button>
      </div>
    </div>
  );
}
