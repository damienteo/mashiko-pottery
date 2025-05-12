import type { CartItem } from "@/store/cartSlice";
import type { OrderSummary } from "@/store/orders/ordersListSlice";

// A fixed list of mock orders for GET /api/orders
export const mockOrders: OrderSummary[] = [
  {
    id: "order-1",
    customerName: "Alice Tanaka",
    total: 5000,
    date: "2025-05-01T10:15:00Z",
    status: "processing",
    items: [
      {
        id: 1,
        title: "Handmade Mug",
        price: 2500,
        quantity: 2,
        image: "/pottery/mug1.png",
      },
    ],
  },
  {
    id: "order-2",
    customerName: "Bob Li",
    total: 8200,
    date: "2025-05-02T14:30:00Z",
    status: "shipped",
    items: [
      {
        id: 2,
        title: "Ceramic Bowl",
        price: 3200,
        quantity: 1,
        image: "/pottery/bowl1.png",
      },
      {
        id: 3,
        title: "Decorative Plate",
        price: 1500,
        quantity: 3,
        image: "/pottery/plate1.png",
      },
    ],
  },
  {
    id: "order-3",
    customerName: "Chen Wei",
    total: 11400,
    date: "2025-05-03T09:45:00Z",
    status: "cancelled",
    items: [
      {
        id: 4,
        title: "Test Bowl",
        price: 2500,
        quantity: 2,
        image: "/pottery/bowl2.png",
      },
      {
        id: 5,
        title: "Demo Plate",
        price: 3000,
        quantity: 2,
        image: "/pottery/plate2.png",
      },
      {
        id: 6,
        title: "Sample Mug",
        price: 1800,
        quantity: 1,
        image: "/pottery/mug2.png",
      },
    ],
  },
  {
    id: "order-4",
    customerName: "Emi Nakamura",
    total: 6200,
    date: "2025-05-04T16:20:00Z",
    status: "pending",
    items: [
      {
        id: 9,
        title: "Large Planter",
        price: 6200,
        quantity: 1,
        image: "/pottery/planter1.png",
      },
    ],
  },
  {
    id: "order-5",
    customerName: "Liang Zhao",
    total: 7600,
    date: "2025-05-05T11:10:00Z",
    status: "failed",
    items: [
      {
        id: 7,
        title: "Artisan Pitcher",
        price: 5500,
        quantity: 1,
        image: "/pottery/pitcher1.png",
      },
      {
        id: 8,
        title: "Mini Vase",
        price: 2200,
        quantity: 1,
        image: "/pottery/vase1.png",
      },
    ],
  },
];

export const mockOrder = (items: CartItem[]): OrderSummary => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return {
    id: `order-${Date.now()}`,
    customerName: "Guest",
    total,
    date: new Date().toISOString(),
    status: "pending",
    items,
  };
};
