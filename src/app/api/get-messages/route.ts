import { useAuth } from "@clerk/nextjs";
import { getMessages } from "@/src/db"
import {auth} from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const {chat_id,chat_user_id} = await req.json();
  const {userId} = await auth()
  if(!userId || chat_user_id !== userId){
    return new Response(JSON.stringify({error:"Unauthorized"}),{status:401});
  }

  const messages = await getMessages(Number(chat_id));
  return new Response(JSON.stringify(messages), { status: 200 });
}