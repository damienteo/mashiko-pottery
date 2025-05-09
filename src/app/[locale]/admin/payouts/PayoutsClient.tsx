"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPayoutsList,
  selectAllPayouts,
  selectPayoutsListIsLoading,
  selectPayoutsListError,
} from "@/store/payouts/payoutsListSlice";

export default function PayoutsClient() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const payouts = useAppSelector(selectAllPayouts);
  const isLoading = useAppSelector(selectPayoutsListIsLoading);
  const error = useAppSelector(selectPayoutsListError);

  useEffect(() => {
    if (!isLoading && payouts.length === 0) {
      dispatch(fetchPayoutsList());
    }
  }, [dispatch, isLoading, payouts.length]);

  if (isLoading) return <p className="p-8">{t("loading")}</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      {payouts.map((p) => (
        <div key={`${p.month}-${p.potterId}`} className="border p-4 rounded">
          <p>
            {p.month}: ¥{p.amount.toLocaleString()} at {p.commissionRate * 100}%
          </p>
        </div>
      ))}
    </div>
  );
}
