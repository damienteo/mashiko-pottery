"use client";

import { useEffect, useState } from "react";
import type { ProductFilters } from "@/types/common";
import { useTranslations } from "next-intl";

export type ProductsToolbarProps = {
  value: ProductFilters;
  onChange: (next: ProductFilters) => void;
  categories?: string[];
  styles?: string[];
  searchDebounceMs?: number;
  showPotterId?: boolean;
  page?: number;
  totalPages?: number;
  limit?: number;
  onChangePage?: (page: number) => void;
  onChangeLimit?: (limit: number) => void;
};

export default function ProductsToolbar({
  value,
  onChange,
  categories = [],
  styles = [],
  searchDebounceMs = 300,
  showPotterId = false,
  page = 1,
  totalPages = 0,
  limit = 10,
  onChangePage = () => {},
  onChangeLimit = () => {},
}: ProductsToolbarProps) {
  const t = useTranslations("products.toolbar");
  const [localName, setLocalName] = useState<string>(value.name ?? "");

  // Keep localName in sync if external filters change (e.g., route/preset updates)
  useEffect(() => {
    setLocalName(value.name ?? "");
  }, [value.name]);

  // Debounce search text updates
  useEffect(() => {
    const id = setTimeout(() => {
      if (localName !== (value.name ?? "")) {
        onChange({ ...value, name: localName === "" ? null : localName });
      }
    }, searchDebounceMs);
    return () => clearTimeout(id);
  }, [localName, value, onChange, searchDebounceMs]);

  const commit = (patch: Partial<ProductFilters>) => {
    const next = { ...value, ...patch };
    onChange(next);
  };

  const handleNumeric =
    (key: "priceMin" | "priceMax") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.trim();
      commit({ [key]: v === "" ? null : Number(v) } as Partial<ProductFilters>);
    };

  const handleSelect =
    (key: "category" | "style") =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value;
      commit({ [key]: v === "" ? null : v } as Partial<ProductFilters>);
    };

  const handleActive = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    commit({ active: v === "" ? null : v === "true" });
  };

  const handlePotter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    commit({ potterId: raw === "" ? null : Number(raw) });
  };

  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        {/* Search */}
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="pfb-name"
          >
            {t("search.label")}
          </label>
          <input
            id="pfb-name"
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder={t("search.placeholder")}
          />
        </div>

        {/* Category */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="pfb-category"
          >
            {t("category.label")}
          </label>
          <select
            id="pfb-category"
            value={value.category ?? ""}
            onChange={handleSelect("category")}
            className="w-full rounded border border-gray-300 px-3 py-2 bg-white"
          >
            <option value="">{t("category.all")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Style */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="pfb-style"
          >
            {t("style.label")}
          </label>
          <select
            id="pfb-style"
            value={value.style ?? ""}
            onChange={handleSelect("style")}
            className="w-full rounded border border-gray-300 px-3 py-2 bg-white"
          >
            <option value="">{t("style.all")}</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Active */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="pfb-active"
          >
            {t("active.label")}
          </label>
          <select
            id="pfb-active"
            value={
              typeof value.active === "boolean" ? String(value.active) : ""
            }
            onChange={handleActive}
            className="w-full rounded border border-gray-300 px-3 py-2 bg-white"
          >
            <option value="">{t("active.all")}</option>
            <option value="true">{t("active.true")}</option>
            <option value="false">{t("active.false")}</option>
          </select>
        </div>

        {/* Price min */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="pfb-min"
          >
            {t("price.minLabel")}
          </label>
          <input
            id="pfb-min"
            type="number"
            inputMode="numeric"
            min={0}
            value={value.priceMin ?? ""}
            onChange={handleNumeric("priceMin")}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Price max */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="pfb-max"
          >
            {t("price.maxLabel")}
          </label>
          <input
            id="pfb-max"
            type="number"
            inputMode="numeric"
            min={0}
            value={value.priceMax ?? ""}
            onChange={handleNumeric("priceMax")}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Potter ID (optional) */}
        {showPotterId && (
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="pfb-potter"
            >
              {t("potter.label")}
            </label>
            <input
              id="pfb-potter"
              type="number"
              inputMode="numeric"
              min={0}
              value={value.potterId ?? ""}
              onChange={handlePotter}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={t("potter.placeholder")}
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 items-center mt-4">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="page-size"
            className="text-sm font-medium text-gray-700"
          >
            {t("pagination.pageSize")}
          </label>
          <select
            id="page-size"
            value={limit}
            onChange={(e) => onChangeLimit(Number(e.target.value))}
            className="rounded border border-gray-300 px-3 py-2 bg-white"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div /> {/* empty spacer */}
        <div className="flex justify-end items-center space-x-2 text-sm text-gray-700">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChangePage(page - 1)}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("pagination.prev")}
          </button>
          <span>
            {t("pagination.pageOf", {
              page,
              totalPages: Math.max(totalPages, 1),
            })}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => onChangePage(page + 1)}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("pagination.next")}
          </button>
        </div>
      </div>
    </section>
  );
}
