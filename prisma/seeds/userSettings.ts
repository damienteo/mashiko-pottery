import { PrismaClient } from "@prisma/client";

export default async function seedUserSettings(prisma: PrismaClient) {
  console.log("⚙️ Seeding user settings...");

  const user = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
    orderBy: { id: "desc" },
  });
  if (!user) {
    console.error("❌ No customer found for user settings seeding.");
    return;
  }

  await prisma.userSettings.create({
    data: {
      userId: user.id,
      preferredLang: "en",
      receiveEmails: true,
      receiveSMS: false,
    },
  });

  console.log("✅ Seeded user settings");
}
