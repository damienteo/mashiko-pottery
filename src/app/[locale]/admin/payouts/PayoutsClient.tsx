"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPayoutsList,
  updatePayoutStatus,
  selectAllPayouts,
  selectPayoutsListIsLoading,
  selectPayoutsListError,
} from "@/store/payouts/payoutsListSlice";
import StatusBadge from "@/components/ui/StatusBadge";
import { payoutStatusOptions, PayoutStatus } from "@/constants/payoutStatus";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function PayoutsClient() {
  const t = useTranslations("admin.pages.payouts");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const payouts = useAppSelector(selectAllPayouts);
  const isLoading = useAppSelector(selectPayoutsListIsLoading);
  const error = useAppSelector(selectPayoutsListError);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<PayoutStatus>("pending");

  useEffect(() => {
    if (!isLoading && payouts.length === 0) {
      dispatch(fetchPayoutsList());
    }
  }, [dispatch, isLoading, payouts.length]);

  if (isLoading) return <p className="p-8">{t("loading")}</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8 bg-gray-50 border-l-4 border-yellow-500 space-y-4">
      <h2 className="text-xl font-semibold text-yellow-700 flex items-center">
        {t("title")}
        <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
          Admin
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.potterId")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.month")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.amount")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.commissionRate")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.status")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payouts.map((p) => (
              <tr key={`${p.month}-${p.potterId}`}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {p.potterId}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {p.month}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  ¥{p.amount.toLocaleString(locale)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {(p.commissionRate * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {editingId === `${p.month}-${p.potterId}` ? (
                    <select
                      className="border rounded p-1 text-sm"
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(e.target.value as PayoutStatus)
                      }
                    >
                      {payoutStatusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st.charAt(0).toUpperCase() + st.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <StatusBadge status={p.status} />
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium space-x-2">
                  {editingId === `${p.month}-${p.potterId}` ? (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => {
                          dispatch(
                            updatePayoutStatus({
                              potterId: p.potterId,
                              month: p.month,
                              status: editStatus,
                            })
                          );
                          setEditingId(null);
                        }}
                      >
                        {t("actions.save")}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                      >
                        {t("actions.cancel")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingId(`${p.month}-${p.potterId}`);
                          setEditStatus(p.status);
                        }}
                      >
                        {t("actions.edit")}
                      </Button>
                      <Link
                        href={`/${locale}/admin/payouts/${p.month}|${p.potterId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="secondary">{t("details")}</Button>
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
