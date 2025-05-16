"use client";

import React from "react";
import type { OrderStatus } from "@/constants/orderStatus";
import { statusBadgeClasses } from "@/constants/orderStatus";
import type { PayoutStatus } from "@/constants/payoutStatus";
import { payoutStatusBadgeClasses } from "@/constants/payoutStatus";

/** Status types for orders or payouts */
export type StatusType = OrderStatus | PayoutStatus;

// Merge order and payout status classes into one map
const allStatusBadgeClasses: Record<StatusType, string> = {
  ...statusBadgeClasses,
  ...payoutStatusBadgeClasses,
};

export default function StatusBadge({ status }: { status: string }) {
  const isKnownStatus = status in allStatusBadgeClasses;
  const classes = isKnownStatus
    ? allStatusBadgeClasses[status as StatusType]
    : "bg-gray-100 text-gray-800";
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[6rem] px-2 py-0.5 rounded-full ${classes}`}
    >
      {label}
    </span>
  );
}
