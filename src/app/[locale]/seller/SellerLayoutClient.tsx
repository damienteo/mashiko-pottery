"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface SellerLayoutClientProps {
  children: React.ReactNode;
}

export default function SellerLayoutClient({
  children,
}: SellerLayoutClientProps) {
  const locale = useLocale();
  const t = useTranslations("seller.nav");
  const path = usePathname();
  const base = `/${locale}/seller`;

  const navItems = [
    { href: `${base}/profile`, label: t("profile") },
    { href: `${base}/inventory`, label: t("inventory") },
    { href: `${base}/payouts`, label: t("payoutHistory") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-900 text-white py-3 shadow-md">
        <nav className="max-w-7xl mx-auto px-4 flex space-x-6">
          {navItems.map(({ href, label }) => {
            const isActive = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-lg font-medium ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6 border-l-4 border-blue-400 bg-white p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
