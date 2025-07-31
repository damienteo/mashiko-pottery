import { prisma } from "@/lib/prisma";
import seedUsers from "./seeds/users";
import seedPotters from "./seeds/potters";
import seedProducts from "./seeds/products";
import seedOrders from "./seeds/orders";
import seedReviews from "./seeds/reviews";
import seedInvoicesAndRefunds from "./seeds/refunds";
import seedAddresses from "./seeds/addresses";
import seedShippingRates from "./seeds/shippingRates";
import seedPromoCodes from "./seeds/promoCodes";
import seedCartItems from "./seeds/cartItems";
import seedUserSettings from "./seeds/userSettings";
import seedNotifications from "./seeds/notifications";
import seedReturnRequests from "./seeds/returnRequests";
import seedPayouts from "./seeds/payouts";


async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Do not run seed.ts in production.");
    process.exit(1);
  }
  // Truncate tables in reverse dependency order to avoid foreign key conflicts
  console.log("🧹 Cleaning up existing data...");

  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.refundTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.potter.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.address.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.shippingRate.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Starting database seeding...");
  await seedUsers(prisma);
  await seedPotters(prisma);
  await seedProducts(prisma);
  await seedOrders(prisma);
  await seedReviews(prisma);
  await seedInvoicesAndRefunds(prisma);
  await seedAddresses(prisma);
  await seedShippingRates(prisma);
  await seedPromoCodes(prisma);
  await seedCartItems(prisma);
  await seedUserSettings(prisma);
  await seedNotifications(prisma);
  await seedReturnRequests(prisma);
  await seedPayouts(prisma);
  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
