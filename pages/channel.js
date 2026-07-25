'use client'
import { useState } from 'react'

export default function ChannelPage() {
  const [message, setMessage] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-white flex flex-col">
      
      {/* CHANNEL HEADER - SHARP PINK */}
      <header className="w-full bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 4V5z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold">Channel <span>Pink</span> Chat</h1>
          <p className="text-xs opacity-90">AI-Powered Conversations</p>
        </div>
      </header>

      {/* WELCOME SECTION */}
      <div className="flex-1 flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-gradient-to-r from-[#FF1493] to-[#FF69B4] rounded-full flex items-center justify-center mb-4 shadow-lg">
          <svg className="w-10 h-10" fill="white" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 4V5z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Channel Pink</h2>
        <p className="text-gray-400 max-w-sm">Start a conversation and experience AI-powered assistance</p>
      </div>

      {/* INPUT SECTION */}
      <div className="p-4 border-t border-gray-700 bg-[#1a1a2e]">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg outline-none border-gray-700 focus:border-pink-500"
          />
          <button className="bg-gradient-to-r from-[#FF1493] to-[#FF69B4] px-6 py-3 rounded-lg font-bold hover:opacity-90">
            Send
          </button>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">Powered by <span className="text-[#FF1493] font-semibold">Channel Pink</span></p>
      </div>
    </div>
  )
}
