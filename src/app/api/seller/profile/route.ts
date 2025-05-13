import { NextResponse } from "next/server";
import { mockSellerProfile } from "@/mocks/sellerProfile";

/**
 * GET /api/seller/profile
 * Returns the current seller profile from mock data.
 */
export async function GET() {
  return NextResponse.json(mockSellerProfile);
}
