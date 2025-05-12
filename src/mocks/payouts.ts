// src/mocks/payouts.ts
import type { PayoutSummary } from "@/store/payouts/payoutsListSlice";
import type { PayoutDetails } from "@/store/payouts/payoutDetailsSlice";

export const mockPayouts: PayoutSummary[] = [
  {
    potterId: 1,
    month: "2025-04",
    amount: 50000,
    commissionRate: 0.25,
    status: "processed",
  },
  {
    potterId: 2,
    month: "2025-04",
    amount: 75000,
    commissionRate: 0.3,
    status: "pending",
  },
  {
    potterId: 3,
    month: "2025-05",
    amount: 62000,
    commissionRate: 0.2,
    status: "failed",
  },
  {
    potterId: 1,
    month: "2025-05",
    amount: 54000,
    commissionRate: 0.25,
    status: "processed",
  },
  {
    potterId: 4,
    month: "2025-06",
    amount: 88000,
    commissionRate: 0.15,
    status: "pending",
  },
];

export const mockPayoutDetails: Record<string, PayoutDetails> = {
  // Use `${month}|${potterId}` as the key
  "2025-04|1": {
    potterId: 1,
    month: "2025-04",
    amount: 50000,
    commissionRate: 0.25,
    status: "processed",
  },
  "2025-04|2": {
    potterId: 2,
    month: "2025-04",
    amount: 75000,
    commissionRate: 0.3,
    status: "pending",
  },
  "2025-05|3": {
    potterId: 3,
    month: "2025-05",
    amount: 62000,
    commissionRate: 0.2,
    status: "failed",
  },
  "2025-05|1": {
    potterId: 1,
    month: "2025-05",
    amount: 54000,
    commissionRate: 0.25,
    status: "processed",
  },
  "2025-06|4": {
    potterId: 4,
    month: "2025-06",
    amount: 88000,
    commissionRate: 0.15,
    status: "pending",
  },
};
