import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ userId: z.number() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireRole(Role.MODERATOR);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });

  const { id } = await params;
  const body = bodySchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await prisma.roomMember.deleteMany({
    where: { roomId: Number(id), userId: body.data.userId }
  });

  return NextResponse.json({ success: true });
}
