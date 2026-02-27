import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ role: z.nativeEnum(Role) });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireRole(Role.ADMIN);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });

  const body = bodySchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { role: body.data.role }
  });

  return NextResponse.json({ id: user.id, role: user.role });
}
