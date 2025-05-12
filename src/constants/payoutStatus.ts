/** All possible payout status values */
export type PayoutStatus = "pending" | "processed" | "failed";

/** List of status options for dropdowns or filters */
export const payoutStatusOptions: PayoutStatus[] = [
  "pending",
  "processed",
  "failed",
];

/**
 * Map each payout status to its corresponding badge CSS classes.
 * These Tailwind classes apply background and text colors.
 */
export const payoutStatusBadgeClasses: Record<PayoutStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};
