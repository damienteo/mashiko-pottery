"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSelector from "./LanguageSelector";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUserProfile } from "@/store/user/userSlice";
// import { selectCartCount } from "@/store/cartSlice";
import { logoutUser, selectCurrentUser } from "@/store/user/authSlice";
import Button from "@/components/ui/Button";
import { Role } from "@/generated/prisma/enums";

export default function Navbar() {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  // const cartCount = useAppSelector(selectCartCount);
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  const authUser = useAppSelector(selectCurrentUser);
  // const [hasMounted, setHasMounted] = useState(false);
  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);

  return (
    <header className="sticky top-0 bg-white shadow z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo / Site Title */}
          <Link href="/" className="text-xl font-[var(--font-playfair)]">
            {t("common.site.title")}
          </Link>
          {/* Menu toggle for mobile */}
          <button
            type="button"
            className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={t("common.menu")}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="text-base font-medium">{t("common.menu")}</span>
          </button>
          {/* Desktop menu items */}
          <ul className="hidden sm:flex sm:space-x-6 items-center">
            <li>
              <Link href="/products" className="hover:underline">
                {t("products.title")}
              </Link>
            </li>
            <li>
              <Link href="/potters" className="hover:underline">
                {t("potters.title")}
              </Link>
            </li>
            {/* <li>
              <Link href="/cart" className="hover:underline">
                {t("cart.title")}
                {hasMounted ? ` (${cartCount})` : ""}
              </Link>
            </li> */}

            {userProfile?.role === Role.ADMIN && (
              <>
                <li>
                  <Link
                    href="/admin/products"
                    className="hover:underline text-red-600"
                  >
                    {t("admin.nav.products.headline")}
                  </Link>
                </li>
                {/* <li>
                      <Link
                        href="/admin/orders"
                        className="hover:underline text-red-600"
                      >
                        {t("admin.nav.orders")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/payouts"
                        className="hover:underline text-red-600"
                      >
                        {t("admin.nav.payouts")}
                      </Link>
                    </li> */}
              </>
            )}
            {/* Seller navigation links */}
            {userProfile?.role === Role.SELLER && (
              <>
                <li>
                  <Link
                    href="/seller/profile"
                    className="hover:underline text-green-600"
                  >
                    {t("seller.nav.profile")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/seller/inventory"
                    className="hover:underline text-green-600"
                  >
                    {t("seller.nav.inventory")}
                  </Link>
                </li>
                {/* <li>
                      <Link
                        href="/seller/payouts"
                        className="hover:underline text-green-600"
                      >
                        {t("seller.nav.payoutHistory")}
                      </Link>
                    </li> */}
              </>
            )}
            {authUser ? (
              <>
                <li>
                  <Link href="/profile" className="hover:underline">
                    {t("profile.link")}
                  </Link>
                </li>
                <li>
                  <Button
                    variant="secondary"
                    onClick={() => dispatch(logoutUser())}
                    className="hover:underline"
                  >
                    {t("common.logout.title")}
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="hover:underline">
                    {t("common.login.title")}
                  </Link>
                </li>
                <li>
                  <Link href="/register/entry" className="hover:underline">
                    {t("register.title")}
                  </Link>
                </li>
              </>
            )}
            <li>
              <LanguageSelector />
            </li>
          </ul>
          {/* Mobile slide-in menu (always mounted for transitions) */}
          <div className="fixed inset-0 z-20 sm:hidden pointer-events-none">
            {/* Overlay: click to close */}
            <div
              className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${
                menuOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer panel */}
            <div
              className={`fixed top-0 right-0 h-full w-48 bg-white p-6 shadow transform transition-transform duration-300 ease-in-out pointer-events-auto ${
                menuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <nav>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/products"
                      onClick={() => setMenuOpen(false)}
                      className="block text-lg"
                    >
                      {t("products.title")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/potters"
                      onClick={() => setMenuOpen(false)}
                      className="block text-lg"
                    >
                      {t("potters.title")}
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/cart"
                      onClick={() => setMenuOpen(false)}
                      className="block text-lg"
                    >
                      {t("cart.title")}
                      {hasMounted ? ` (${cartCount})` : ""}
                    </Link>
                  </li> */}
                  {userProfile?.role === Role.ADMIN && (
                    <>
                      <li>
                        <Link
                          href="/admin/products"
                          onClick={() => setMenuOpen(false)}
                          className="block text-lg text-red-600"
                        >
                          {t("admin.nav.products.headline")}
                        </Link>
                      </li>
                      {/* <li>
                            <Link
                              href="/admin/orders"
                              onClick={() => setMenuOpen(false)}
                              className="block text-lg text-red-600"
                            >
                              {t("admin.nav.orders")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/payouts"
                              onClick={() => setMenuOpen(false)}
                              className="block text-lg text-red-600"
                            >
                              {t("admin.nav.payouts")}
                            </Link>
                          </li> */}
                    </>
                  )}
                  {/* Seller navigation links */}
                  {userProfile?.role === Role.SELLER && (
                    <>
                      <li>
                        <Link
                          href="/seller/profile"
                          onClick={() => setMenuOpen(false)}
                          className="block text-lg text-green-600"
                        >
                          {t("seller.nav.profile")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/seller/inventory"
                          onClick={() => setMenuOpen(false)}
                          className="block text-lg text-green-600"
                        >
                          {t("seller.nav.inventory")}
                        </Link>
                      </li>
                      {/* <li>
                            <Link
                              href="/seller/payouts"
                              onClick={() => setMenuOpen(false)}
                              className="block text-lg text-green-600"
                            >
                              {t("seller.nav.payoutHistory")}
                            </Link>
                          </li> */}
                    </>
                  )}
                  {authUser ? (
                    <>
                      <li>
                        <Link
                          href="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="block text-lg"
                        >
                          {t("profile.title")}
                        </Link>
                      </li>
                      <li>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            dispatch(logoutUser());
                            setMenuOpen(false);
                          }}
                          className="block text-lg w-full text-left"
                        >
                          {t("common.logout.title")}
                        </Button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          href="/login"
                          onClick={() => setMenuOpen(false)}
                          className="block text-lg"
                        >
                          {t("common.login.title")}
                        </Link>
                      </li>{" "}
                      <li>
                        <Link
                          href="/register/entry"
                          className="hover:underline"
                        >
                          {t("register.title")}
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <LanguageSelector />
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
