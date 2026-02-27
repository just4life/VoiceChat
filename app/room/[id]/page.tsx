import { redirect } from "next/navigation";
import { ModeratorMenu } from "@/components/moderator-menu";
import { RoomChat } from "@/components/room-chat";
import { resolveSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roomId = Number(id);
  const user = await resolveSessionUser();
  if (!user) redirect("/");

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      members: { include: { user: true } },
      messages: { include: { user: true }, orderBy: { createdAt: "asc" }, take: 50 }
    }
  });

  if (!room) return <main className="p-6">Комната не найдена.</main>;

  await prisma.roomMember.upsert({
    where: { userId_roomId: { userId: user.id, roomId } },
    create: { userId: user.id, roomId },
    update: {}
  });

  const freshRoom = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      members: { include: { user: true } },
      messages: { include: { user: true }, orderBy: { createdAt: "asc" }, take: 50 }
    }
  });

  if (!freshRoom) return <main className="p-6">Комната не найдена.</main>;

  return (
    <main className="p-6 grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="panel p-4">
          <h1 className="text-xl font-semibold">{freshRoom.name}</h1>
          <p className="text-zinc-400 text-sm">Голосовой чат (WebRTC signalling через WebSocket server).</p>
        </div>
        <RoomChat
          roomId={freshRoom.id}
          initialMessages={freshRoom.messages.map((m) => ({
            id: m.id,
            content: m.content,
            type: m.type,
            nickname: m.user.nickname
          }))}
        />
      </section>
      <aside className="panel p-4">
        <h2 className="font-semibold mb-3">Участники</h2>
        <ul className="space-y-3 text-sm">
          {freshRoom.members.map((member) => (
            <li key={member.userId} className="rounded-lg bg-zinc-800 p-3">
              <div className="flex items-center justify-between">
                <span>{member.user.nickname}</span>
                <span>{member.isMuted ? "🔇" : "🎙️"}</span>
              </div>
              <ModeratorMenu
                canModerate={user.role !== "USER"}
                targetUserId={member.user.id}
                roomId={freshRoom.id}
                role={user.role}
              />
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
