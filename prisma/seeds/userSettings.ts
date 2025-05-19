import { PrismaClient } from "@prisma/client";

export default async function seedUserSettings(prisma: PrismaClient) {
  console.log("⚙️ Seeding user settings...");

  await prisma.userSettings.create({
    data: {
      userId: 44,
      preferredLang: "en",
      receiveEmails: true,
      receiveSMS: false,
    },
  });

  console.log("✅ Seeded user settings");
}
