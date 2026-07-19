import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import dynamic from "next/dynamic"

const APP_ID = "YOUR_AGORA_APP_ID" // replace with your agora id
const CHANNEL = "voice-room"

function VoiceRoom({ onClose }) {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [users, setUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // NEW: send message inside voice room - MUST BE INSIDE FUNCTION
  const sendVoiceRoomMsg = () => {
    if(!inputText.trim()) return;
    setChatMessages([...chatMessages, {user: 'YOU', text: inputText}]);
    setInputText('');
  }

  useEffect(() => {
    let agoraClient;
    let audioTrack;
    const init = async () => { // FIXED: was "asvnc"
      const Agora = (await import("agora-rtc-sdk-ng")).default;
      agoraClient = Agora.createClient({ mode: "rtc", codec: "vp8" });
      setClient(agoraClient);
      
      await agoraClient.join(APP_ID, CHANNEL, null, null);
      audioTrack = await Agora.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
      await agoraClient.publish([audioTrack]);

      agoraClient.on("user-published", async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
          setUsers((prev) => [...prev, user]);
        }
      });

      agoraClient.on("user-unpublished", (user) => {
        setUsers((prev) => prev.filter((u) => u.uid!== user.uid));
      });
    };
    if(typeof window!== "undefined") init();

    return () => {
      localAudioTrack?.close();
      client?.leave();
    }
  }, []);

  const toggleMic = async () => {
    if(localAudioTrack) {
      await localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  }

  return (
    <div style={{position: 'fixed', bottom: 20, right: 20, width: 320, background: '#ff1493', padding: 20, borderRadius: 20, color: 'white', zIndex: 999}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <h3 style={{margin:0}}>🔴 Open Voice Room</h3>
        <button onClick={onClose}>X</button>
      </div>
      <p>{users.length + 1} Live</p>
      
      <div style={{display:'flex', justifyContent:'center'}}>
        <div style={{width:70, height:70, borderRadius:'50%', background:'white', color:'#ff1493'}}>YOU {isMuted? '🔇' : '🎤'}</div>
      </div>

      {/* CHAT BOX */}
      <div style={{height:140, background:'#1a1a1a', borderRadius:12, margin:'10px 0'}}>
        <div style={{height:100, overflowY:'auto', padding:8, fontSize:13}}>
          {chatMessages.map((msg,i) => <div key={i}><b style={{color:'#ff1493'}}>{msg.user}:</b> {msg.text}</div>)}
        </div>
        <div style={{display:'flex', padding:8}}>
          <input value={inputText} onChange={e=>setInputText(e.target.value)} onKeyPress={e=>e.key==='Enter'&&sendVoiceRoomMsg()} placeholder="Chat in room..." style={{flex:1, background:'#333', color:'white'}}/>
          <button onClick={sendVoiceRoomMsg}>Send</button>
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'center', gap:15}}>
        <button onClick={toggleMic}>{isMuted?'🔇':'🎤'}</button>
        <button onClick={onClose}>❌</button>
      </div>
    </div>
  )
}

export default function Home() {
  const [showVoice, setShowVoice] = useState(false);
  return (
    <div>
      <Head><title>PinkChat</title></Head>
      <button onClick={()=>setShowVoice(true)}>Join Voice Room</button>
      {showVoice && <VoiceRoom onClose={()=>setShowVoice(false)} />}
    </div>
  )
}
