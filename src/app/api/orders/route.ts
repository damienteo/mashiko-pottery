import { NextResponse } from "next/server";
import { mockOrder } from "@/mocks/orders";

export async function POST(req: Request) {
  const { items } = await req.json();
  const order = mockOrder(items);
  return NextResponse.json(order);
}
