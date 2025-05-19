import { PrismaClient } from "@prisma/client";
import seedUsers from "./seeds/users";
import seedPotters from "./seeds/potters";
import seedProducts from "./seeds/products";
import seedOrders from "./seeds/orders";
import seedReviews from "./seeds/reviews";
import seedInvoicesAndRefunds from "./seeds/refunds";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");
  await seedUsers(prisma);
  await seedPotters(prisma);
  await seedProducts(prisma);
  await seedOrders(prisma);
  await seedReviews(prisma);
  await seedInvoicesAndRefunds(prisma);
  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
