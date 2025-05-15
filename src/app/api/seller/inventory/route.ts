import { NextResponse } from "next/server";
import { mockSellerInventory } from "@/mocks/sellerInventory";

export async function GET() {
  return NextResponse.json(mockSellerInventory);
}
