import{ PrismaClient } from "@prisma/client";

export default async function seedAddresses(prisma: PrismaClient) {
  console.log("🏠 Seeding user addresses...");

  const customer = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
    orderBy: { id: "desc" },
  });
  if (!customer) {
    console.error("❌ No customer found for address seeding.");
    return;
  }

  await prisma.address.createMany({
    data: [
      {
        userId: customer.id,
        label: "Home",
        line1: "123 Sakura Street",
        city: "Tokyo",
        state: "Tokyo",
        postal: "100-0001",
        country: "Japan",
        isDefault: true,
      },
      {
        userId: customer.id,
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
