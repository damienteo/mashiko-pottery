export interface Payout {
  id: string;
  potterId: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "paid" | "failed";
  createdAt: string; // ISO string
  paidAt?: string; // optional ISO string
}
