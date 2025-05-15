import { NextResponse } from "next/server";
import { mockSellerPayouts } from "@/mocks/sellerPayouts";

export async function GET() {
  return NextResponse.json(mockSellerPayouts);
}
