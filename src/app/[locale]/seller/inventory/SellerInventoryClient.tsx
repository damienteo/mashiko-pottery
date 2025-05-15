"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchSellerInventory } from "@/store/seller/sellerInventorySlice";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

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

  // Cancel editing for a specific item
  const handleCancelEdit = (id: string) => {
    setEditIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Save changes for a specific item
  const handleSave = (id: string) => {
    // TODO: gather data and dispatch update
    setEditIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto bg-gray-50 border-l-4 border-blue-400">
      <h1 className="text-2xl font-bold text-blue-700 flex items-center space-x-2">
        <span>{title}</span>
        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
          Seller
        </span>
      </h1>
      {isLoading ? (
        <p>{t("loading")}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("product")}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("sku")}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("stock")}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("price")}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {items.map((item) => {
              const isEditing = editIds.has(item.id);
              return (
                <tr key={item.id}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={item.name}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={item.sku}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      item.sku
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        defaultValue={item.stock}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      item.stock
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        defaultValue={item.price}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      `¥${item.price}`
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
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
                  <td className="px-3 py-2 whitespace-nowrap space-x-2 flex items-center">
                    {isEditing ? (
                      <>
                        <Button onClick={() => handleSave(item.id)}>
                          ✅ {t("done")}
                        </Button>
                        <Button onClick={() => handleCancelEdit(item.id)}>
                          ❌ {t("cancel")}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => toggleEdit(item.id)}>
                        {t("edit")}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
