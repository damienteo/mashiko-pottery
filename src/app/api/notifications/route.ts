import { NextResponse } from "next/server";
import { mockNotifications } from "@/mocks/notifications";

export async function GET() {
  return NextResponse.json(mockNotifications);
}
