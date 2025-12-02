import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamText} from 'ai';
import { auth } from '@clerk/nextjs/server';
import { createMessage, getChat } from '@/src/db';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const deepseek =createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.BASE_URL
})

export async function POST(req: Request) {
  const { messages,model,chat_id } = await req.json();

  const {userId} = await auth()
  if(!userId){
    return new Response(JSON.stringify({error:"Unauthorized"}),{status:401});
  }

  // Verify chat ownership
  const chat = await getChat(Number(chat_id), userId);
  if (!chat) {
    return new Response(JSON.stringify({ error: "Chat not found or unauthorized" }), { status: 404 });
  }

  const lastMessage = messages[messages.length - 1];
  await createMessage(Number(chat_id), lastMessage.role, lastMessage.content);

  const result = streamText({
    model: deepseek(model || 'deepseek-chat'),
    system: 'You are a helpful assistant.',
    messages,
    onFinish: async(result)=>{
      await createMessage(Number(chat_id), 'assistant', result.text);
    }
  });

  return result.toUIMessageStreamResponse();
}