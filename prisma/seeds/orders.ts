import { PrismaClient } from "@prisma/client";

export default async function seedOrders(prisma: PrismaClient) {
  const user = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
  const products = await prisma.product.findMany({ take: 2 });

  if (!user || products.length === 0) return;

  await prisma.order.create({
    data: {
      userId: user.id,
      status: "Processing",
      total: products.reduce((sum, p) => sum + p.price, 0),
      address: "123 Pottery Lane, Mashiko, Japan",
      items: {
        create: products.map((product) => ({
          productId: product.id,
          quantity: 1,
          price: product.price,
        })),
      },
    },
    include: { items: true },
  });

  console.log("📦 Seeded 1 order with items");
}
