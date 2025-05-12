// src/constants/orderStatus.ts

/** All possible order status values */
export type OrderStatus =
  | "processing"
  | "shipped"
  | "cancelled"
  | "failed"
  | "pending";

/** List of status options for dropdowns */
export const orderStatusOptions: OrderStatus[] = [
  "processing",
  "shipped",
  "cancelled",
  "failed",
  "pending",
];

/**
 * Map each status to its corresponding badge CSS classes.
 * These classes are Tailwind-style and
 * apply background and text colors.
 */
export const statusBadgeClasses: Record<OrderStatus, string> = {
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};
