import { json } from "stream/consumers";
import { auth } from "@clerk/nextjs/server";
import { createChat } from "@/src/db/index"

export async function POST(req: Request) {
  const { title, model } = await req.json()

  const{userId} = await auth()
  if (userId) {
    //create a new chat
    const newChat = await createChat(title, userId, model)

    //return the new chat
    return new Response(JSON.stringify({id: newChat?.id}), { status: 200 });
  }

  return new Response(null, { status: 200 });
}