// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("mashiko-cart") || "[]");
  } catch {
    return [];
  }
}

export const store = configureStore({
  reducer: { cart: cartReducer },
  preloadedState: { cart: { items: loadCart() } },
});

store.subscribe(() => {
  const { cart } = store.getState();
  localStorage.setItem("mashiko-cart", JSON.stringify(cart.items));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
