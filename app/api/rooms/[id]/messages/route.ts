import { MessageType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  content: z.string().min(1).max(2000),
  type: z.nativeEnum(MessageType).default(MessageType.TEXT)
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await resolveSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const roomId = Number(id);
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const member = await prisma.roomMember.findUnique({
    where: { userId_roomId: { userId: user.id, roomId } }
  });
  if (!member) return NextResponse.json({ error: "Join room first" }, { status: 403 });

  const body = createSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      roomId,
      userId: user.id,
      content: body.data.content,
      type: body.data.type
    },
    include: { user: true }
  });

  return NextResponse.json({
    id: message.id,
    content: message.content,
    type: message.type,
    nickname: message.user.nickname
  });
}
