import type { CartItem } from "@/store/cartSlice";

export interface Order {
  id: string;
  items: CartItem[];
}

export const mockOrder = (items: CartItem[]): Order => ({
  id: `order-${Date.now()}`,
  items,
});
