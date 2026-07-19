'use client'
import { useState } from 'react'
import VoiceRoom from '../VoiceRoom'

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('Prof')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="w-full bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white text-center py-4 rounded-b-2xl shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">PINKCHAT 💖</h1>
        <p className="text-sm opacity-90 mt-1">by Crypto-Prof</p>
      </header>

      {/* TABS */}
      <div className="p-4 flex gap-2 flex-wrap">
        {['Group', 'Prof', 'Queen', 'Indigo', 'Boss'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full ${activeTab === tab? 'bg-pink-500' : 'bg-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="p-4">
        <div className="bg-gray-800 rounded-lg p-4 min-h-[300px]">
          <h2 className="font-bold text-xl mb-2">{activeTab}</h2>
          <p>Hi! how are you doing today? 💖</p>
          <p>Prof: let me explain this properly 💖</p>
          <p>an I am waiting for your response</p>
        </div>
      </div>

      {/* VOICE BUTTON - THIS IS THE NEW PART */}
      <div className="p-4 border-t border-gray-800 bg-black sticky bottom-0">
        <VoiceRoom channelName="prof-chat" />
      </div>
    </div>
  )
}
