import { PrismaClient } from "@prisma/client";

export default async function seedInvoicesAndRefunds(prisma: PrismaClient) {
  const order = await prisma.order.findFirst({ include: { items: true } });

  if (!order || order.items.length === 0) return;

  await prisma.invoice.create({
    data: {
      orderId: order.id,
      fileUrl: "/invoices/invoice-1.pdf",
      issuedAt: new Date(),
    },
  });

  await prisma.refundTransaction.create({
    data: {
      orderId: order.id,
      amount: order.total * 0.5,
      reason: "Customer request",
      status: "processed",
    },
  });

  console.log("💰 Seeded invoice and refund transaction");
}
