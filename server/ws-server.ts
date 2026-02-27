import { createServer } from "node:http";
import { WebSocketServer, type RawData, type WebSocket } from "ws";

const port = Number(process.env.WS_PORT ?? 3001);
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", (raw: RawData) => {
    const payload = raw.toString();

    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    }
  });
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`WebSocket signalling server on :${port}`);
});
