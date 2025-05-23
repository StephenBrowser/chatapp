import { ChatRoom } from './chatroom'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const { pathname, searchParams } = url

    if (pathname === "/create-room") {
      const id = crypto.randomUUID()
      const stub = env.CHATROOM.get(id)
      return new Response(JSON.stringify({ roomId: id, joinUrl: `/room?id=${id}` }))
    }

    if (pathname === "/room") {
      const roomId = searchParams.get("id")
      const stub = env.CHATROOM.get(roomId)
      return stub.fetch(request)
    }

    return new Response("Not found", { status: 404 })
  }
}

export { ChatRoom }
