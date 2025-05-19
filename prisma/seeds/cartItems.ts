import { PrismaClient } from "@prisma/client";

export default async function seedCartItems(prisma: PrismaClient) {
  console.log("🛒 Seeding cart items...");

  await prisma.cartItem.createMany({
    data: [
      { userId: 44, productId: 1, quantity: 2 },
      { userId: 44, productId: 2, quantity: 1 },
    ],
  });

  console.log("✅ Seeded cart items");
}
