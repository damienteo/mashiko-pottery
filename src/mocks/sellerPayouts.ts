import { Payout } from "@/types/payout";

export const mockSellerPayouts: Payout[] = Array.from(
  { length: 30 },
  (_, i) => {
    const isPaid = i % 4 !== 0;
    const statuses: Payout["status"][] = isPaid
      ? ["paid"]
      : ["pending", "processing", "failed"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - i * 86400000).toISOString();
    const paidAt =
      status === "paid"
        ? new Date(Date.now() - i * 43200000).toISOString()
        : undefined;

    return {
      id: `po_${1000 + i}`,
      potterId: `potter_${(i % 6) + 1}`,
      amount: Math.floor(Math.random() * 50000) + 5000,
      currency: "JPY",
      status,
      createdAt,
      paidAt,
    };
  }
);
