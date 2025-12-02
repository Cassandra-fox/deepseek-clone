'use client'

import { ChatModel } from '@/src/db/schema';
import React from "react";
import { useUser, UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Props = Record<string, never>

const Navibar = (props: Props) => {

  const {user}= useUser();
  const router = useRouter();

  const {data: chats} = useQuery({
    queryKey: ['chats'],
    queryFn: () => axios.post('/api/get-chats'),
    enabled: !!user?.id
  })

  const pathname = usePathname()

  return (
    <div className='h-screen bg-gray-50'>
      <div className="flex items-center justify-center">
        <p className="font-bold text-2xl">
          DeepSeek
        </p>
      </div>

      <div className="h-10 flex items-center justify-center mt-4 cursor-pointer"
      onClick={()=>{
        router.push('/')
      }}>
        <p className="h-full w-2/3 bg-blue-100 rounded-lg flex items-center justify-center font-thin">
          创建新会话
        </p>
      </div>
      
      {/* 目录 */}
      <div className="flex flex-col items-center justify-center gap-2 p-6">
        {chats?.data?.map((chat: ChatModel)=>(
          <div className="w-fill h-10"
          key={chat.id}
          onClick={()=>{
            router.push(`/chat/${chat.id}`)
          }}>
            <p className={`font-extralight text-sm line-clamp-1 ${pathname === `/chat/${chat.id}` ? 'text-blue-700' : ''}`}>{chat.title}</p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 w-full flex justify-center">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              登录 / 注册
            </button>
          </SignInButton>
        </SignedOut>
      </div>

    </div>
  )
}

export default Navibar