"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname })
    });

    setLoading(false);
    if (!response.ok) {
      setError("Не удалось выполнить вход");
      return;
    }

    router.push("/lobby");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="panel w-full max-w-md p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Voice Chat</h1>
      <p className="text-sm text-zinc-400">Введите ник. GUID будет создан автоматически.</p>
      <input
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-accent"
        placeholder="Ваш ник"
        value={nickname}
        minLength={2}
        maxLength={32}
        onChange={(e) => setNickname(e.target.value)}
        required
      />
      <button
        disabled={loading}
        className="w-full rounded-xl bg-accent py-3 font-semibold text-zinc-950 disabled:opacity-60"
      >
        {loading ? "Входим..." : "Присоединиться"}
      </button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </form>
  );
}
