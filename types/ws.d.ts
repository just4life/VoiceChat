declare module "ws" {
  export type RawData = Buffer | ArrayBuffer | Buffer[] | string;

  export class WebSocket {
    static readonly OPEN: number;
    readonly OPEN: number;
    readyState: number;
    send(data: string | Buffer | ArrayBuffer): void;
    on(event: "message", listener: (data: RawData) => void): this;
  }

  export class WebSocketServer {
    constructor(options: { server: import("node:http").Server });
    clients: Set<WebSocket>;
    on(event: "connection", listener: (socket: WebSocket) => void): this;
  }
}
