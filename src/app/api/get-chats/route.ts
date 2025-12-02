import { auth } from "@clerk/nextjs/server";
import { getChats } from "@/src/db/index"

export async function POST(req: Request) {
  const {userId} = await auth()
  if (userId) {
    const chats =  await getChats(userId)
    return new Response(JSON.stringify(chats), { status: 200 });
  }

  return new Response(null, { status: 200 });
}