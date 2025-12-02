'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Page() {
  const {chat_id} = useParams()

  const {data:chat}= useQuery({
    queryKey:['chat',chat_id],
    queryFn: ()=> {
      return axios.post('/api/get-chat',{
        chat_id: chat_id
      })
    }
  })

  const {data: previousMessages} = useQuery({
        queryKey: ['messages', chat_id],
        queryFn: () => {
            return axios.post(`/api/get-messages`, {
                chat_id: chat_id,
                chat_user_id: chat?.data?.userId
            })
        },
        enabled: !!chat?.data?.id
    })

  const [model, setModel] = useState('deepseek-v3');

  const handleChangeModel = () =>{
    setModel(model ==='deepseek-v3' ? 'deepseek-r1' : 'deepseek-v3')
  }


  const { messages, input, handleInputChange, handleSubmit, append, setMessages }= useChat ({
    api: '/api/chat',
    body: {
      model:model,
      chat_id:chat_id,
    },
    initialMessages: []
  })

  useEffect(() => {
    if (previousMessages?.data) {
      setMessages(previousMessages.data)
    }
  }, [previousMessages?.data, setMessages])

  const endRef = useRef<HTMLDivElement>(null)
  useEffect(
    ()=>{
      if(endRef.current){
        endRef?.current?.scrollIntoView({behavior: 'smooth'})
      }
    },[messages]
  )

  const handleFirstMessage = async (model: string | undefined) => {
       if (
      !model ||
      !chat?.data?.title ||
      previousMessages?.data?.length !== 0 ||
      typeof append !== 'function'
      ) {
      return;}

      await append(
        {
          role: 'user',
          content: chat.data.title,
        },
        {
          body: {
            model: model,
            chat_id,
          },
        },
      );  
        
    }

    useEffect(()=> {
        if (!chat?.data?.model) return;
        setModel(chat?.data?.model)
        // 延迟执行，确保 append 已准备好
        const timer = setTimeout(() => {
          handleFirstMessage(chat?.data?.model)
        }, 500);
        return () => clearTimeout(timer);
    }, [chat?.data?.title, previousMessages, append])
  
  return (
    <div className='flex flex-col h-screen justify-between items-center'>

      <div className='flex flex-col w-2/3 gap-8 overflow-y-auto justify-between flex-1'>
        <div className='h-4'></div>
       <div className='flex flex-col gap-8 flex-1'>
         {messages.map(message => (
          <div 
            key={message.id}
            className={`rounded-lg flex flex-row ${message?.role === 'assistant'? 'justify-start mr-18':'justify-end ml-10'}`}
          >
            <p className={`inline-block p-2 rounded-lg ${message?.role === 'assistant' ? 'bg-blue-300' : 'bg-slate-100'}`}>
              {message.content}
            </p>
            
          </div>
        ))}
       </div>
        <div className='h-4' ref={endRef}>

        </div>
      </div>

      {/* 输入框 */}
      <form 
        className="flex flex-col items-center justify-center mt-4 shadow-lg border-[1px] border-gray-300 h-32 rounded-lg w-2/3"
        onSubmit={handleSubmit}
      >

          <textarea 
            className="w-full rounded-lg p-3 h-30 focus:outline-none" 
            value={input} 
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          >
          </textarea>

          <div className="flex flex-row items-center justify-between w-full h-12 mb-2">
              <div>
                <div className={`flex flex-row items-center justify-center rounded-lg border-[1px] px-2 py-1 ml-2 cursor-pointer ${model=== 'deepseek-r1'? 'border-blue-300 bg-blue-200':'border-gray-300'}`}
                onClick={handleChangeModel}>
                  <p className="text-sm ">
                    深度思考(R1)
                  </p>
                </div>
              </div>
            
            <button 
              type="submit"
              className="flex items-center justify-center border-2 mr-4 border-black p-1 rounded-full"
            >
              <SendIcon></SendIcon>
            </button>
        </div>
        </form>

    </div>
  );
}