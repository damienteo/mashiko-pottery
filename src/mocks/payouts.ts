// src/mocks/payouts.ts
import type { PayoutSummary } from "@/store/payouts/payoutsListSlice";
import type { PayoutDetails } from "@/store/payouts/payoutDetailsSlice";

export const mockPayouts: PayoutSummary[] = [
  { potterId: 1, month: "2025-04", amount: 50000, commissionRate: 0.25 },
  { potterId: 2, month: "2025-04", amount: 75000, commissionRate: 0.3 },
];

export const mockPayoutDetails: Record<string, PayoutDetails> = {
  // Use `${month}|${potterId}` as the key
  "2025-04|1": {
    potterId: 1,
    month: "2025-04",
    amount: 50000,
    commissionRate: 0.25,
  },
  "2025-04|2": {
    potterId: 2,
    month: "2025-04",
    amount: 75000,
    commissionRate: 0.3,
  },
};
