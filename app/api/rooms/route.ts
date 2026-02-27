import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole, resolveSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashRoomPassword } from "@/lib/room";

const createSchema = z.object({
  name: z.string().min(2).max(60),
  password: z.string().max(64).optional()
});

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: {
      members: { include: { user: true } }
    },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json(
    rooms.map((r) => ({
      id: r.id,
      name: r.name,
      protected: Boolean(r.passwordHash),
      members: r.members.map((m) => ({ id: m.user.id, nickname: m.user.nickname, role: m.user.role }))
    }))
  );
}

export async function POST(request: Request) {
  const access = await requireRole(Role.MODERATOR);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });

  const body = createSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const room = await prisma.room.create({
    data: {
      name: body.data.name,
      passwordHash: await hashRoomPassword(body.data.password),
      createdById: access.user.id
    }
  });

  const user = await resolveSessionUser();
  if (user) {
    await prisma.roomMember.create({ data: { roomId: room.id, userId: user.id } });
  }

  return NextResponse.json({ id: room.id, name: room.name, protected: Boolean(room.passwordHash) }, { status: 201 });
}
