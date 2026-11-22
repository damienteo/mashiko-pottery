import { NextResponse } from 'next/server'
// import { prisma } from "@/lib/prisma";

//
export async function GET() {
  // const user = await assertSellerAccess();

  // // TODO: To be updated
  // const potter = await prisma.potter.findUnique({
  //   where: { userId: user.id.toString() },
  // });

  // if (!potter) {
  return NextResponse.json(
    { error: 'Seller profile not found' },
    { status: 404 }
  )
  // }

  // const products = await prisma.product.findMany({
  //   where: { potterId: potter.id },
  //   orderBy: { createdAt: "desc" },
  // });

  // return NextResponse.json(products);
}
