/* SellerPayoutListClient.tsx */
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSellerPayoutList,
  selectSellerPayoutList,
  selectSellerPayoutListError,
  selectSellerPayoutListLoading,
} from "@/store/seller/sellerPayoutListSlice";
import Button from "@/components/ui/Button";
import EditablePayoutRow from "./EditablePayoutRow";

export default function SellerPayoutListClient() {
  const t = useTranslations("seller.payouts");
  const dispatch = useAppDispatch();
  const payouts = useAppSelector(selectSellerPayoutList);
  const isLoading = useAppSelector(selectSellerPayoutListLoading);
  const error = useAppSelector(selectSellerPayoutListError);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSellerPayoutList());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{t("error")}</p>
        <Button
          onClick={() => dispatch(fetchSellerPayoutList())}
          className="mt-4"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-700 flex items-center space-x-2">
        <span>{t("title")}</span>
        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
          Seller
        </span>
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.id")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.amount")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.commissionRate")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.commissionAmount")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.netAmount")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.status")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.createdAt")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.paidAt")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payouts.map((payout) => (
              <EditablePayoutRow
                key={payout.id}
                payout={payout}
                isEditing={editingId === payout.id}
                onCancel={() => setEditingId(null)}
                onEdit={() => setEditingId(payout.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
