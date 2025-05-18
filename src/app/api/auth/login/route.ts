import { NextResponse } from "next/server";
import { mockUsers } from "@/mocks/users";

export async function POST(req: Request) {
  console.log({ req });
  //   const { email, password } = await req.json();
  // you could validate here—but for mock we just return a user
  return NextResponse.json(mockUsers[0]);
}
