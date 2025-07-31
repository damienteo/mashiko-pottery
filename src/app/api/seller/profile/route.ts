import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// 
/**
 * GET /api/seller/profile
 * Returns the current seller's potter profile from the database.
 */
export async function GET() {
  // const user = await assertSellerAccess();
  // // TODO: To be updated
  // const potter = await prisma.potter.findUnique({
  //   where: { userId: user.id.toString() },
  // });

  // if (!potter) {
  return NextResponse.json(
    { error: "Seller profile not found" },
    { status: 404 }
  );
  //   }

  //   return NextResponse.json(potter);
  // }
  // // TODO: To be updated
  // export async function PATCH(req: Request) {
  //   const user = await assertSellerAccess();

  //   const potter = await prisma.potter.findUnique({
  //     where: { userId: user.id.toString() },
  //   });

  //   if (!potter) {
  //     return NextResponse.json(
  //       { error: "Seller profile not found" },
  //       { status: 404 }
  //     );
  //   }

  //   const data = await req.json();

  //   try {
  //     const updated = await prisma.potter.update({
  //       where: { id: potter.id },
  //       data,
  //     });

  //     return NextResponse.json(updated);
  //   } catch (error) {
  //     console.error("Error updating seller profile:", error);
  //     return NextResponse.json(
  //       { error: "Failed to update seller profile" },
  //       { status: 500 }
  //     );
  //   }
}
