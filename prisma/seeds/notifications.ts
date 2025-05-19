import { PrismaClient } from "@prisma/client";

export default async function seedNotifications(prisma: PrismaClient) {
  console.log("🔔 Seeding notifications...");

  await prisma.notification.createMany({
    data: [
      {
        userId: 44,
        message: "Your order has been shipped.",
        read: false,
      },
      {
        userId: 44,
        message: "New product added from your favorite potter.",
        read: false,
      },
    ],
  });

  console.log("✅ Seeded notifications");
}
