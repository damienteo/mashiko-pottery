"use client";
import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  const locale = useLocale();
  // Scope translations to the 'admin' namespace
  const t = useTranslations("admin");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-900 text-white py-3 shadow-md">
        <nav className="max-w-7xl mx-auto px-4 flex space-x-6">
          <Link
            href={`/${locale}/admin/products`}
            className="hover:text-gray-400"
          >
            {t("nav.products.headline")}
          </Link>
          <Link
            href={`/${locale}/admin/products/create`}
            className="hover:text-gray-400"
          >
            {t("nav.products.create")}
          </Link>
          <Link
            href={`/${locale}/admin/potters`}
            className="hover:text-gray-400"
          >
            {t("nav.potters.headline")}
          </Link>
          <Link
            href={`/${locale}/admin/potters/create`}
            className="hover:text-gray-400"
          >
            {t("nav.potters.create")}
          </Link>
          {/* <Link
            href={`/${locale}/admin/orders`}
            className="hover:text-gray-400"
          >
            {t("nav.orders")}
          </Link>
          <Link
            href={`/${locale}/admin/payouts`}
            className="hover:text-gray-400"
          >
            {t("nav.payouts")}
          </Link> */}
        </nav>
      </header>
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
