"use client";

import { useEffect, useState } from "react";
import type { ProductFilters } from "@/types/common";
import { useTranslations } from "next-intl";

export type ProductsToolbarProps = {
  value: ProductFilters;
  onChange: (next: ProductFilters) => void;
  categories?: string[];
  styles?: string[];
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
  showPotterId = false,
  page = 1,
  totalPages = 0,
  limit = 10,
  onChangePage = () => {},
  onChangeLimit = () => {},
}: ProductsToolbarProps) {
  const t = useTranslations("products.toolbar");
  const [localName, setLocalName] = useState<string>(value.name ?? "");
  const [localMin, setLocalMin] = useState<string>(
    value.priceMin !== null && value.priceMin !== undefined
      ? String(value.priceMin)
      : ""
  );
  const [localMax, setLocalMax] = useState<string>(
    value.priceMax !== null && value.priceMax !== undefined
      ? String(value.priceMax)
      : ""
  );
  const [localPotter, setLocalPotter] = useState<string>(
    value.potterId !== null && value.potterId !== undefined
      ? String(value.potterId)
      : ""
  );
  const [localCategory, setLocalCategory] = useState<string>(
    value.category ?? ""
  );
  const [localStyle, setLocalStyle] = useState<string>(value.style ?? "");
  const [localActive, setLocalActive] = useState<string>(
    typeof value.active === "boolean" ? String(value.active) : ""
  );

  // Keep localName in sync if external filters change (e.g., route/preset updates)
  useEffect(() => {
    setLocalName(value.name ?? "");
  }, [value.name]);

  useEffect(() => {
    setLocalMin(
      value.priceMin !== null && value.priceMin !== undefined
        ? String(value.priceMin)
        : ""
    );
    setLocalMax(
      value.priceMax !== null && value.priceMax !== undefined
        ? String(value.priceMax)
        : ""
    );
    setLocalPotter(
      value.potterId !== null && value.potterId !== undefined
        ? String(value.potterId)
        : ""
    );
    setLocalCategory(value.category ?? "");
    setLocalStyle(value.style ?? "");
    setLocalActive(
      typeof value.active === "boolean" ? String(value.active) : ""
    );
  }, [
    value.priceMin,
    value.priceMax,
    value.potterId,
    value.category,
    value.style,
    value.active,
  ]);

  const preventEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSearch = () => {
    const parsedMin = localMin === "" ? null : Number(localMin);
    const parsedMax = localMax === "" ? null : Number(localMax);
    const parsedPotter = localPotter === "" ? null : Number(localPotter);

    const next: ProductFilters = {
      ...value,
      name: localName === "" ? null : localName,
      category: localCategory === "" ? null : localCategory,
      style: localStyle === "" ? null : localStyle,
      active: localActive === "" ? null : localActive === "true",
      priceMin: Number.isNaN(parsedMin as number) ? null : parsedMin,
      priceMax: Number.isNaN(parsedMax as number) ? null : parsedMax,
      ...(showPotterId
        ? {
            potterId: Number.isNaN(parsedPotter as number)
              ? null
              : parsedPotter,
          }
        : {}),
    };

    onChange(next);
    onChangePage(1);
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
            value={localCategory}
            onChange={(e) => setLocalCategory(e.target.value)}
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
            value={localStyle}
            onChange={(e) => setLocalStyle(e.target.value)}
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
            value={localActive}
            onChange={(e) => setLocalActive(e.target.value)}
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
            type="text"
            inputMode="numeric"
            pattern="\\d*"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onKeyDown={preventEnter}
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
            type="text"
            inputMode="numeric"
            pattern="\\d*"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onKeyDown={preventEnter}
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
              type="text"
              inputMode="numeric"
              pattern="\\d*"
              value={localPotter}
              onChange={(e) => setLocalPotter(e.target.value)}
              onKeyDown={preventEnter}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={t("potter.placeholder")}
            />
          </div>
        )}

        <div className="md:col-start-5 md:col-span-2 flex md:justify-end md:self-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="rounded bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black"
            >
              {t("search.apply")}
            </button>
            <button
              type="button"
              onClick={() => {
                setLocalName("");
                setLocalMin("");
                setLocalMax("");
                setLocalPotter("");
                setLocalCategory("");
                setLocalStyle("");
                setLocalActive("");
                onChange({
                  name: null,
                  category: null,
                  style: null,
                  active: null,
                  priceMin: null,
                  priceMax: null,
                  ...(showPotterId ? { potterId: null } : {}),
                });
                onChangePage(1);
              }}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {t("clear")}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Page size (left) */}
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

        {/* Pagination controls only */}
        <div className="mt-3 md:mt-0 flex justify-end items-center text-sm text-gray-700">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChangePage(page - 1)}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("pagination.prev")}
          </button>
          <span className="mx-4">
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
