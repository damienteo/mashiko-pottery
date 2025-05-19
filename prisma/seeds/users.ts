import { PrismaClient, Role } from "@prisma/client";

export default async function seedUsers(prisma: PrismaClient) {
  const count = await prisma.user.count();
  if (count > 0) return;

  await prisma.user.createMany({
    data: [
      {
        email: "admin1@example.com",
        password: "hashedpassword_admin_1",
        role: Role.ADMIN,
      },
      {
        email: "admin2@example.com",
        password: "hashedpassword_admin_2",
        role: Role.ADMIN,
      },
      {
        email: "admin3@example.com",
        password: "hashedpassword_admin_3",
        role: Role.ADMIN,
      },
      {
        email: "admin4@example.com",
        password: "hashedpassword_admin_4",
        role: Role.ADMIN,
      },
      {
        email: "admin5@example.com",
        password: "hashedpassword_admin_5",
        role: Role.ADMIN,
      },

      {
        email: "ops1@example.com",
        password: "hashedpassword_ops_1",
        role: Role.OPERATIONS,
      },
      {
        email: "ops2@example.com",
        password: "hashedpassword_ops_2",
        role: Role.OPERATIONS,
      },
      {
        email: "ops3@example.com",
        password: "hashedpassword_ops_3",
        role: Role.OPERATIONS,
      },
      {
        email: "ops4@example.com",
        password: "hashedpassword_ops_4",
        role: Role.OPERATIONS,
      },
      {
        email: "ops5@example.com",
        password: "hashedpassword_ops_5",
        role: Role.OPERATIONS,
      },

      {
        email: "seller1@example.com",
        password: "hashedpassword_seller_1",
        role: Role.SELLER,
      },
      {
        email: "seller2@example.com",
        password: "hashedpassword_seller_2",
        role: Role.SELLER,
      },
      {
        email: "seller3@example.com",
        password: "hashedpassword_seller_3",
        role: Role.SELLER,
      },
      {
        email: "seller4@example.com",
        password: "hashedpassword_seller_4",
        role: Role.SELLER,
      },
      {
        email: "seller5@example.com",
        password: "hashedpassword_seller_5",
        role: Role.SELLER,
      },
      {
        email: "seller6@example.com",
        password: "hashedpassword_seller_6",
        role: Role.SELLER,
      },
      {
        email: "seller7@example.com",
        password: "hashedpassword_seller_7",
        role: Role.SELLER,
      },
      {
        email: "seller8@example.com",
        password: "hashedpassword_seller_8",
        role: Role.SELLER,
      },
      {
        email: "seller9@example.com",
        password: "hashedpassword_seller_9",
        role: Role.SELLER,
      },
      {
        email: "seller10@example.com",
        password: "hashedpassword_seller_10",
        role: Role.SELLER,
      },

      {
        email: "customer1@example.com",
        password: "hashedpassword_customer_1",
        role: Role.CUSTOMER,
      },
      {
        email: "customer2@example.com",
        password: "hashedpassword_customer_2",
        role: Role.CUSTOMER,
      },
      {
        email: "customer3@example.com",
        password: "hashedpassword_customer_3",
        role: Role.CUSTOMER,
      },
      {
        email: "customer4@example.com",
        password: "hashedpassword_customer_4",
        role: Role.CUSTOMER,
      },
      {
        email: "customer5@example.com",
        password: "hashedpassword_customer_5",
        role: Role.CUSTOMER,
      },
      {
        email: "customer6@example.com",
        password: "hashedpassword_customer_6",
        role: Role.CUSTOMER,
      },
      {
        email: "customer7@example.com",
        password: "hashedpassword_customer_7",
        role: Role.CUSTOMER,
      },
      {
        email: "customer8@example.com",
        password: "hashedpassword_customer_8",
        role: Role.CUSTOMER,
      },
      {
        email: "customer9@example.com",
        password: "hashedpassword_customer_9",
        role: Role.CUSTOMER,
      },
      {
        email: "customer10@example.com",
        password: "hashedpassword_customer_10",
        role: Role.CUSTOMER,
      },
      {
        email: "customer11@example.com",
        password: "hashedpassword_customer_11",
        role: Role.CUSTOMER,
      },
      {
        email: "customer12@example.com",
        password: "hashedpassword_customer_12",
        role: Role.CUSTOMER,
      },
      {
        email: "customer13@example.com",
        password: "hashedpassword_customer_13",
        role: Role.CUSTOMER,
      },
      {
        email: "customer14@example.com",
        password: "hashedpassword_customer_14",
        role: Role.CUSTOMER,
      },
      {
        email: "customer15@example.com",
        password: "hashedpassword_customer_15",
        role: Role.CUSTOMER,
      },
      {
        email: "customer16@example.com",
        password: "hashedpassword_customer_16",
        role: Role.CUSTOMER,
      },
      {
        email: "customer17@example.com",
        password: "hashedpassword_customer_17",
        role: Role.CUSTOMER,
      },
      {
        email: "customer18@example.com",
        password: "hashedpassword_customer_18",
        role: Role.CUSTOMER,
      },
      {
        email: "customer19@example.com",
        password: "hashedpassword_customer_19",
        role: Role.CUSTOMER,
      },
      {
        email: "customer20@example.com",
        password: "hashedpassword_customer_20",
        role: Role.CUSTOMER,
      },
      {
        email: "customer21@example.com",
        password: "hashedpassword_customer_21",
        role: Role.CUSTOMER,
      },
      {
        email: "customer22@example.com",
        password: "hashedpassword_customer_22",
        role: Role.CUSTOMER,
      },
      {
        email: "customer23@example.com",
        password: "hashedpassword_customer_23",
        role: Role.CUSTOMER,
      },
      {
        email: "customer24@example.com",
        password: "hashedpassword_customer_24",
        role: Role.CUSTOMER,
      },
      {
        email: "customer25@example.com",
        password: "hashedpassword_customer_25",
        role: Role.CUSTOMER,
      },
    ],
  });

  console.log("✅ Seeded users");
}
