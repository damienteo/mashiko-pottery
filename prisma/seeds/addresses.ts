import { PrismaClient } from "@prisma/client";

export default async function seedShippingRates(prisma: PrismaClient) {
  console.log("🚚 Seeding shipping rates...");

  await prisma.shippingRate.createMany({
    data: [
      {
        country: "Japan",
        region: "Kanto",
        minWeight: 0,
        maxWeight: 5,
        price: 800,
        carrier: "Yamato",
      },
      {
        country: "Japan",
        region: "Kansai",
        minWeight: 0,
        maxWeight: 5,
        price: 900,
        carrier: "Sagawa",
      },
      {
        country: "Singapore",
        minWeight: 0,
        maxWeight: 5,
        price: 1500,
        carrier: "EMS",
      },
    ],
  });

  console.log("✅ Seeded shipping rates");
}
