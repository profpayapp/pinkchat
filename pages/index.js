import { useState } from "react"
import dynamic from "next/dynamic"
const VoiceRoom = dynamic(() => import('../VoiceRoom'), { ssr: false })

export default function Home() {
  const [showVoice, setShowVoice] = useState(false);
  return (
    <div>
      <button onClick={()=>setShowVoice(true)}>Join Voice Room</button>
      {showVoice && <VoiceRoom onClose={()=>setShowVoice(false)} />}
    </div>
  )
}
