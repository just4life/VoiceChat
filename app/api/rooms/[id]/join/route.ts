import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyRoomPassword } from "@/lib/room";

const bodySchema = z.object({ password: z.string().optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await resolveSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const room = await prisma.room.findUnique({ where: { id: Number(id) } });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const body = bodySchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (user.role === Role.USER) {
    const allowed = await verifyRoomPassword(room.passwordHash, body.data.password);
    if (!allowed) return NextResponse.json({ error: "Wrong room password" }, { status: 403 });
  }

  await prisma.roomMember.upsert({
    where: { userId_roomId: { userId: user.id, roomId: room.id } },
    create: { userId: user.id, roomId: room.id },
    update: {}
  });

  return NextResponse.json({ success: true });
}
