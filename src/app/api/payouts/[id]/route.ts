// src/app/api/payouts/[id]/route.ts
import { NextResponse } from "next/server";
import { mockPayoutDetails } from "@/mocks/payouts";

export async function GET({ params }: { params: { id: string } }) {
  const payout = mockPayoutDetails[params.id];
  if (!payout) {
    return NextResponse.json({ message: "Payout not found" }, { status: 404 });
  }
  return NextResponse.json(payout);
}
