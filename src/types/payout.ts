import type { PayoutStatus } from "@/constants/payoutStatus";

export interface Payout {
  id: string;
  potterId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  createdAt?: string; // ISO string
  updatedAt?: string;
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
  paidAt?: string; // optional ISO string
}

export interface PayoutDetails extends Payout {
  month: string;
  breakdown?: {
    totalOrders: number;
    totalFees: number;
    notes?: string;
  };
}
