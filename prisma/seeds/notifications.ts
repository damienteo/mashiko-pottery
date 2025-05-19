import { PrismaClient } from "@prisma/client";

export default async function seedNotifications(prisma: PrismaClient) {
  console.log("🔔 Seeding notifications...");

  const user = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
    orderBy: { id: "desc" },
  });
  if (!user) {
    console.error("❌ No customer found for notification seeding.");
    return;
  }

  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        message: "Your order has been shipped.",
        read: false,
      },
      {
        userId: user.id,
        message: "New product added from your favorite potter.",
        read: false,
      },
    ],
  });

  console.log("✅ Seeded notifications");
}
