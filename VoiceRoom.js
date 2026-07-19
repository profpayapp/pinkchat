import React, { useState, useEffect } from "react"

const APP_ID = "YOUR_AGORA_APP_ID"
const CHANNEL = "voice-room"

export default function VoiceRoom({ onClose }) {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [users, setUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const sendVoiceRoomMsg = () => {
    if(!inputText.trim()) return;
    setChatMessages([...chatMessages, {user: 'YOU', text: inputText}]);
    setInputText('');
  }

  useEffect(() => {
    let agoraClient;
    let audioTrack;
    const init = async () => {
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
          user.audioTrack.play();
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
    <div style={{position: 'fixed', bottom: 20, right: 20, width: 340, background: '#ff1493', padding: 16, borderRadius: 20, color: 'white', zIndex: 999}}>
      <div style={{display:'flex', justifyContent:'space-between'}}><h3>🔴 Open Voice Room</h3><button onClick={onClose}>X</button></div>
      <p>{users.length + 1} Live</p>
      <div style={{width:70, height:70, borderRadius:'50%', background:'white', color:'#ff1493', textAlign:'center', paddingTop:15}}>YOU<br/>{isMuted? '🔇' : '🎤'}</div>
      
      <div style={{height:150, background:'#1a1a1a', borderRadius:12, margin:'12px 0'}}>
        <div style={{height:100, overflowY:'auto', padding:10}}>
          {chatMessages.map((msg,i) => <div key={i}><b style={{color:'#ff1493'}}>{msg.user}:</b> {msg.text}</div>)}
        </div>
        <div style={{display:'flex', padding:8}}>
          <input value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Chat in room..." style={{flex:1, background:'#333', color:'white', padding:8}}/>
          <button onClick={sendVoiceRoomMsg} style={{background:'#ff1493', color:'white', padding:'8px 14px'}}>Send</button>
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'center', gap:15}}>
        <button onClick={toggleMic} style={{width:50, height:50, borderRadius:'50%'}}>{isMuted?'🔇':'🎤'}</button>
        <button onClick={onClose} style={{width:50, height:50, borderRadius:'50%', background:'red'}}>❌</button>
      </div>
    </div>
  )
}
