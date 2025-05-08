// src/store/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import uiReducer from "./uiSlice";
import productsReducer from "./productsSlice";
import pottersReducer from "./pottersSlice";
import settingsReducer from "./settingsSlice";
import notificationReducer from "./notificationSlice";

// If you still want localStorage cart persistence:
function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("mashiko-cart") || "[]");
  } catch {
    return [];
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    products: productsReducer,
    potters: pottersReducer,
    settings: settingsReducer,
    notifications: notificationReducer,
  },
  preloadedState: {
    cart: { items: loadCart() },
  },
});

store.subscribe(() => {
  const { cart } = store.getState();
  localStorage.setItem("mashiko-cart", JSON.stringify(cart.items));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
