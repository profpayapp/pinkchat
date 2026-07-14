import React, { useState, useEffect, useRef } from "react"

export default function App() {
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({name: "", bio: ""}) // ADDED BIO
  const [activeContact, setActiveContact] = useState("Prof")
  const [input, setInput] = useState("")
  const [recording, setRecording] = useState(false)
  const [recordingType, setRecordingType] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const docInputRef = useRef(null)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const chunksRef = useRef([])
  
  const [contacts] = useState({
    Prof: "#ff69b4", Queen: "#ff7f50", Indigo: "#6a5acd", 
    Boss: "#00bfff", Tech: "#32cd32", Gist: "#ffa500"
  })
  
  const [chats, setChats] = useState({
    Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: []
  })
  const [isPremium, setIsPremium] = useState(false)
  const chatEndRef = useRef(null)

  // USE OLD STORAGE SO YOUR OLD CHATS COME BACK
  useEffect(() => {
    const savedUser = localStorage.getItem("crypto-prof-user")
    const savedChats = localStorage.getItem("crypto-prof-chats")
    const savedPremium = localStorage.getItem("crypto-prof-premium")
    const savedProfile = localStorage.getItem("crypto-prof-profile")
    
    if(savedUser) setUser(savedUser)
    if(savedProfile) setProfile(JSON.parse(savedProfile))
    if(savedChats) setChats(JSON.parse(savedChats))
    if(savedPremium) setIsPremium(JSON.parse(savedPremium))
  }, [])

  useEffect(() => {
    if(user) {
      localStorage.setItem("crypto-prof-chats", JSON.stringify(chats))
      localStorage.setItem("crypto-prof-profile", JSON.stringify(profile))
    }
  }, [chats, user, profile])

  useEffect(() => {chatEndRef.current?.scrollIntoView({ behavior: "smooth" })}, [chats, activeContact])

  const bgColor = dark? "#0e0e0e" : "#ffffff"
  const textColor = dark? "#ffffff" : "#000"
  const chatBg = dark? "#1a1a1a" : "#f1f1f1"

  const handleLogin = () => {
    if(profile.name.trim()) {
      setUser(profile.name)
      localStorage.setItem("crypto-prof-user", profile.name)
      localStorage.setItem("crypto-prof-profile", JSON.stringify(profile))
    }
  }
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("crypto-prof-user")
  }

  const sendMessage = async (imageUrl = null, audioUrl = null, videoUrl = null, docName = null) => {
    if(!input.trim() &&!imageUrl &&!audioUrl &&!videoUrl &&!docName) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const newMsg = {text: input, image: imageUrl, audio: audioUrl, video: videoUrl, doc: docName, time, sender: user}
    setChats({...chats, [activeContact]: [...chats[activeContact], newMsg]})
    setInput("")
    
    setTimeout(() => {
      aiReply(activeContact, input, imageUrl, audioUrl, videoUrl, docName)
    }, 1000)
  }

  const aiReply = (name, msg, imageUrl, audioUrl, videoUrl, docName) => {
    let reply = "I'm here for you 💖"
    if(docName) reply = `Got your document: ${docName} 📄`
    if(videoUrl) reply = "Omo this video is fire! 🔥 What are we watching?"
    if(audioUrl) reply = "I heard your voice note! 🔊"
    if(imageUrl) reply = "Nice picture! 😍"
    
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    setChats(prev => ({...prev, [name]: [...prev[name], {text: reply, time, sender: name}]}))
  }

  const handleFileUpload = (e) => {const file = e.target.files[0]; if(file) sendMessage(URL.createObjectURL(file))}
  const handleVideoUpload = (e) => {const file = e.target.files[0]; if(file && file.type.startsWith('video')) sendMessage(null, null, URL.createObjectURL(file))}
  const handleDocUpload = (e) => {const file = e.target.files[0]; if(file) sendMessage(null, null, null, file.name)}

  const toggleRecording = async (type) => {
    if(recording && recordingType === type) stopRecording()
    else {
      if(recording) stopRecording()
      if(type === 'video') {setShowCamera(true); await startCameraPreview()}
      startRecording(type)
    }
  }
  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: "user"}, audio: true})
      mediaStreamRef.current = stream
      if(videoRef.current) videoRef.current.srcObject = stream
    } catch(err) {alert("Camera Error: " + err.message); setShowCamera(false)}
  }
  const startRecording = async (type) => {
    try {
      if(!mediaStreamRef.current) mediaStreamRef.current = await navigator.mediaDevices.getUserMedia(type === 'video'? { audio: true, video: true } : { audio: true })
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current)
      chunksRef.current = []
      mediaRecorderRef.current.ondataavailable = (e) => {if(e.data.size > 0) chunksRef.current.push(e.data)}
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {type: type === 'video'? 'video/webm' : 'audio/webm'})
        const url = URL.createObjectURL(blob)
        if(type === 'video') sendMessage(null, null, url)
        else sendMessage(null, url)
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
        mediaStreamRef.current = null
        setShowCamera(false)
      }
      mediaRecorderRef.current.start()
      setRecording(true)
      setRecordingType(type)
    } catch(err) {alert("Recording Error: " + err.message)}
  }
  const stopRecording = () => {
    if(mediaRecorderRef.current) mediaRecorderRef.current.stop()
    setRecording(false)
    setRecordingType(null)
  }
  const clearChat = () => {setChats({...chats, [activeContact]: []})}

  if(!user) {
    return (
      <div style={{background: bgColor, color: textColor, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px"}}>
        
        {/* STYLISH PINKCHAT BRAND */}
        <h1 style={{
          fontSize: "42px", 
          fontWeight: "900",
          background: "linear-gradient(45deg, #ff69b4, #ffa500)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 20px #ff69b4",
          margin: "5px 0"
        }}>
          PINKCHAT 💖
        </h1>
        <p style={{fontSize: "12px", color: "#aaa", marginBottom: "20px"}}>AUTHOR BY CRYPTO-PROF</p>
        
        <input 
          value={profile.name} 
          onChange={e => setProfile({...profile, name: e.target.value})} 
          placeholder="Enter Username" 
          style={{padding: "12px", borderRadius: "10px", border: "2px solid #ff69b4", margin: "8px 0", width: "80%", background: "#222", color: "#fff"}}
        />
        <input 
          value={profile.bio} 
          onChange={e => setProfile({...profile, bio: e.target.value})} 
          placeholder="Bio - e.g Crypto Trader" 
          style={{padding: "12px", borderRadius: "10px", border: "2px solid #ff69b4", margin: "8px 0", width: "80%", background: "#222", color: "#fff"}}
        />
        
        <button onClick={handleLogin} style={{
          background: "linear-gradient(45deg, #ff69b4, #ffa500)", 
          color: "#fff", 
          border: "none", 
          padding: "14px 40px", 
          borderRadius: "25px", 
          fontWeight: "bold",
          fontSize: "16px",
          marginTop: "10px",
          boxShadow: "0 0 15px #ff69b4"
        }}>
          Join PINKCHAT
        </button>
      </div>
    )
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "10px"}}>
      
      {/* STYLISH TOP BAR */}
      <div style={{
        background: "linear-gradient(90deg, #ff69b4, #ffa500)",
        padding: "10px",
        borderRadius: "15px",
        marginBottom: "10px",
        textAlign: "center"
      }}>
        <h1 style={{color: "#fff", fontSize: "22px", margin: "0", fontWeight: "900"}}>PINKCHAT 💖</h1>
        <p style={{color: "#fff", fontSize: "10px", margin: "0"}}>by CRYPTO-PROF | {profile.bio}</p>
      </div>

      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {Object.keys(contacts).map(name => (
          <button key={name} onClick={() => setActiveContact(name)} 
            style={{background: activeContact===name? contacts[name] : "#333", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>
            {name}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{background: "#555", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Light</button>
        <button onClick={clearChat} style={{background: "red", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Clear</button>
      </div>

      {showCamera && (
        <div style={{background: "#000", borderRadius: "10px", marginBottom: "10px"}}>
          <video ref={videoRef} autoPlay muted playsInline style={{width: "100%", borderRadius: "10px"}}/>
        </div>
      )}

      <div style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "50vh", overflowY: "auto"}}>
        <h3>{activeContact}</h3>
        {chats[activeContact].map((m, i) => (
          <div key={i} style={{textAlign: m.sender===user? "right" : "left", margin: "8px 0"}}>
            <span style={{background: m.sender===user? "linear-gradient(45deg, #ff69b4, #ffa500)" : "#444", color: "#fff", padding: "8px 12px", borderRadius: "15px", display: "inline-block", maxWidth: "75%"}}>
              {m.image && <img src={m.image} style={{maxWidth: "180px", borderRadius: "10px", display: "block"}}/>}
              {m.audio && <audio src={m.audio} controls style={{width: "180px"}}/>}
              {m.video && <video src={m.video} controls style={{maxWidth: "180px", borderRadius: "10px", display: "block"}}/>}
              {m.doc && <div>📄 {m.doc}</div>}
              {m.text && <div>{m.text}</div>}
            </span>
            <div style={{fontSize: "10px", opacity: 0.6}}>{m.time}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{marginTop: "8px", display: "flex", gap: "8px"}}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()}
          placeholder="Message" style={{flex: 1, padding: "12px", borderRadius: "25px", border: "none", outline: "none"}}/>
        <button onClick={() => sendMessage()} style={{background: "linear-gradient(45deg, #ff69b4, #ffa500)", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px", fontWeight: "bold"}}>Send</button>
      </div>

      <div style={{display: "flex", gap: "10px", justifyContent: "space-around", marginTop: "10px"}}>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{display: "none"}}/>
        <button onClick={() => fileInputRef.current.click()} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>📎 Gallery</button>

        <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoUpload} style={{display: "none"}}/>
        <button onClick={() => videoInputRef.current.click()} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>🎥 Video</button>

        <input type="file" accept=".pdf,.doc,.docx,.txt" ref={docInputRef} onChange={handleDocUpload} style={{display: "none"}}/>
        <button onClick={() => docInputRef.current.click()} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>📄 Doc</button>

        <button onClick={() => toggleRecording('audio')} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>
          {recording && recordingType==='audio'? "🔴 Stop" : "🎤 Voice"}
        </button>

        <button onClick={() => toggleRecording('video')} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>
          {recording && recordingType==='video'? "🔴 Stop" : "📹 Live"}
        </button>
      </div>
    </div>
  )
}
