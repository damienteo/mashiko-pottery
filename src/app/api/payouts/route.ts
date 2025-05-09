// src/app/api/payouts/route.ts
import { NextResponse } from "next/server";
import { mockPayouts } from "@/mocks/payouts";

export async function GET() {
  // Return the list of payout summaries
  return NextResponse.json(mockPayouts);
}
