import { PrismaClient } from "@prisma/client";

export default async function seedPayouts(prisma: PrismaClient) {
  console.log("💵 Seeding payouts...");

  const potter = await prisma.potter.findFirst();
  if (!potter) {
    console.warn("⚠️ No potter found for payout");
    return;
  }

  await prisma.payout.create({
    data: {
      potterId: potter.id,
      month: "2025-05",
      status: "PAID",
      grossAmount: 10000,
      commissionRate: 0.1,
      commissionAmt: 1000,
      netAmount: 9000,
      currency: "JPY",
      paidAt: new Date(),
    },
  });

  console.log("✅ Seeded payout");
}
