export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname === "/verify" && req.method === "POST") {
      const { token } = await req.json();
      const isValid = await verifyRecaptcha(token);
      return new Response(JSON.stringify({ success: isValid }), {
        headers: { "Content-Type": "application/json" },
        status: isValid ? 200 : 403
      });
    }

    if (url.pathname.startsWith("/chat/")) {
      const roomName = url.pathname.split("/chat/")[1];
      const id = env.CHAT_ROOM.idFromName(roomName);
      const stub = env.CHAT_ROOM.get(id);
      return stub.fetch(req);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function verifyRecaptcha(token) {
  const secret = "6LcFJX4rAAAAAOYuDifKhSPL8_ZAouaWqNt2Qry3";
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`
  });
  const data = await response.json();
  return data.success;
}

export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.clients = [];
  }

  async fetch(req) {
    if (req.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    await this.handleWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async handleWebSocket(ws) {
    ws.accept();
    this.clients.push(ws);

    ws.addEventListener("message", event => {
      for (const client of this.clients) {
        if (client.readyState === 1) {
          client.send(event.data);
        }
      }
    });

    ws.addEventListener("close", () => {
      this.clients = this.clients.filter(c => c !== ws);
    });
    ws.addEventListener("error", () => {
      this.clients = this.clients.filter(c => c !== ws);
    });
  }
}
