import { PrismaClient } from "@prisma/client";

export default async function seedReturnRequests(prisma: PrismaClient) {
  console.log("↩️ Seeding return requests...");

  const item = await prisma.orderItem.findFirst();
  if (!item) {
    console.warn("⚠️ No order item found for return request");
    return;
  }

  await prisma.returnRequest.create({
    data: {
      orderItemId: item.id,
      reason: "Wrong item received",
      status: "processed",
    },
  });

  console.log("✅ Seeded return request");
}
