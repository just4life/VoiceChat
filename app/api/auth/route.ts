import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrAttachUser } from "@/lib/auth";

const bodySchema = z.object({
  nickname: z.string().min(2).max(32)
});

export async function POST(request: Request) {
  const body = bodySchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid nickname" }, { status: 400 });
  }

  const user = await createOrAttachUser(body.data.nickname);
  return NextResponse.json({
    id: user.id,
    guid: user.guid,
    nickname: user.nickname,
    role: user.role
  });
}
