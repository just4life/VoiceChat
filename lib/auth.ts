import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { adminGuids } from "@/lib/config";
import { prisma } from "@/lib/prisma";

function ensureAdminRole(guid: string, currentRole: Role) {
  if (adminGuids.includes(guid)) return Role.ADMIN;
  return currentRole;
}

export async function resolveSessionUser() {
  const cookieStore = await cookies();
  const guid = cookieStore.get("voice_guid")?.value;
  if (!guid) return null;
  return prisma.user.findUnique({ where: { guid } });
}

export async function requireRole(minRole: Role) {
  const user = await resolveSessionUser();
  if (!user) return { ok: false as const, status: 401 };

  const hierarchy: Role[] = [Role.USER, Role.MODERATOR, Role.ADMIN];
  if (hierarchy.indexOf(user.role) < hierarchy.indexOf(minRole)) {
    return { ok: false as const, status: 403 };
  }
  return { ok: true as const, user };
}

export async function createOrAttachUser(nickname: string) {
  const cookieStore = await cookies();
  const currentGuid = cookieStore.get("voice_guid")?.value;

  if (currentGuid) {
    const existing = await prisma.user.findUnique({ where: { guid: currentGuid } });
    if (existing) {
      return prisma.user.update({
        where: { id: existing.id },
        data: {
          nickname,
          role: ensureAdminRole(existing.guid, existing.role)
        }
      });
    }
  }

  const guid = randomUUID();
  const user = await prisma.user.create({
    data: {
      guid,
      nickname,
      role: adminGuids.includes(guid) ? Role.ADMIN : Role.USER
    }
  });

  cookieStore.set("voice_guid", guid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });

  return user;
}
