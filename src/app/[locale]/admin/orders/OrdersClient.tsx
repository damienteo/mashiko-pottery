"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOrdersList,
  selectAllOrders,
  selectOrdersListIsLoading,
  selectOrdersListError,
} from "@/store/orders/ordersListSlice";
import type { OrderSummary } from "@/store/orders/ordersListSlice";

export default function OrdersClient() {
  const t = useTranslations("admin");
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);
  const isLoading = useAppSelector(selectOrdersListIsLoading);
  const error = useAppSelector(selectOrdersListError);

  useEffect(() => {
    if (!isLoading && orders.length === 0) {
      dispatch(fetchOrdersList());
    }
  }, [dispatch, isLoading, orders.length]);

  if (isLoading) return <p className="p-8">{t("loading")}</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">{t("pages.orders.title")}</h1>
      {orders.map((o: OrderSummary) => (
        <div key={o.id} className="border p-4 rounded">
          <p>
            Order #{o.id} — {o.status}
          </p>
        </div>
      ))}
    </div>
  );
}
