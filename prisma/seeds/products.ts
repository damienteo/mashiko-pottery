import { PrismaClient } from "@prisma/client";

export default async function seedProducts(prisma: PrismaClient) {
  const potters = await prisma.potter.findMany();
  if (potters.length === 0) return;

  const count = await prisma.product.count();
  if (count > 0) return;

  await prisma.product.createMany({
    data: [
      {
        potterId: potters[0].id,
        title: "Sake Cup",
        description: "Handcrafted traditional sake cup.",
        price: 2500,
        stock: 20,
        weight: 0.2,
        photos: ["/pottery/sake-cup.png"],
        category: "Tableware",
      },
      {
        potterId: potters[0].id,
        title: "Tea Bowl",
        description: "Rustic tea bowl with earthy glaze.",
        price: 4000,
        stock: 15,
        weight: 0.5,
        photos: ["/pottery/tea-bowl.png"],
        category: "Tea Ceremony",
      },
    ],
  });

  console.log("✅ Seeded products");
}
