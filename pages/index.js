import React, { useState, useEffect, useRef } from "react"

export default function App() {
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({name: "", bio: ""})
  const [activeContact, setActiveContact] = useState("Group")
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
    Group: "#ff1493",
    Prof: "#ff69b4", Queen: "#ff7f50", Indigo: "#6a5acd", 
    Boss: "#00bfff", Tech: "#32cd32", Gist: "#ffa500"
  })
  
  const [chats, setChats] = useState({
    Group: [],
    Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: []
  })
  const chatEndRef = useRef(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("crypto-prof-user")
    const savedChats = localStorage.getItem("crypto-prof-chats")
    const savedProfile = localStorage.getItem("crypto-prof-profile")
    
    if(savedUser) setUser(savedUser)
    if(savedProfile) setProfile(JSON.parse(savedProfile))
    if(savedChats) setChats(JSON.parse(savedChats))
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

  const sendMessage = (imageUrl = null, audioUrl = null, videoUrl = null, docName = null) => {
    if(!input.trim() &&!imageUrl &&!audioUrl &&!videoUrl &&!docName) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const newMsg = {text: input, image: imageUrl, audio: audioUrl, video: videoUrl, doc: docName, time, sender: user}
    
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], newMsg]}))
    setInput("")
    
    setTimeout(() => {
      if(activeContact === "Group") {
        groupReply()
      } else {
        aiReply(activeContact)
      }
    }, 1000)
  }

  const groupReply = () => {
    const aiNames = ["Prof", "Queen", "Indigo", "Boss", "Tech", "Gist"]
    const replies = [
      "Prof: Great point! Let me break this down 💡",
      "Queen: I agree, and also... 👑",
      "Indigo: From tech angle, this is smart 🔧",
      "Boss: Let's make money from this! 💰",
      "Tech: I can code that for you 💻",
      "Gist: Omo this is interesting o 😂"
    ]
    aiNames.forEach((name, index) => {
      setTimeout(() => {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        setChats(prev => ({...prev, Group: [...prev.Group, {text: replies[index], time, sender: name}]}))
      }, index * 800)
    })
  }

  const aiReply = (name) => {
    const reply = "I'm here for you 💖"
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    setChats(prev => ({...prev, [name]: [...prev[name], {text: reply, time, sender: name}]}))
  }

  const handleFileUpload = (e) => {const file = e.target.files[0]; if(file) sendMessage(URL.createObjectURL(file))}
  const handleVideoUpload = (e) => {const file = e.target.files[0]; if(file) sendMessage(null, null, URL.createObjectURL(file))}
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
      const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
      mediaStreamRef.current = stream
      if(videoRef.current) videoRef.current.srcObject = stream
    } catch(err) {alert("Camera Error"); setShowCamera(false)}
  }

  const startRecording = async (type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(type === 'video'? { audio: true, video: true } : { audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      mediaRecorderRef.current.ondataavailable = (e) => {if(e.data.size > 0) chunksRef.current.push(e.data)}
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {type: type === 'video'? 'video/webm' : 'audio/webm'})
        const url = URL.createObjectURL(blob)
        if(type === 'video') sendMessage(null, null, url)
        else sendMessage(null, url)
      }
      mediaRecorderRef.current.start()
      setRecording(true)
      setRecordingType(type)
    } catch(err) {alert("Recording Error")}
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
        <h1 style={{fontSize: "42px", fontWeight: "900", color: "#ff69b4", margin: "5px 0"}}>
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
          background: "#ff69b4", 
          color: "#fff", 
          border: "none", 
          padding: "14px 40px", 
          borderRadius: "25px", 
          fontWeight: "bold",
          fontSize: "16px",
          marginTop: "10px"
        }}>
          Join PINKCHAT
        </button>
      </div>
    )
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "10px"}}>
      <div style={{background: "#ff69b4", padding: "10px", borderRadius: "15px", marginBottom: "10px", textAlign: "center"}}>
        <h1 style={{color: "#fff", fontSize: "22px", margin: "0", fontWeight: "900"}}>PINKCHAT 💖</h1>
        <p style={{color: "#fff", fontSize: "10px", margin: "0"}}>by CRYPTO-PROF | {profile.bio}</p>
      </div>

      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {Object.keys(contacts).map(name => (
          <button key={name} onClick={() => setActiveContact(name)} 
            style={{background: activeContact===name? contacts[name] : "#333", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>
            {name === "Group"? "👥 Group" : name}
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
        <h3>{activeContact} {activeContact==="Group" && "👥"}</h3>
        {chats[activeContact].map((m, i) => (
          <div key={i} style={{textAlign: m.sender===user? "right" : "left", margin: "8px 0"}}>
            <div style={{fontSize: "10px", color: contacts[m.sender] || "#aaa", fontWeight: "bold"}}>{m.sender}</div>
            <span style={{background: m.sender===user? "#ff69b4" : "#444", color: "#fff", padding: "8px 12px", borderRadius: "15px", display: "inline-block", maxWidth: "75%"}}>
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
          placeholder="Message..." style={{flex: 1, padding: "12px", borderRadius: "25px", border: "none", outline: "none"}}/>
        <button onClick={() => sendMessage()} style={{background: "#ff69b4", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px", fontWeight: "bold"}}>Send</button>
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
