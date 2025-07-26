import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: number;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "SELLER" | "OPERATIONS";
};

const supabase = await createClient();

export async function getServerSessionUser(): Promise<SessionUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id || !user.email || !user.role) {
    return null;
  }

  if (!Object.values(Role).includes(user.role as Role)) {
    return null;
  }

  return {
    id: Number(user.id),
    email: user.email,
    role: user.role as SessionUser["role"],
  };
}

export async function assertSellerAccess(): Promise<SessionUser> {
  const user = await getServerSessionUser();

  if (!user) {
    throw new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (user.role !== "SELLER") {
    throw new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  return user;
}
