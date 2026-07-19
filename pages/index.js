import React, { useState, useEffect, useRef } from "react"
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const AgoraRTC = dynamic(() => import("agora-rtc-sdk-ng"), { ssr: false });

const APP_ID = "67c28316a5e748ae8fd979ea7a699ce3";
const CHANNEL = "pinkchat_voice_room";

function VoiceRoom({ onClose }) {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [users, setUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

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
        if (mediaType === "audio") { user.audioTrack.play(); }
        setUsers((prev) => [...prev, user]);
      });
      agoraClient.on("user-unpublished", (user) => {
        setUsers((prev) => prev.filter((u) => u.uid!== user.uid));
      });
    };
    if(typeof window!== "undefined") init();
    return () => { audioTrack?.close(); agoraClient?.leave(); };
  }, []);

  const toggleMic = async () => {
    await localAudioTrack.setEnabled(!isMuted);
    setIsMuted(!isMuted);
  };

  return (
    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }}
      style={{position: "fixed", bottom: 0, left: 0, right: 0, height: "300px", background: "#FF1493", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", padding: "20px", zIndex: 999}}>
      <div style={{textAlign: "center", marginBottom: "20px"}}>
        <h2 style={{color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0}}>🔴 Open Voice Room</h2>
        <p style={{color: "#f8bbd0", margin: 0}}>{users.length + 1} Live</p>
      </div>
      <div style={{display: "flex", gap: "15px", justifyContent: "center", marginBottom: "30px"}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div style={{width: "70px", height: "70px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF1493", fontWeight: "bold"}}>YOU</div>
          <p style={{color: "#fff", fontSize: "12px", marginTop: "5px"}}>{isMuted? <MicOff size={16}/> : <Mic size={16}/>}</p>
        </div>
        {users.map((user) => (
          <div key={user.uid} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div style={{width: "70px", height: "70px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF1493", fontWeight: "bold"}}>{user.uid.toString().slice(-2)}</div>
          </div>
        ))}
      </div>
      <div style={{display: "flex", justifyContent: "center", gap: "20px"}}>
        <button onClick={toggleMic} style={{width: "60px", height: "60px", borderRadius: "50%", background: "#fff", border: "none"}}>{isMuted? <MicOff color="#FF1493" /> : <Mic color="#FF1493" />}</button>
        <button onClick={onClose} style={{width: "60px", height: "60px", borderRadius: "50%", background: "red", border: "none"}}><PhoneOff color="#fff" /></button>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState("")
  const [profile, setProfile] = useState({name: "", bio: ""})
  const [activeContact, setActiveContact] = useState("Prof")
  const [input, setInput] = useState("")
  const [chats, setChats] = useState({ Group: [], Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: [] })
  const [recording, setRecording] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [liveStream, setLiveStream] = useState(null)
  const [showVoice, setShowVoice] = useState(false)
  const chatEndRef = useRef(null)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const lastAudioRef = useRef(null)

  const bgColor = dark? "#0e0e0e" : "#ffffff"
  const textColor = dark? "#ffffff" : "#000"
  const chatBg = dark? "#1a1a1a" : "#f1f1f1"

  useEffect(() => { if(typeof window!== "undefined") {
    const savedUser = localStorage.getItem("crypto-prof-user") || ""
    const savedProfile = localStorage.getItem("crypto-prof-profile")
    const savedChats = localStorage.getItem("crypto-prof-chats")
    setUser(savedUser)
    setProfile(savedProfile? JSON.parse(savedProfile) : {name: "", bio: ""})
    if(savedChats) setChats(JSON.parse(savedChats))
  }}, [])

  useEffect(() => { if(user && typeof window!== "undefined") {
    localStorage.setItem("crypto-prof-chats", JSON.stringify(chats))
    localStorage.setItem("crypto-prof-profile", JSON.stringify(profile))
  }}, [chats, user, profile])

  useEffect(() => { if(isLive && videoRef.current && liveStream) { videoRef.current.srcObject = liveStream }}, [isLive, liveStream])

  const handleLogin = () => { if(profile.name.trim()) { setUser(profile.name); localStorage.setItem("crypto-prof-user", profile.name) }
  const sendMessage = () => { if(!input.trim()) return; const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); const newMsg = {text: input, time, sender: user}; setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], newMsg]})); setInput("") }
  
  const toggleLive = async () => {
    if(!isLive) { const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); setLiveStream(stream); setIsLive(true) } 
    else { liveStream?.getTracks().forEach(track => track.stop()); setIsLive(false) }
  }
  const toggleRecording = async () => {
    if(!recording) { setRecording(true); const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); mediaRecorderRef.current = new MediaRecorder(stream); audioChunksRef.current = []; mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data); mediaRecorderRef.current.onstop = () => { const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); lastAudioRef.current = URL.createObjectURL(audioBlob); const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: `🎤 Voice Note ▶️`, time, sender: user, hasAudio: true}]})) }; mediaRecorderRef.current.start() } 
    else { setRecording(false); mediaRecorderRef.current?.stop() }
  }

  if(!user) {
    return (
      <div style={{background: bgColor, color: textColor, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px"}}>
        <div style={{background: "#FF1493", padding: "20px", borderRadius: "20px", textAlign: "center", marginBottom: "20px"}}>
          <h1 style={{fontSize: "32px", fontWeight: "900", color: "#fff", margin: "0"}}>PINKCHAT 💖</h1>
          <p style={{fontSize: "12px", color: "#fff", margin: "0"}}>By Crypto-Prof AI App Owner</p>
        </div>
        <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Enter Username" style={{padding: "12px", borderRadius: "10px", border: "2px solid #FF1493", margin: "8px 0", width: "80%"}}/>
        <button onClick={handleLogin} style={{background: "#FF1493", color: "#fff", border: "none", padding: "14px 40px", borderRadius: "25px", fontWeight: "bold"}}>Join PINKCHAT</button>
      </div>
    )
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "10px", paddingBottom: "80px"}}>
      <div style={{background: "#FF1493", padding: "16px", borderRadius: "0 0 20px 20px", textAlign: "center"}}>
        <h1 style={{color: "#fff", fontSize: "24px", margin: "0", fontWeight: "900"}}>PINKCHAT 💖</h1>
        <p style={{color: "#fff", fontSize: "11px", margin: "4px 0 0 0"}}>By Crypto-Prof AI App Owner</p>
      </div>
      {isLive && <video ref={videoRef} autoPlay muted playsInline style={{width: "100%", borderRadius: "8px", marginTop: "10px"}} />}
      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {["Group", "Prof", "Queen", "Indigo", "Boss", "Tech", "Gist"].map(name => (<button key={name} onClick={() => setActiveContact(name)} style={{background: activeContact===name? "#FF1493" : "#333", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px"}}>{name}</button>))}
      </div>
      <div style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "50vh", overflowY: "auto"}}>
        {chats[activeContact].map((m, i) => (<div key={i} style={{textAlign: m.sender===user? "right" : "left", margin: "8px 0"}}><span style={{background: m.sender===user? "#FF1493" : "#444", color: "#fff", padding: "8px 12px", borderRadius: "15px"}}>{m.text}</span></div>))}
        <div ref={chatEndRef} />
      </div>
      <div style={{marginTop: "8px", display: "flex", gap: "8px"}}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Message..." style={{flex: 1, padding: "12px", borderRadius: "25px", border: "none"}}/>
        <button onClick={sendMessage} style={{background: "#FF1493", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px"}}>Send</button>
      </div>
      <div style={{position: "fixed", bottom: 0, left: 0, right: 0, background: "#FF1493", display: "flex", gap: "8px", justifyContent: "space-around", padding: "10px"}}>
        <button onClick={() => setShowVoice(true)} style={{background: "#fff", color: "#FF1493", border: "none", padding: "8px 12px", borderRadius: "20px"}}>Voice</button>
        <button onClick={toggleRecording} style={{background: recording? "red" : "#fff", color: "#FF1493", border: "none", padding: "8px 14px", borderRadius: "20px"}}>🎤 {recording? "Stop" : "Talk"}</button>
        <button onClick={toggleLive} style={{background: isLive? "red" : "#fff", color: "#FF1493", border: "none", padding: "8px 12px", borderRadius: "20px"}}>📹 {isLive? "End" : "Live"}</button>
      </div>
      {showVoice && <VoiceRoom onClose={() => setShowVoice(false)} />}
    </div>
  )
}
