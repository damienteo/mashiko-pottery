"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations();
  return (
    <header className="sticky top-0 bg-white shadow z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-4 py-4">
          <li>
            <Link href={`/${locale}`} className="hover:underline">
              {t("home.heading")}
            </Link>
          </li>
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
            <Link href={`/${locale}/admin/orders`} className="hover:underline">
              {t("admin.nav.orders")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/admin/payouts`} className="hover:underline">
              {t("admin.nav.payouts")}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
