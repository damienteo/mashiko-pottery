"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/cartSlice";
import { logBeginCheckout, logPurchase } from "@/lib/analytics";
import { selectCurrentUser, selectAuthLoading } from "@/store/authSlice";

export default function CheckoutClient() {
  const t = useTranslations();
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      // redirect to login, then return to current page
      router.push(`/login?callback=${pathname}`);
    } else if (user) {
      logBeginCheckout(items);
    }
  }, [user, isLoading, items, router]);

  if (!user) return <p className="p-8">{t("checkout.redirecting")}</p>;

  const handlePurchase = async () => {
    const order = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }).then((r) => r.json());

    logPurchase(order);
    dispatch(clearCart());
    router.push(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="p-8">
      <button
        onClick={handlePurchase}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {t("checkout.button")}
      </button>
    </div>
  );
}
