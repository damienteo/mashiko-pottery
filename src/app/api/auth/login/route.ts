import { NextResponse } from "next/server";
import { mockUser } from "@/mocks/users";

export async function POST(req: Request) {
  //   const { email, password } = await req.json();
  // you could validate here—but for mock we just return a user
  return NextResponse.json(mockUser);
}
