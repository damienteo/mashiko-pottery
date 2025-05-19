import { PrismaClient, Role } from "@prisma/client";

export default async function seedUsers(prisma: PrismaClient) {
  const count = await prisma.user.count();
  if (count > 0) return;

  await prisma.user.createMany({
    data: [
      {
        email: "admin@mashiko.jp",
        password: "hashedpassword1",
        role: Role.ADMIN,
      },
      {
        email: "seller@mashiko.jp",
        password: "hashedpassword2",
        role: Role.SELLER,
      },
      {
        email: "customer@mashiko.jp",
        password: "hashedpassword3",
        role: Role.CUSTOMER,
      },
    ],
  });

  console.log("✅ Seeded users");
}
