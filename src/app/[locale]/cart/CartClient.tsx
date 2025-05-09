"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchCart,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  removeFromCart,
} from "@/store/cartSlice";

export default function CartClient() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const isLoading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);

  // On mount, load the cart from /api/cart
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (isLoading) return <p className="p-8">{t("checkout.redirecting")}</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("cart.title")}</h1>
      {items.length ? (
        items.map((item) => (
          <div key={item.id} className="mb-2">
            {item.title} × {item.quantity}
            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="ml-4 text-blue-600 underline"
            >
              {t("cart.reAdd")}
            </button>
          </div>
        ))
      ) : (
        <p>{t("cart.empty")}</p>
      )}
    </div>
  );
}
