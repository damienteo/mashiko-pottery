// src/constants/orderStatus.ts

/** All possible order status values */
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed"
  | "returned"
  | "refunded";

/** List of status options for dropdowns */
export const orderStatusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
  "returned",
  "refunded",
];

/**
 * Map each status to its corresponding badge CSS classes.
 * These classes are Tailwind-style and
 * apply background and text colors.
 */
export const statusBadgeClasses: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  delivered: "bg-green-200 text-green-900",
  cancelled: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  returned: "bg-orange-100 text-orange-800",
  refunded: "bg-purple-100 text-purple-800",
};
