import { NextResponse } from "next/server";
import { mockSettings } from "@/mocks/settings";

export async function GET() {
  return NextResponse.json(mockSettings);
}
