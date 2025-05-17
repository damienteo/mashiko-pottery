export type PayoutStatus =
  | "queued"
  | "processing"
  | "paid"
  | "failed"
  | "on_hold"
  | "cancelled"
  | "refunded";

export const payoutStatusOptions: PayoutStatus[] = [
  "queued",
  "processing",
  "paid",
  "failed",
  "on_hold",
  "cancelled",
  "refunded",
];

export const payoutStatusBadgeClasses: Record<PayoutStatus, string> = {
  queued: "bg-gray-100 text-gray-800",
  processing: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  on_hold: "bg-orange-100 text-orange-800",
  cancelled: "bg-gray-200 text-gray-700",
  refunded: "bg-blue-100 text-blue-800",
};
