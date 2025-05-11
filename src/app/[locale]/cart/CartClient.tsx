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
} from "@/store/cartSlice";
import { addToCart } from "@/store/cartSlice";
import { selectCartTotal, selectCartCount } from "@/store/cartSlice";

export default function CartClient() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const isLoading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);

  // On mount, load the cart from /api/cart
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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
                <span>
                  {t("cart.quantity")}: {item.quantity}
                </span>
                <span>
                  {t("cart.lineTotal")}: ¥
                  {(item.price * item.quantity).toLocaleString()}
                </span>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() =>
                      dispatch(
                        addToCart({
                          id: item.id,
                          title: item.title,
                          price: item.price,
                          quantity: 1,
                          image: item.image,
                        })
                      )
                    }
                    className="text-green-600 hover:underline"
                  >
                    {t("cart.reAdd")}
                  </button>
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
        </>
      ) : (
        <p>{t("cart.empty")}</p>
      )}
    </div>
  );
}
