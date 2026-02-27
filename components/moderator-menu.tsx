"use client";

import { Role } from "@prisma/client";

type Props = {
  canModerate: boolean;
  targetUserId: number;
  roomId: number;
  role: Role;
};

export function ModeratorMenu({ canModerate, targetUserId, roomId, role }: Props) {
  if (!canModerate) return null;

  return (
    <div className="mt-2 flex gap-2 text-xs">
      <button
        onClick={async () => {
          await fetch(`/api/rooms/${roomId}/kick`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: targetUserId })
          });
          location.reload();
        }}
        className="rounded bg-rose-500/20 px-2 py-1 text-rose-300"
      >
        Кик
      </button>
      {role === "ADMIN" && (
        <button
          onClick={async () => {
            await fetch(`/api/users/${targetUserId}/role`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: "MODERATOR" })
            });
            location.reload();
          }}
          className="rounded bg-sky-500/20 px-2 py-1 text-sky-300"
        >
          Сделать модератором
        </button>
      )}
    </div>
  );
}
