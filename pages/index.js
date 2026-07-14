import React, { useState, useEffect, useRef } from "react"

export default function App() {
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState("")
  const [profile, setProfile] = useState({name: "", bio: ""})
  const [activeContact, setActiveContact] = useState("Prof")
  const [input, setInput] = useState("")
  const [chats, setChats] = useState({
    Group: [], // NEW
    Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: []
  })
  const chatEndRef = useRef(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("crypto-prof-user") || ""
    const savedChats = localStorage.getItem("crypto-prof-chats")
    const savedProfile = localStorage.getItem("crypto-prof-profile")
    
    setUser(savedUser)
    setProfile(savedProfile? JSON.parse(savedProfile) : {name: "", bio: ""})
    setChats(savedChats? JSON.parse(savedChats) : {
      Group: [], Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: []
    })
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

  const sendMessage = () => {
    if(!input.trim()) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const newMsg = {text: input, time, sender: user}
    
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], newMsg]}))
    setInput("")
    
    setTimeout(() => {
      const reply = activeContact === "Group"? "Group: All 6 AIs will reply soon 👥" : "I'm here for you 💖"
      setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: reply, time, sender: activeContact}]}))
    }, 1000)
  }

  const clearChat = () => {setChats({...chats, [activeContact]: []})}
  const contacts = ["Group", "Prof", "Queen", "Indigo", "Boss", "Tech", "Gist"] // ADDED GROUP

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
      <div style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", padding: "10px", borderRadius: "15px", marginBottom: "10px", textAlign: "center"}}>
        <h1 style={{color: "#fff", fontSize: "22px", margin: "0", fontWeight: "900"}}>PINKCHAT 💖</h1>
        <p style={{color: "#fff", fontSize: "10px", margin: "0"}}>by CRYPTO-PROF | {profile.bio}</p>
      </div>

      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {contacts.map(name => (
          <button key={name} onClick={() => setActiveContact(name)} 
            style={{background: activeContact===name? "#ff69b4" : "#333", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px", fontWeight: name==="Group"?"bold":"normal"}}>
            {name === "Group"? "👥 Group" : name}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{background: "#555", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Light</button>
        <button onClick={clearChat} style={{background: "red", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Clear</button>
      </div>

      <div style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "60vh", overflowY: "auto"}}>
        <h3>{activeContact} {activeContact==="Group" && "👥"}</h3>
        {chats[activeContact].map((m, i) => (
          <div key={i} style={{textAlign: m.sender===user? "right" : "left", margin: "8px 0"}}>
            <div style={{fontSize: "10px", fontWeight: "bold"}}>{m.sender}</div>
            <span style={{background: m.sender===user? "#ff69b4" : "#444", color: "#fff", padding: "8px 12px", borderRadius: "15px", display: "inline-block", maxWidth: "75%"}}>
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
        <button onClick={sendMessage} style={{background: "#ff69b4", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px", fontWeight: "bold"}}>Send</button>
      </div>

      <div style={{display: "flex", gap: "10px", justifyContent: "space-around", marginTop: "10px"}}>
        <button style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>📎 Gallery</button>
        <button style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>🎥 Video</button>
        <button style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>📄 Doc</button>
        <button style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>🎤 Voice</button>
        <button style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>📹 Live</button>
      </div>
    </div>
  )
}
