import type { CartItem } from "@/store/cartSlice";

export interface Order {
  id: string;
  items: CartItem[];
}

// A fixed list of mock orders for GET /api/orders
export const mockOrders: Order[] = [
  {
    id: "order-1",
    items: [{ id: 1, title: "Handmade Mug", price: 2500, quantity: 2 }],
  },
  {
    id: "order-2",
    items: [
      { id: 2, title: "Ceramic Bowl", price: 3200, quantity: 1 },
      { id: 3, title: "Decorative Plate", price: 1500, quantity: 3 },
    ],
  },
];

export const mockOrder = (items: CartItem[]): Order => ({
  id: `order-${Date.now()}`,
  items,
});
