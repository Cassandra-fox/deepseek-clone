import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { getChat } from "@/src/db/index"
export async function POST(req: Request) {
  const {chat_id}= await req.json()

  const {userId} = await auth()
  if (!userId){
    return new Response(JSON.stringify({error:"Unauthorized"}),{status:401});
  }

  const chat = await getChat(Number(chat_id), userId)
  return new Response(JSON.stringify(chat), { status: 200 });
}