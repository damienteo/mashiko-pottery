import {  Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateUserRole(userId: string, role: Role) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}