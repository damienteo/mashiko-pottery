// DEPRECATED: This login route is no longer in use. Supabase Auth is now handled client-side via `supabase.auth.signInWithPassword`.
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  console.warn(
    "DEPRECATED: /api/auth/login is no longer used. Use Supabase Auth directly on the client."
  );
  const { email, password } = await req.json();
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { message: error?.message || "Login failed" },
      { status: 401 }
    );
  }

  return NextResponse.json(data.user);
}
