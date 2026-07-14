import React, { useState, useEffect, useRef } from "react"

export default function App() {
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState(null) // LOGIN STATE
  const [username, setUsername] = useState("")
  const [activeContact, setActiveContact] = useState("Prof")
  const [input, setInput] = useState("")
  const [recording, setRecording] = useState(false)
  const [recordingType, setRecordingType] = useState(null)
  const [typing, setTyping] = useState(false) // TYPING INDICATOR
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const docInputRef = useRef(null)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const chunksRef = useRef([])
  
  const [contacts] = useState({
    Prof: {color: "#ff69b4", personality: "Sweet"},
    Queen: {color: "#ff7f50", personality: "Chill"},
    Indigo: {color: "#6a5acd", personality: "Wise"},
    Boss: {color: "#00bfff", personality: "Motivator"},
    Tech: {color: "#32cd32", personality: "Coder"},
    Gist: {color: "#ffa500", personality: "Gossip"}
  })
  
  const [chats, setChats] = useState({Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: []})
  const [isPremium, setIsPremium] = useState(false) // MONETIZATION
  const chatEndRef = useRef(null)

  // LOAD USER + CHATS
  useEffect(() => {
    const savedUser = localStorage.getItem("crypto-prof-user")
    const savedChats = localStorage.getItem("crypto-prof-chats")
    const savedPremium = localStorage.getItem("crypto-prof-premium")
    if(savedUser) setUser(savedUser)
    if(savedChats) setChats(JSON.parse(savedChats))
    if(savedPremium) setIsPremium(JSON.parse(savedPremium))
  }, [])

  // SAVE CHATS
  useEffect(() => {
    if(user) localStorage.setItem("crypto-prof-chats", JSON.stringify(chats))
  }, [chats, user])

  useEffect(() => {chatEndRef.current?.scrollIntoView({ behavior: "smooth" })}, [chats, activeContact, typing])

  const bgColor = dark? "#0e0e0e" : "#ffffff"
  const textColor = dark? "#ffffff" : "#000"
  const chatBg = dark? "#1a1a1a" : "#f1f1f1"

  // LOGIN
  const handleLogin = () => {
    if(username.trim()) {
      setUser(username)
      localStorage.setItem("crypto-prof-user", username)
    }
  }
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("crypto-prof-user")
  }

  // MONETIZATION
  const handleUpgrade = () => {
    alert("Upgrade to Premium $9.99/mo\n\nYou get:\n1. Unlimited AI messages\n2. Export Chat to PDF\n3. Remove Ads\n\nDemo: Click OK to activate")
    setIsPremium(true)
    localStorage.setItem("crypto-prof-premium", "true")
  }

  // EXPORT CHAT
  const exportChat = () => {
    if(!isPremium) return alert("This is a Premium feature. Please upgrade!")
    const chatText = chats[activeContact].map(m => `[${m.time}] ${m.sender}: ${m.text || m.doc || 'Media'}`).join('\n')
    const blob = new Blob([chatText], {type: 'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeContact}-chat.txt`
    a.click()
  }

  const sendMessage = async (imageUrl = null, audioUrl = null, videoUrl = null, docName = null) => {
    if(!input.trim() &&!imageUrl &&!audioUrl &&!videoUrl &&!docName) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const newMsg = {text: input, image: imageUrl, audio: audioUrl, video: videoUrl, doc: docName, time, sender: "me"}
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], newMsg]}))
    setInput("")
    
    // TYPING INDICATOR
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      aiReply(input, imageUrl, audioUrl, videoUrl, docName)
    }, 1500)
  }

  // REAL AI BRAIN - USING FREE HUGGINGFACE API
  const aiReply = async (msg, imageUrl, audioUrl, videoUrl, docName) => {
    if(docName) return addAiMsg(`Got your document: ${docName} 📄 Let me check it`)
    if(videoUrl) return addAiMsg("Omo this video is fire! 🔥 What are we watching?")
    if(audioUrl) return addAiMsg("I heard your voice note! 🔊 Send more gist")
    if(imageUrl) return addAiMsg("Nice picture! 😍 What is this?")
    
    // REAL AI CALL
    try {
      const personality = contacts[activeContact].personality
      const prompt = `You are ${activeContact}, a ${personality} AI friend. Reply to: "${msg}" in 1 short sentence, casual, friendly.`
      
      const res = await fetch("https://api-inference.huggingface.co/models/gpt2", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({inputs: prompt})
      })
      const data = await res.json()
      const reply = data[0]?.generated_text || "Tell me more"
      addAiMsg(reply)
    } catch {
      addAiMsg("I'm here with you 💖 What else?")
    }
  }
  
  const addAiMsg = (reply) => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: reply, time, sender: "them"}]}))
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
  const clearChat = () => setChats({...chats, [activeContact]: []})

  // LOGIN SCREEN
  if(!user) {
    return (
      <div style={{background: bgColor, color: textColor, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px"}}>
        <h1 style={{color: "#ff69b4", fontSize: "36px"}}>CRYPTO-PROF 💖</h1>
        <p>AI Chat for Everyone</p>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your name" 
          style={{padding: "12px", borderRadius: "10px", border: "none", margin: "10px 0", width: "80%"}}/>
        <button onClick={handleLogin} style={{background: "#ff69b4", color: "#fff", border: "none", padding: "12px 30px", borderRadius: "25px", fontWeight: "bold"}}>
          Start Chatting
        </button>
        <button onClick={handleUpgrade} style={{background: "gold", color: "#000", border: "none", padding: "10px 20px", borderRadius: "20px", marginTop: "10px", fontWeight: "bold"}}>
          👑 Upgrade to Premium
        </button>
      </div>
    )
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "10px"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h1 style={{color: "#ff69b4", fontSize: "24px", margin: "5px 0"}}>CRYPTO-PROF 💖</h1>
        <div>
          <span style={{fontSize: "12px"}}>Hi {user}!</span>
          <button onClick={handleLogout} style={{marginLeft: "10px", background: "#333", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "10px"}}>Logout</button>
        </div>
      </div>
      <p style={{fontSize: "11px"}}>AI Chat - {isPremium? "👑 PREMIUM" : "FREE"} ✓ Saved</p>

      {!isPremium && <button onClick={handleUpgrade} style={{background: "gold", color: "#000", border: "none", padding: "8px 15px", borderRadius: "15px", marginBottom: "10px", fontWeight: "bold", width: "100%"}}>
        Upgrade to Premium $9.99/mo
      </button>}

      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {Object.keys(contacts).map(name => (
          <button key={name} onClick={() => setActiveContact(name)} 
            style={{background: activeContact===name? contacts[name].color : "#333", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "15px", fontSize: "12px"}}>
            {name}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{background: "#555", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "15px", fontSize: "12px"}}>Light</button>
        <button onClick={clearChat} style={{background: "red", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "15px", fontSize: "12px"}}>Clear</button>
        <button onClick={exportChat} style={{background: "green", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "15px", fontSize: "12px"}}>Export</button>
      </div>

      {showCamera && (
        <div style={{background: "#000", borderRadius: "10px", marginBottom: "10px", position: "relative"}}>
          <video ref={videoRef} autoPlay muted playsInline style={{width: "100%", borderRadius: "10px"}}/>
          <div style={{position: "absolute", top: "10px", left: "10px", background: "red", color: "#fff", padding: "5px 10px", borderRadius: "15px", fontSize: "12px"}}>🔴 REC</div>
        </div>
      )}

      <div style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "50vh", overflowY: "auto"}}>
        <h3>{activeContact} ({contacts[activeContact].personality})</h3>
        {chats[activeContact].map((m, i) => (
          <div key={i} style={{textAlign: m.sender==="me"? "right" : "left", margin: "8px 0"}}>
            <span style={{background: m.sender==="me"? "#ff69b4" : "#444", color: "#fff", padding: "8px 12px", borderRadius: "15px", display: "inline-block", maxWidth: "75%"}}>
              {m.image && <img src={m.image} style={{maxWidth: "180px", borderRadius: "10px", display: "block"}}/>}
              {m.audio && <audio src={m.audio} controls style={{width: "180px"}}/>}
              {m.video && <video src={m.video} controls style={{maxWidth: "180px", borderRadius: "10px", display: "block"}}/>}
              {m.doc && <div style={{padding: "8px", background: "#333", borderRadius: "8px", fontSize: "12px"}}>📄 {m.doc}</div>}
              {m.text && <div>{m.text}</div>}
            </span>
            <div style={{fontSize: "10px", opacity: 0.6}}>{m.time}</div>
          </div>
        ))}
        {typing && <div style={{fontSize: "12px", opacity: 0.7}}>{activeContact} is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div style={{marginTop: "8px"}}>
        <div style={{display: "flex", gap: "8px", marginBottom: "8px"}}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()}
            placeholder="Message" style={{flex: 1, padding: "12px", borderRadius: "25px", border: "none", outline: "none", fontSize: "14px"}}/>
          <button onClick={() => sendMessage()} style={{background: "#ff69b4", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px", fontWeight: "bold"}}>Send</button>
        </div>

        <div style={{display: "flex", gap: "10px", justifyContent: "space-around"}}>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{display: "none"}}/>
          <button onClick={() => fileInputRef.current.click()} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}><div style={{background: "#555", padding: "10px", borderRadius: "50%"}}>📎</div>Gallery</button>

          <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoUpload} style={{display: "none"}}/>
          <button onClick={() => videoInputRef.current.click()} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}><div style={{background: "#555", padding: "10px", borderRadius: "50%"}}>🎥</div>Video</button>

          <input type="file" accept=".pdf,.doc,.docx,.txt" ref={docInputRef} onChange={handleDocUpload} style={{display: "none"}}/>
          <button onClick={() => docInputRef.current.click()} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}><div style={{background: "#555", padding: "10px", borderRadius: "50%"}}>📄</div>Doc</button>

          <button onClick={() => toggleRecording('audio')} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>
            <div style={{background: recording && recordingType==='audio'? "red" : "#555", padding: "10px", borderRadius: "50%"}}>{recording && recordingType==='audio'? "🔴" : "🎤"}</div>
            {recording && recordingType==='audio'? "Stop" : "Voice"}
          </button>

          <button onClick={() => toggleRecording('video')} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>
            <div style={{background: recording && recordingType==='video'? "red" : "#555", padding: "10px", borderRadius: "50%"}}>{recording && recordingType==='video'? "🔴" : "📹"}</div>
            {recording && recordingType==='video'? "Stop" : "Live"}
          </button>
        </div>
      </div>
    </div>
  )
}
