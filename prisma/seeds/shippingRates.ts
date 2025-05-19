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
        baseFee: 700,
        perKgFee: 100,
        carrier: "Yamato",
      },
      {
        country: "Japan",
        region: "Kansai",
        minWeight: 0,
        maxWeight: 5,
        baseFee: 800,
        perKgFee: 100,
        carrier: "Sagawa",
      },
      {
        country: "Singapore",
        minWeight: 0,
        maxWeight: 5,
        baseFee: 1200,
        perKgFee: 150,
        carrier: "EMS",
      },
      {
        country: "Japan",
        region: "Tohoku",
        minWeight: 0,
        maxWeight: 5,
        baseFee: 850,
        perKgFee: 100,
        carrier: "Japan Post",
        volumeFactor: 5000,
      },
      {
        country: "United States",
        region: "West Coast",
        minWeight: 0,
        maxWeight: 5,
        baseFee: 2000,
        perKgFee: 300,
        carrier: "FedEx",
        volumeFactor: 6000,
      },
      {
        country: "United States",
        region: "East Coast",
        minWeight: 0,
        maxWeight: 5,
        baseFee: 2100,
        perKgFee: 320,
        carrier: "UPS",
        volumeFactor: 6000,
      },
      {
        country: "Australia",
        region: "New South Wales",
        minWeight: 0,
        maxWeight: 5,
        baseFee: 1800,
        perKgFee: 200,
        carrier: "Australia Post",
        volumeFactor: 5000,
      },
      {
        country: "United Kingdom",
        region: "England",
        minWeight: 0,
        maxWeight: 5,
        baseFee: 1900,
        perKgFee: 250,
        carrier: "Royal Mail",
        volumeFactor: 4000,
      },
    ],
  });

  console.log("✅ Seeded shipping rates");
}
