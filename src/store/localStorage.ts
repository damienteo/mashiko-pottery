import { RootState } from "./store";

const CART_KEY = "mashiko:cart";

export function saveCartToStorage(state: RootState) {
  try {
    const serialized = JSON.stringify(state.cart.items);
    localStorage.setItem(CART_KEY, serialized);
  } catch {
    // ignore write errors
  }
}

export function loadCartFromStorage() {
  try {
    const serialized = localStorage.getItem(CART_KEY);
    if (!serialized) return [];
    return JSON.parse(serialized);
  } catch {
    return [];
  }
}
