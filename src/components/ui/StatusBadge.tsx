"use client";

import React from "react";
import type { OrderStatus } from "@/constants/orderStatus";
import { statusBadgeClasses } from "@/constants/orderStatus";
import type { PayoutStatus } from "@/constants/payoutStatus";
import { payoutStatusBadgeClasses } from "@/constants/payoutStatus";
import { useTranslations } from "next-intl";

export type StatusType = OrderStatus | PayoutStatus;

export default function StatusBadge({
  status,
  type,
}: {
  status: string;
  type: "order" | "payout";
}) {
  const t = useTranslations();
  const badgeClasses =
    type === "order" ? statusBadgeClasses : payoutStatusBadgeClasses;
  const normalizedStatus = Object.keys(badgeClasses).find(
    (key) => key.toLowerCase() === status.toLowerCase()
  );
  const classes = normalizedStatus
    ? badgeClasses[normalizedStatus as keyof typeof badgeClasses]
    : "bg-gray-100 text-gray-800";
  const label = t(`status.${status.toLowerCase()}`, {
    default: status.charAt(0).toUpperCase() + status.slice(1),
  });

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[6rem] px-2 py-0.5 rounded-full ${classes}`}
    >
      {label}
    </span>
  );
}
