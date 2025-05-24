import { ChatRoom } from './chatroom.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // Handle /create-room
    if (pathname === "/create-room") {
      const id = crypto.randomUUID();
      return new Response(JSON.stringify({ roomId: id, joinUrl: `/room?id=${id}` }));
    }

    // Handle /room?id=...
    if (pathname === "/room") {
      const roomId = searchParams.get("id");
      const stub = env.CHATROOM.get(roomId);
      return stub.fetch(request);
    }

    // ✅ Handle /api/chat/<room>
    if (pathname.startsWith("/api/chat/")) {
      const room = pathname.split("/").pop();
      const id = env.CHATROOM.idFromName(room); // use name for persistent room
      const stub = env.CHATROOM.get(id);
      return stub.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
};

export { ChatRoom };

