import { useState } from "react"
import dynamic from "next/dynamic"

const VoiceRoom = dynamic(() => import('../VoiceRoom'), { ssr: false })

export default function Home() {
  const [showVoice, setShowVoice] = useState(false);
  
  return (
    <div style={{padding:20, textAlign:'center'}}>
      <h1>PinkChat</h1>
      <button 
        onClick={()=>setShowVoice(true)}
        style={{background:'#ff1493', color:'white', padding:'12px 24px', border:'none', borderRadius:12, fontSize:16, cursor:'pointer'}}
      >
        Join Voice Room
      </button>
      {showVoice && <VoiceRoom onClose={()=>setShowVoice(false)} />}
    </div>
  )
}
