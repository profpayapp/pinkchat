'use client'
import { useState, useEffect } from 'react'
import { Phone, PhoneOff } from 'lucide-react'

let AgoraRTC = null
if (typeof window !== 'undefined') {
  import('agora-rtc-sdk-ng').then((mod) => {
    AgoraRTC = mod.default
  })
}

export default function VoiceRoom({ channelName }) {
  const [joined, setJoined] = useState(false)
  const [client, setClient] = useState(null)

  const APP_ID = "PUT_YOUR_AGORA_APP_ID_HERE"

  useEffect(() => {
    if(AgoraRTC) {
      setClient(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }))
    }
  }, [])

  const join = async () => {
    if(!client || !AgoraRTC) return alert("Loading voice...")
    await client.join(APP_ID, channelName, null, null)
    setJoined(true)
  }

  const leave = async () => {
    if(client) await client.leave()
    setJoined(false)
  }

  return (
    <button 
      onClick={joined ? leave : join}
      className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 ${
        joined ? 'bg-red-500' : 'bg-pink-500'
      }`}
    >
      {joined ? <PhoneOff size={20} /> : <Phone size={20} />}
      {joined ? 'Leave Voice' : 'Join Voice'}
    </button>
  )
}
