import type { PayoutStatus } from "@/constants/payoutStatus";

export interface Payout {
  id: string;
  potterId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  createdAt: string; // ISO string
  paidAt?: string; // optional ISO string
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
}

export interface PayoutSummary {
  id: string;
  potterId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  month: string;
}

// 2. Used in /api/seller/payouts/[id] (detailed view)
export interface PayoutDetails extends Payout {
  month: string;
  breakdown?: {
    totalOrders: number;
    totalFees: number;
    notes?: string;
  };
}
