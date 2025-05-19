import { PrismaClient } from "@prisma/client";
import seedUsers from "./seeds/users";
import seedPotters from "./seeds/potters";
import seedProducts from "./seeds/products";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");
  await seedUsers(prisma);
  await seedPotters(prisma);
  await seedProducts(prisma);
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
