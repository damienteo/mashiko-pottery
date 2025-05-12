"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOrdersList,
  selectAllOrders,
  selectOrdersListIsLoading,
  selectOrdersListError,
} from "@/store/orders/ordersListSlice";
import type { OrderSummary } from "@/store/orders/ordersListSlice";
import Button from "@/components/ui/Button";

export default function OrdersClient() {
  const t = useTranslations("admin.pages.orders");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);
  const isLoading = useAppSelector(selectOrdersListIsLoading);
  const error = useAppSelector(selectOrdersListError);

  useEffect(() => {
    if (!isLoading && orders.length === 0) {
      dispatch(fetchOrdersList());
    }
  }, [dispatch, isLoading, orders.length]);

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
                Order ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((o: OrderSummary) => (
              <tr key={o.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {o.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {o.customerName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  ¥{o.total.toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {new Date(o.date).toLocaleDateString(locale)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-800">
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/${locale}/admin/orders/${o.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary">{t("details")}</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
