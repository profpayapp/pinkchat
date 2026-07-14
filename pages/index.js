import React, { useState, useEffect, useRef } from "react"

export default function App() {
  const [dark, setDark] = useState(true)
  const [activeContact, setActiveContact] = useState("Prof")
  const [input, setInput] = useState("")
  const [recording, setRecording] = useState(false)
  const [recordingType, setRecordingType] = useState(null)
  const [showCamera, setShowCamera] = useState(false) // NEW: Camera preview
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const docInputRef = useRef(null)
  const videoRef = useRef(null) // NEW: for preview
  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const chunksRef = useRef([])
  
  const [contacts] = useState({
    Prof: {color: "#ff69b4", img: "https://i.pravatar.cc/150?img=1", personality: "Sweet"},
    Queen: {color: "#ff7f50", img: "https://i.pravatar.cc/150?img=3", personality: "Chill"},
    Indigo: {color: "#6a5acd", img: "https://i.pravatar.cc/150?img=5", personality: "Wise"},
    Boss: {color: "#00bfff", img: "https://i.pravatar.cc/150?img=11", personality: "Motivator"},
    Tech: {color: "#32cd32", img: "https://i.pravatar.cc/150?img=8", personality: "Coder"},
    Gist: {color: "#ffa500", img: "https://i.pravatar.cc/150?img=15", personality: "Gossip"}
  })
  
  const [chats, setChats] = useState({Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: []})
  const chatEndRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem("crypto-prof-chats")
    if(saved) setChats(JSON.parse(saved))
  }, [])
  useEffect(() => {localStorage.setItem("crypto-prof-chats", JSON.stringify(chats))}, [chats])
  useEffect(() => {chatEndRef.current?.scrollIntoView({ behavior: "smooth" })}, [chats, activeContact])

  const bgColor = dark? "#0e0e0e" : "#ffffff"
  const textColor = dark? "#ffffff" : "#000"
  const chatBg = dark? "#1a1a1a" : "#f1f1f1"
  const aiMsgBg = dark? "#444" : "#e0e0e0"
  const aiMsgText = dark? "#fff" : "#000"

  const sendMessage = (imageUrl = null, audioUrl = null, videoUrl = null, docName = null) => {
    if(!input.trim() &&!imageUrl &&!audioUrl &&!videoUrl &&!docName) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const newMsg = {text: input, image: imageUrl, audio: audioUrl, video: videoUrl, doc: docName, time, sender: "me"}
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], newMsg]}))
    setInput("")
    setTimeout(() => aiReply(input, imageUrl, audioUrl, videoUrl, docName), 800)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if(file) sendMessage(URL.createObjectURL(file))
  }
  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if(file && file.type.startsWith('video')) sendMessage(null, null, URL.createObjectURL(file))
  }
  const handleDocUpload = (e) => {
    const file = e.target.files[0]
    if(file) sendMessage(null, null, null, file.name)
  }

  const toggleRecording = async (type) => {
    if(recording && recordingType === type) {
      stopRecording()
    } else {
      if(recording) stopRecording()
      if(type === 'video') {
        setShowCamera(true) // Show camera first
        await startCameraPreview()
      }
      startRecording(type)
    }
  }

  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: "user"}, audio: true})
      mediaStreamRef.current = stream
      if(videoRef.current) videoRef.current.srcObject = stream
    } catch(err) {
      alert("Camera Error: " + err.message)
      setShowCamera(false)
    }
  }

  const getMimeType = (type) => {
    if(type === 'audio') return MediaRecorder.isTypeSupported('audio/webm')? 'audio/webm' : 'audio/mp4'
    const types = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
    return types.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm'
  }

  const startRecording = async (type) => {
    try {
      if(!mediaStreamRef.current) {
        const constraints = type === 'video'? { audio: true, video: {facingMode: "user"} } : { audio: true }
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia(constraints)
      }
      
      const mimeType = getMimeType(type)
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, {mimeType})
      chunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (e) => {if(e.data.size > 0) chunksRef.current.push(e.data)}
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {type: mimeType})
        const url = URL.createObjectURL(blob)
        if(type === 'video') sendMessage(null, null, url)
        else sendMessage(null, url)
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
        mediaStreamRef.current = null
        setShowCamera(false)
      }
      
      mediaRecorderRef.current.start(100)
      setRecording(true)
      setRecordingType(type)
    } catch(err) {
      alert("Recording Error: " + err.message)
      setRecording(false)
    }
  }

  const stopRecording = () => {
    if(mediaRecorderRef.current && mediaRecorderRef.current.state!== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
    setRecordingType(null)
  }

  const aiReply = (msg, imageUrl, audioUrl, videoUrl, docName) => {
    const personality = contacts[activeContact].personality
    let reply = "Tell me more"
    if(docName) reply = `Got your document: ${docName} 📄 Let me check it`
    else if(videoUrl) reply = "Omo this video is fire! 🔥 What are we watching?"
    else if(audioUrl) reply = "I heard your voice note! 🔊 Send more gist"
    else if(imageUrl) reply = "Nice picture! 😍 What is this?"
    else {
      if(personality === "Sweet") reply = "aww I love that! You're making me blush 🥰"
      if(personality === "Chill") reply = "no stress babe, we dey chill 😎"
      if(personality === "Wise") reply = "Interesting. Have you considered the bigger picture?"
      if(personality === "Motivator") reply = "That's fire! Now let's go 10x it. What's the next move?"
      if(personality === "Coder") reply = "That code is clean! But we can optimize it more 💻"
      if(personality === "Gossip") reply = "Nooo tell me everything! I need all the tea ☕😂"
    }
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: reply, time, sender: "them"}]}))
  }

  const clearChat = () => setChats({...chats, [activeContact]: []})

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "10px", fontFamily: "Arial"}}>
      <h1 style={{color: "#ff69b4", fontSize: "28px", fontWeight: "bold", margin: "5px 0"}}>CRYPTO-PROF 💖</h1>
      <p style={{fontSize: "11px", opacity: 0.7}}>AI Chat by Crypto-Prof - PREMIUM ✓ Saved</p>

      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {Object.keys(contacts).map(name => (
          <button key={name} onClick={() => setActiveContact(name)} 
            style={{background: activeContact===name? contacts[name].color : "#333", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "15px", fontSize: "12px"}}>
            {name}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{background: "#555", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "15px", fontSize: "12px"}}>Light</button>
        <button onClick={clearChat} style={{background: "red", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "15px", fontSize: "12px"}}>Clear</button>
      </div>

      {/* CAMERA PREVIEW */}
      {showCamera && (
        <div style={{background: "#000", borderRadius: "10px", marginBottom: "10px", position: "relative"}}>
          <video ref={videoRef} autoPlay muted playsInline style={{width: "100%", borderRadius: "10px"}}/>
          <div style={{position: "absolute", top: "10px", left: "10px", background: "red", color: "#fff", padding: "5px 10px", borderRadius: "15px", fontSize: "12px"}}>
            🔴 REC
          </div>
        </div>
      )}

      <div style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "50vh", overflowY: "auto"}}>
        <h3>{activeContact} ({contacts[activeContact].personality})</h3>
        {chats[activeContact].map((m, i) => (
          <div key={i} style={{textAlign: m.sender==="me"? "right" : "left", margin: "8px 0"}}>
            <span style={{background: m.sender==="me"? "#ff69b4" : aiMsgBg, color: m.sender==="me"? "#fff" : aiMsgText, padding: "8px 12px", borderRadius: "15px", display: "inline-block", maxWidth: "75%"}}>
              {m.image && <img src={m.image} style={{maxWidth: "180px", borderRadius: "10px", display: "block"}}/>}
              {m.audio && <audio src={m.audio} controls style={{width: "180px"}}/>}
              {m.video && <video src={m.video} controls style={{maxWidth: "180px", borderRadius: "10px", display: "block"}}/>}
              {m.doc && <div style={{padding: "8px", background: "#333", borderRadius: "8px", fontSize: "12px"}}>📄 {m.doc}</div>}
              {m.text && <div>{m.text}</div>}
            </span>
            <div style={{fontSize: "10px", opacity: 0.6}}>{m.time}</div>
          </div>
        ))}
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
