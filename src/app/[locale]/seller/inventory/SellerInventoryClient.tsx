"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchSellerInventory } from "@/store/seller/sellerInventorySlice";
import { useTranslations } from "next-intl";

export default function SellerInventoryClient({ title }: { title: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error } = useSelector(
    (state: RootState) => state.sellerInventory
  );
  const t = useTranslations("seller.inventory");
  // Per-item editing state: set of editing item IDs
  const [editIds, setEditIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchSellerInventory());
  }, [dispatch]);

  // Toggle edit mode for a specific item
  const toggleEdit = (id: string) => {
    setEditIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      {isLoading ? (
        <p>{t("loading")}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">{t("product")}</th>
                <th className="text-left px-4 py-2">{t("sku")}</th>
                <th className="text-left px-4 py-2">{t("stock")}</th>
                <th className="text-left px-4 py-2">{t("price")}</th>
                <th className="text-left px-4 py-2">{t("status")}</th>
                <th className="text-left px-4 py-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isEditing = editIds.has(item.id);
                return (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={item.name}
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={item.sku}
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        item.sku
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          defaultValue={item.stock}
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        item.stock
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          defaultValue={item.price}
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        `¥${item.price}`
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={item.active}
                            className="mr-2"
                          />
                          {item.active ? t("active") : t("inactive")}
                        </label>
                      ) : item.active ? (
                        <span className="text-green-600">{t("active")}</span>
                      ) : (
                        <span className="text-red-500">{t("inactive")}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleEdit(item.id)}
                        className="text-blue-600 hover:underline"
                      >
                        {isEditing ? t("done") : t("edit")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
