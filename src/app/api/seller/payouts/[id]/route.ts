import { NextResponse, NextRequest } from "next/server";
import { mockSellerPayouts } from "@/mocks/sellerPayouts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const payout = mockSellerPayouts.find((p) => p.id === id);

  if (!payout) {
    return NextResponse.json({ message: "Payout not found" }, { status: 404 });
  }
  return NextResponse.json(payout);
}
