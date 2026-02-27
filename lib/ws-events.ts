export type SocketEvent =
  | { type: "room_joined"; roomId: number; userId: number }
  | { type: "room_left"; roomId: number; userId: number }
  | { type: "message_created"; roomId: number; content: string; userId: number };
