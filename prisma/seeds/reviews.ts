import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedReviews() {
  console.log("🌟 Seeding reviews and favorites...");

  const reviewerId = 44; // last seeded customer user
  const product1Id = 1;
  const product2Id = 2;

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
