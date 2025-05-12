"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOrdersList,
  selectAllOrders,
  selectOrdersListIsLoading,
  selectOrdersListError,
  updateOrderStatus,
} from "@/store/orders/ordersListSlice";
import type { OrderSummary } from "@/store/orders/ordersListSlice";
import { orderStatusOptions, OrderStatus } from "@/constants/orderStatus";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("admin.pages.orders");
  const dispatch = useAppDispatch();

  const orders = useAppSelector(selectAllOrders);
  const isLoading = useAppSelector(selectOrdersListIsLoading);
  const error = useAppSelector(selectOrdersListError);

  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    if (!isLoading && orders.length === 0) {
      dispatch(fetchOrdersList());
    }
  }, [dispatch, isLoading, orders.length]);

  useEffect(() => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      setStatus(order.status);
    }
  }, [orders, id]);

  if (isLoading) {
    return <p className="p-8">{t("loading")}</p>;
  }
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{t("error")}</p>
        <Button onClick={() => dispatch(fetchOrdersList())} className="mt-4">
          {t("retry")}
        </Button>
      </div>
    );
  }

  const order: OrderSummary | undefined = orders.find((o) => o.id === id);
  if (!order) {
    return <p className="p-8">{t("error")}</p>;
  }

  const handleSave = () => {
    dispatch(updateOrderStatus({ id: order.id, status }));
    setEditing(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center space-x-2">
        <span>
          {t("details")} – {order.id}
        </span>
        <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>

      <div className="flex items-center space-x-4">
        {editing ? (
          <>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="border rounded p-1 text-sm"
            >
              {orderStatusOptions.map((st) => (
                <option key={st} value={st}>
                  {st.charAt(0).toUpperCase() + st.slice(1)}
                </option>
              ))}
            </select>
            <Button variant="primary" onClick={handleSave}>
              {t("actions.save")}
            </Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>
              {t("actions.cancel")}
            </Button>
          </>
        ) : (
          <>
            <StatusBadge status={order.status} />
            <Button variant="secondary" onClick={() => setEditing(true)}>
              {t("actions.edit")}
            </Button>
          </>
        )}
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Item
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Qty
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Unit Price
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Line Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-sm text-gray-900">{item.title}</td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {item.quantity}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                ¥{item.price.toLocaleString(locale)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                ¥{(item.price * item.quantity).toLocaleString(locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-lg font-semibold">
        {t("total")}: ¥{order.total.toLocaleString(locale)}
      </div>
    </div>
  );
}
