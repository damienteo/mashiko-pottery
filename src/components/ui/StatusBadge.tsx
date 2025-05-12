"use client";

import React from "react";
import type { OrderStatus } from "@/constants/orderStatus";
import { statusBadgeClasses } from "@/constants/orderStatus";

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Determine CSS classes for the badge
  const classes = statusBadgeClasses[status] ?? "bg-gray-100 text-gray-800";
  // Capitalize the first letter of the status label
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[6rem] px-2 py-0.5 rounded-full ${classes}`}
    >
      {label}
    </span>
  );
}
