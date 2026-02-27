import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleBadge } from "@/lib/roles";

export default async function LobbyPage() {
  const user = await resolveSessionUser();
  if (!user) redirect("/");

  const [rooms, users] = await Promise.all([
    prisma.room.findMany({
      include: {
        members: { include: { user: true } }
      },
      orderBy: { createdAt: "asc" }
    }),
    prisma.user.findMany({ orderBy: { nickname: "asc" } })
  ]);

  return (
    <main className="p-6 grid gap-4 md:grid-cols-[300px_1fr_300px]">
      <section className="panel p-4">
        <h2 className="font-semibold mb-3">Комнаты</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li key={room.id}>
              <Link href={`/room/${room.id}`} className="block rounded-lg bg-zinc-800 p-2 hover:bg-zinc-700">
                {room.name} {room.passwordHash ? "🔒" : ""} <span className="text-zinc-400">({room.members.length})</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel p-4">
        <h1 className="text-xl font-semibold">Лобби</h1>
        <p className="mt-2 text-zinc-400">Добро пожаловать, {user.nickname}. Выберите комнату слева.</p>
      </section>
      <section className="panel p-4">
        <h2 className="font-semibold mb-3">Онлайн</h2>
        <ul className="space-y-2 text-sm">
          {users.map((online) => (
            <li key={online.id} className="rounded bg-zinc-800 p-2">
              {online.nickname} {roleBadge(online.role)}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
