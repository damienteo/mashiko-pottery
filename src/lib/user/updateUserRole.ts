import { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function updateUserRole(userId: string, role: Role) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}
