import { PrismaClient } from "@prisma/client";

export default async function seedPotters(prisma: PrismaClient) {
  const users = await prisma.user.findMany({ where: { role: "SELLER" } });
  if (users.length === 0) return;

  const count = await prisma.potter.count();
  if (count > 0) return;

  await prisma.potter.createMany({
    data: users.map((user, i) => ({
      userId: user.id,
      name: { en: "Potter " + (i + 1), ja: "陶芸家" + (i + 1) },
      bio: { en: "Master potter number " + (i + 1), ja: "名人" + (i + 1) },
      style: "Traditional",
    })),
  });

  console.log("✅ Seeded potters");
}
