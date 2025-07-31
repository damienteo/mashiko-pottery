import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// 
/**
 * This route allows a seller to view a specific payout record.
 * Only the GET method is supported here.
 * Updates or deletes must be done through admin routes.
 */

export async function GET() {
  // request: NextRequest,
  // { params }: { params: Promise<{ id: string }> }
  // const { id } = await params;
  // const user = await assertSellerAccess();

  // // TODO: To be updated
  // const potter = await prisma.potter.findUnique({
  //   where: { userId: user.id.toString() },
  // });

  // if (!potter) {
  //   return NextResponse.json(
  //     { error: "Seller profile not found" },
  //     { status: 404 }
  //   );
  // }

  // const payout = await prisma.payout.findFirst({
  //   where: {
  //     id: Number(id),
  //     potterId: potter.id,
  //   },
  // });

  // if (!payout) {
  return NextResponse.json({ message: "Payout not found" }, { status: 404 });
  // }

  // return NextResponse.json(payout);
}
