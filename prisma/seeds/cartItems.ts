import { PrismaClient } from "@prisma/client";

export default async function seedCartItems(prisma: PrismaClient) {
  console.log("🛒 Seeding cart items...");

  const user = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
    orderBy: { id: "desc" },
  });

  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
    take: 2,
  });

  if (!user || products.length < 2) {
    console.error("❌ Cannot seed cart items: missing user or products");
    return;
  }

  await prisma.cartItem.createMany({
    data: [
      { userId: user.id, productId: products[0].id, quantity: 2 },
      { userId: user.id, productId: products[1].id, quantity: 1 },
    ],
  });

  console.log("✅ Seeded cart items");
}
