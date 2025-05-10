import { NextResponse, NextRequest } from "next/server";
import { mockPayoutDetails } from "@/mocks/payouts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payout = mockPayoutDetails[id];
  if (!payout) {
    return NextResponse.json({ message: "Payout not found" }, { status: 404 });
  }
  return NextResponse.json(payout);
}
