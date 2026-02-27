"use client";

import { useState } from "react";

type Message = { id: number; content: string; type: "TEXT" | "IMAGE"; nickname: string };

export function RoomChat({
  initialMessages,
  roomId
}: {
  initialMessages: Message[];
  roomId: number;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    const text = content.trim();
    if (!text || sending) return;
    setSending(true);

    const response = await fetch(`/api/rooms/${roomId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, type: "TEXT" })
    });

    setSending(false);
    if (!response.ok) return;

    const savedMessage = (await response.json()) as Message;
    setMessages((prev) => [...prev, savedMessage]);
    setContent("");
  }

  return (
    <div className="panel p-4 h-[360px] flex flex-col">
      <div className="flex-1 overflow-auto space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-lg bg-zinc-800 p-2 text-sm">
            <span className="text-accent mr-2">{msg.nickname}</span>
            {msg.type === "IMAGE" ? "🖼️ " : null}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Сообщение"
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
        <button
          onClick={send}
          disabled={sending}
          className="rounded-lg bg-accent px-4 text-zinc-900 disabled:opacity-60"
        >
          {sending ? "..." : "Отпр."}
        </button>
      </div>
    </div>
  );
}
