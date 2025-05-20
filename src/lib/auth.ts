import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Role } from "@prisma/client";

export type SessionUser = {
  id: number;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "SELLER" | "OPERATIONS";
};

export async function getServerSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    !session.user ||
    !session.user.id ||
    !session.user.email ||
    !session.user.role
  ) {
    return null;
  }

  if (!Object.values(Role).includes(session.user.role as Role)) {
    return null;
  }

  return {
    id: Number(session.user.id),
    email: session.user.email,
    role: session.user.role as SessionUser["role"],
  };
}
