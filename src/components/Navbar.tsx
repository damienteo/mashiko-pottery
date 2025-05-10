"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import LanguageSelector from "./LanguageSelector";
import { useState } from "react";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 bg-white shadow z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo / Site Title */}
          <Link href={`/${locale}`} className="text-xl font-bold">
            {t("site.title")}
          </Link>
          {/* Hamburger button for mobile */}
          <button
            type="button"
            className="sm:hidden flex items-center space-x-1 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={t("menu")}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="text-base font-medium">{t("menu")}</span>
            <span className="w-6 h-6">
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </span>
          </button>
          {/* Desktop menu items */}
          <ul className="hidden sm:flex sm:space-x-6 items-center">
            <li>
              <Link href={`/${locale}/cart`} className="hover:underline">
                {t("cart.title")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/checkout`} className="hover:underline">
                {t("checkout.button")}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/admin/products`}
                className="hover:underline"
              >
                {t("admin.nav.products")}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/admin/orders`}
                className="hover:underline"
              >
                {t("admin.nav.orders")}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/admin/payouts`}
                className="hover:underline"
              >
                {t("admin.nav.payouts")}
              </Link>
            </li>
            <li>
              <LanguageSelector />
            </li>
          </ul>
          {/* Mobile slide-in menu */}
          <div
            className={`fixed inset-0 bg-white z-20 transform transition-transform duration-300 ease-in-out ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            } sm:hidden`}
          >
            <nav className="p-6">
              <ul className="space-y-4">
                <li>
                  <Link
                    href={`/${locale}`}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg"
                  >
                    {t("home.link")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/cart`}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg"
                  >
                    {t("cart.title")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/checkout`}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg"
                  >
                    {t("checkout.button")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/admin/products`}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg"
                  >
                    {t("admin.nav.products")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/admin/orders`}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg"
                  >
                    {t("admin.nav.orders")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/admin/payouts`}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg"
                  >
                    {t("admin.nav.payouts")}
                  </Link>
                </li>
                <li>
                  <LanguageSelector />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </nav>
    </header>
  );
}
