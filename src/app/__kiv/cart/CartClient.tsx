"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchCart,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  removeFromCart,
  updateQuantity,
  selectCartTotal,
  selectCartCount,
  clearCart,
} from "@/store/cartSlice";
import { selectCurrentUser } from "@/store/user/authSlice";
import Link from "next/link";
import { useLocale } from "next-intl";
import Button from "@/components/ui/Button";
// import { useRouter } from "next/navigation";
import { logPurchase } from "@/lib/analytics";
import { useToast } from "@/components/ui/Toast";

export default function CartClient() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const isLoading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);
  const user = useAppSelector(selectCurrentUser);
  const locale = useLocale();

  // const router = useRouter();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    document.title = `${t("cart.title")} (${cartCount}) — Mashiko Pottery`;
  }, [cartCount, t]);

  // On mount, load the cart from /api/cart
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handlePurchase = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Purchase failed");
      const order = await res.json();

      logPurchase(order);
      dispatch(clearCart());
      success(t("checkout.success"));
      // router.push(`/order-confirmation/${order.id}`);
    } catch {
      toastError(t("checkout.error"));
    }
  };

  if (isLoading) return <p className="p-8 text-center">{t("loading")}</p>;
  if (error)
    return <p className="p-8 text-center text-red-600">{t("error")}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("cart.title")}</h1>
      {items.length ? (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0"
            >
              {item.image && (
                <div className="w-16 h-16 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-1 md:space-y-0">
                <span className="font-medium">{item.title}</span>
                <span>
                  {t("cart.unitPrice")}: ¥{item.price.toLocaleString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        }),
                      )
                    }
                    className="px-2"
                  >
                    –
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                    className="px-2"
                  >
                    +
                  </button>
                </div>
                <span>
                  {t("cart.lineTotal")}: ¥
                  {(item.price * item.quantity).toLocaleString()}
                </span>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-600 hover:underline"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6 border-t pt-4">
            <p className="font-medium">
              {t("cart.title")} ({cartCount})
            </p>
            <p className="mt-1 text-lg">
              {t("cart.total")}: ¥{cartTotal.toLocaleString()}
            </p>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            {user ? (
              <Button variant="primary" onClick={handlePurchase}>
                {t("checkout.button")}
              </Button>
            ) : (
              <Link
                href={`/${locale}/login?callback=${encodeURIComponent(
                  `/${locale}/cart`,
                )}`}
              >
                <Button variant="primary">{t("common.login.title")}</Button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <section
          className="flex flex-col items-center justify-center py-20"
          aria-live="polite"
        >
          {/* Optional illustration could go here */}
          <p className="text-lg mb-4">{t("cart.empty")}</p>
          <Link href={`/${locale}/products`}>
            <Button variant="primary">{t("cart.continueShopping")}</Button>
          </Link>
        </section>
      )}
    </div>
  );
}
