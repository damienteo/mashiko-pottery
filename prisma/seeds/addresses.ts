import { PrismaClient } from "@prisma/client";

export default async function seedAddresses(prisma: PrismaClient) {
  console.log("🏠 Seeding user addresses...");

  await prisma.address.createMany({
    data: [
      {
        userId: 44,
        label: "Home",
        line1: "123 Sakura Street",
        city: "Tokyo",
        state: "Tokyo",
        postal: "100-0001",
        country: "Japan",
        isDefault: true,
      },
      {
        userId: 44,
        label: "Work",
        line1: "456 Ginza Avenue",
        line2: "2F",
        city: "Tokyo",
        state: "Tokyo",
        postal: "104-0061",
        country: "Japan",
        isDefault: false,
      },
    ],
  });

  console.log("✅ Seeded addresses");
}
