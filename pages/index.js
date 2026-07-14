import React, { useState, useEffect, useRef } from "react"

export default function App() {
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState("")
  const [profile, setProfile] = useState({name: "", bio: ""})
  const [activeContact, setActiveContact] = useState("Prof")
  const [input, setInput] = useState("")
  const [chats, setChats] = useState({
    Group: [], Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: []
  })
  const [recording, setRecording] = useState(false)
  const chatEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const lastAudioRef = useRef(null)

  const contactColors = {
    Group: "#ff1493", Prof: "#ff69b4", Queen: "#ff7f50", Indigo: "#6a5acd", 
    Boss: "#00bfff", Tech: "#32cd32", Gist: "#ffa500"
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("crypto-prof-user") || ""
    const savedProfile = localStorage.getItem("crypto-prof-profile")
    const savedChats = localStorage.getItem("crypto-prof-chats")
    
    setUser(savedUser)
    setProfile(savedProfile? JSON.parse(savedProfile) : {name: "", bio: ""})
    
    if(savedChats) {
      const parsed = JSON.parse(savedChats)
      if(!parsed.Group) parsed.Group = []
      setChats(parsed)
    }
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

  const playBeep = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    audio.volume = 0.3
    audio.play()
  }

  const handleLogin = () => {
    if(profile.name.trim()) {
      setUser(profile.name)
      localStorage.setItem("crypto-prof-user", profile.name)
      localStorage.setItem("crypto-prof-profile", JSON.stringify(profile))
    }
  }

  const sendMessage = () => {
    if(!input.trim()) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const newMsg = {text: input, time, sender: user}
    
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

  const handleGallery = () => {fileInputRef.current?.click()}

  const handleFileSend = (e) => {
    const file = e.target.files[0]
    if(!file) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const msg = {text: `📎 Sent: ${file.name}`, time, sender: user}
    
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], msg]}))
    
    setTimeout(() => {
      const reply = activeContact==="Group"? "Group: Nice file! 👥" : "I got your file! 📎"
      setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: reply, time, sender: activeContact}]}))
    }, 1000)
  }

  // CHANGED: TAP TO START/STOP
  const toggleRecording = async () => {
    if(!recording) {
      // START RECORDING
      playBeep()
      setRecording(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }
      
      mediaRecorderRef.current.onstop = () => {
        playBeep()
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        lastAudioRef.current = audioUrl
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        const msg = {text: `🎤 Voice Note ▶️ Tap to play`, time, sender: user, hasAudio: true}
        setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], msg]}))
        
        setTimeout(() => {
          const reply = activeContact==="Group"? "Group: I heard your voice note! 👥" : "I heard your voice note! 🔊"
          setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: reply, time, sender: activeContact}]}))
        }, 1000)
        
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
    } else {
      // STOP RECORDING
      setRecording(false)
      mediaRecorderRef.current?.stop()
    }
  }

  const playLastAudio = () => {
    if(lastAudioRef.current) {
      new Audio(lastAudioRef.current).play()
    }
  }

  const groupReply = () => {
    const aiList = [
      {name: "Prof", text: "Prof: Great point! Let me break this down 💡"},
      {name: "Queen", text: "Queen: I agree with Prof, and also... 👑"},
      {name: "Indigo", text: "Indigo: From tech angle, this is smart 🔧"},
      {name: "Boss", text: "Boss: Let's make money from this! 💰"},
      {name: "Tech", text: "Tech: I can code that for you 💻"},
      {name: "Gist", text: "Gist: Omo this is interesting o 😂"}
    ]
    
    aiList.forEach((ai, index) => {
      setTimeout(() => {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        setChats(prev => ({...prev, Group: [...prev.Group, {text: ai.text, time, sender: ai.name}]}))
      }, (index + 1) * 700)
    })
  }

  const aiReply = (name) => {
    const replies = {
      Prof: "Prof: Let me explain this properly 💡",
      Queen: "Queen: You look good today 👑",
      Indigo: "Indigo: That's a smart question 🔧",
      Boss: "Boss: We go make money 💰",
      Tech: "Tech: I can help you build that 💻",
      Gist: "Gist: Abeg tell me more gist 😂"
    }
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    setChats(prev => ({...prev, [name]: [...prev[name], {text: replies[name], time, sender: name}]}))
  }

  const clearChat = () => {setChats({...chats, [activeContact]: []})}
  const clearAllData = () => {localStorage.clear(); window.location.reload()}
  const contacts = ["Group", "Prof", "Queen", "Indigo", "Boss", "Tech", "Gist"]

  if(!user) {
    return (
      <div style={{background: bgColor, color: textColor, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px"}}>
        <div style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", padding: "20px", borderRadius: "20px", textAlign: "center", marginBottom: "20px"}}>
          <h1 style={{fontSize: "32px", fontWeight: "900", color: "#fff", margin: "0"}}>PINKCHAT 💖</h1>
          <p style={{fontSize: "12px", color: "#fff", margin: "0"}}>by CRYPTO-PROF | AI App Owner</p>
        </div>
        
        <input 
          value={profile.name} 
          onChange={e => setProfile({...profile, name: e.target.value})} 
          placeholder="Enter Username" 
          style={{padding: "12px", borderRadius: "10px", border: "2px solid #ff69b4", margin: "8px 0", width: "80%", background: "#222", color: "#fff"}}
        />
        <input 
          value={profile.bio} 
          onChange={e => setProfile({...profile, bio: e.target.value})} 
          placeholder="Bio" 
          style={{padding: "12px", borderRadius: "10px", border: "2px solid #ff69b4", margin: "8px 0", width: "80%", background: "#222", color: "#fff"}}
        />
        
        <button onClick={handleLogin} style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", color: "#fff", border: "none", padding: "14px 40px", borderRadius: "25px", fontWeight: "bold", fontSize: "16px", marginTop: "10px"}}>
          Join PINKCHAT
        </button>
      </div>
    )
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "10px"}}>
      <input type="file" ref={fileInputRef} onChange={handleFileSend} style={{display: "none"}} />
      
      <div style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", padding: "10px", borderRadius: "15px", marginBottom: "10px", textAlign: "center"}}>
        <h1 style={{color: "#fff", fontSize: "22px", margin: "0", fontWeight: "900"}}>PINKCHAT 💖</h1>
        <p style={{color: "#fff", fontSize: "10px", margin: "0"}}>by CRYPTO-PROF | {profile.bio}</p>
      </div>

      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {contacts.map(name => (
          <button key={name} onClick={() => setActiveContact(name)} 
            style={{background: activeContact===name? contactColors[name] : "#333", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px", fontWeight: name==="Group"?"bold":"normal"}}>
            {name === "Group"? "👥 Group" : name}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{background: "#555", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Light</button>
        <button onClick={clearChat} style={{background: "red", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Clear</button>
        <button onClick={clearAllData} style={{background: "orange", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Reset</button>
      </div>

      <div style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "60vh", overflowY: "auto"}}>
        <h3>{activeContact} {activeContact==="Group" && "👥 6 AIs"}</h3>
        {chats[activeContact].map((m, i) => (
          <div key={i} style={{textAlign: m.sender===user? "right" : "left", margin: "8px 0"}}>
            <div style={{fontSize: "10px", color: contactColors[m.sender] || "#aaa", fontWeight: "bold"}}>{m.sender}</div>
            <span 
              onClick={() => m.hasAudio && playLastAudio()}
              style={{background: m.sender===user? "linear-gradient(90deg, #ff69b4, #ffa500)" : "#444", color: "#fff", padding: "8px 12px", borderRadius: "15px", display: "inline-block", maxWidth: "75%", cursor: m.hasAudio? "pointer" : "default"}}
            >
              {m.text}
            </span>
            <div style={{fontSize: "10px", opacity: 0.6}}>{m.time}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{marginTop: "8px", display: "flex", gap: "8px"}}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()}
          placeholder="Message..." style={{flex: 1, padding: "12px", borderRadius: "25px", border: "none", outline: "none"}}/>
        <button onClick={sendMessage} style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px", fontWeight: "bold"}}>Send</button>
      </div>

      <div style={{display: "flex", gap: "10px", justifyContent: "space-around", marginTop: "10px"}}>
        <button onClick={handleGallery} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>📎 Gallery</button>
        <button style={{background: "none", border: "none", color: "#555", fontSize: "10px"}}>🎥 Video</button>
        <button style={{background: "none", border: "none", color: "#555", fontSize: "10px"}}>📄 Doc</button>
        
        {/* TAP TO START/STOP */}
        <button 
          onClick={toggleRecording}
          style={{
            background: recording? "red" : "linear-gradient(90deg, #ff69b4, #ffa500)", 
            border: "none", 
            color: "#fff", 
            fontSize: "11px",
            padding: "8px 14px",
            borderRadius: "20px",
            fontWeight: "bold"
          }}>
          🎤 {recording? "Stop" : "Talk"}
        </button>
        
        <button style={{background: "none", border: "none", color: "#555", fontSize: "10px"}}>📹 Live</button>
      </div>
    </div>
  )
}
