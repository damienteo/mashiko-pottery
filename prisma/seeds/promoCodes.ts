import { PrismaClient } from "@prisma/client";

export default async function seedPromoCodes(prisma: PrismaClient) {
  console.log("🏷️ Seeding promo codes...");

  await prisma.promoCode.createMany({
    data: [
      {
        code: "WELCOME10",
        discount: 10,
        isPercent: true,
        usageLimit: 100,
        startsAt: new Date(),
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        active: true,
      },
      {
        code: "FREESHIP",
        discount: 800,
        isPercent: false,
        usageLimit: 50,
        startsAt: new Date(),
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        active: true,
      },
    ],
  });

  console.log("✅ Seeded promo codes");
}
