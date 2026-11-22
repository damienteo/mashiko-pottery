// src/constants/orderStatus.ts

/** All possible order status values */
export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Failed'
  | 'Returned'
  | 'Refunded'

/** List of status options for dropdowns */
export const orderStatusOptions: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Failed',
  'Returned',
  'Refunded',
]

/**
 * Map each status to its corresponding badge CSS classes.
 * These classes are Tailwind-style and
 * apply background and text colors.
 */
export const statusBadgeClasses: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-green-100 text-green-800',
  Delivered: 'bg-green-200 text-green-900',
  Cancelled: 'bg-red-100 text-red-800',
  Failed: 'bg-red-100 text-red-800',
  Returned: 'bg-orange-100 text-orange-800',
  Refunded: 'bg-purple-100 text-purple-800',
}
