import { PrismaClient } from "@prisma/client";

export default async function seedReviews(prisma: PrismaClient) {
  console.log("🌟 Seeding reviews and favorites...");

  const reviewer = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
    orderBy: { id: "desc" },
  });
  if (!reviewer) {
    console.error("❌ No customer found for review seeding.");
    return;
  }
  const reviewerId = reviewer.id;
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
    take: 2,
  });
  if (products.length < 2) {
    console.error("❌ Not enough products found for review seeding.");
    return;
  }
  const product1Id = products[0].id;
  const product2Id = products[1].id;

  await prisma.review.createMany({
    data: [
      {
        reviewerId,
        productId: product1Id,
        rating: 5,
        comment: "Absolutely stunning craftsmanship. A true masterpiece.",
      },
      {
        reviewerId,
        productId: product2Id,
        rating: 4,
        comment: "Very elegant. Would buy again.",
      },
    ],
  });

  await prisma.favorite.createMany({
    data: [
      {
        userId: reviewerId,
        productId: product1Id,
      },
      {
        userId: reviewerId,
        productId: product2Id,
      },
    ],
  });

  console.log("✅ Seeded reviews and favorites");
}
