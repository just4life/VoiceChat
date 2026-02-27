import { createServer } from "node:http";
import { WebSocketServer } from "ws";

const port = Number(process.env.WS_PORT ?? 3001);
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(raw.toString());
    }
  });
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`WebSocket signalling server on :${port}`);
});
