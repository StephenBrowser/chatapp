export class ChatRoom {
  constructor(state, env) {
    this.state = state
    this.env = env
    this.clients = new Map()
  }

  async fetch(request) {
    const { pathname } = new URL(request.url)

    if (request.method === "POST" && pathname.endsWith("/send")) {
      const { username, message } = await request.json()
      const data = { username, message, timestamp: Date.now() }
      await this.state.storage.put(`msg-${Date.now()}`, data)

      // Broadcast to connected clients (simplified)
      this.clients.forEach(controller => controller.write(JSON.stringify(data)))
      return new Response("OK")
    }

    if (pathname.endsWith("/messages")) {
      const msgs = await this.state.storage.list()
      return new Response(JSON.stringify([...msgs.values()]))
    }

    return new Response("ChatRoom endpoint")
  }
}
