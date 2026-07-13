import React, { useState, useEffect, useRef } from "react"

export default function App() {
  const [dark, setDark] = useState(true)
  const [activeContact, setActiveContact] = useState("Prof")
  const [input, setInput] = useState("")
  const [contacts, setContacts] = useState({
    Prof: {color: "#ff69b4", img: "https://i.pravatar.cc/150?img=1", personality: "Sweet"},
    Coral: {color: "#ff7f50", img: "https://i.pravatar.cc/150?img=3", personality: "Chill"},
    Indigo: {color: "#6a5acd", img: "https://i.pravatar.cc/150?img=5", personality: "Wise"},
    Boss: {color: "#00bfff", img: "https://i.pravatar.cc/150?img=11", personality: "Motivator"}
  })
  const [chats, setChats] = useState({
    Prof: [{text: "Hey! Ready to test Crypto-Prof? 💖", time: "10:30 AM", sender: "them"}],
    Coral: [{text: "Hi! This is Coral", time: "10:31 AM", sender: "them"}],
    Indigo: [{text: "Indigo here! 👋", time: "10:32 AM", sender: "them"}],
    Boss: [{text: "Let's make money today. What we building? 💼", time: "10:33 AM", sender: "them"}]
  })
  const chatEndRef = useRef(null)

  const bgColor = dark? "#0e0e0e" : "#ffffff"
  const textColor = dark? "#ffffff" : "#000"
  const chatBg = dark? "#1a1a1a" : "#f1f1f1"
  const aiMsgBg = dark? "#444" : "#e0e0e0"
  const aiMsgText = dark? "#fff" : "#000" // FIX 1: Text readable in light mode

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats, activeContact])

  const sendMessage = () => {
    if(!input.trim()) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const newMsg = {text: input, time, sender: "me"}
    setChats({...chats, [activeContact]: [...chats[activeContact], newMsg]})
    setInput("")
    setTimeout(() => aiReply(input), 800)
  }

  const aiReply = (msg) => {
    const personality = contacts[activeContact].personality
    let reply = "Tell me more"
    if(personality === "Sweet") {
      if(msg.includes("sad")) reply = "come here, I got you. You deserve better 💖"
      else reply = "aww I love that! You're making me blush 🥰"
    }
    if(personality === "Chill") reply = "no stress bro, we dey chill 😎"
    if(personality === "Wise") reply = "Interesting. Have you considered the bigger picture?"
    if(personality === "Motivator") reply = "That's fire! Now let's go 10x it. What's the next move?"
    
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: reply, time, sender: "them"}]}))
  }

  const clearChat = () => {
    setChats({...chats, [activeContact]: []})
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "20px", transition: "all 0.3s", fontFamily: "Arial"}}>
      
      <h1 style={{color: "#ff69b4", fontSize: "32px", fontWeight: "bold", letterSpacing: "2px"}}>
        CRYPTO-PROF 💖
      </h1>
      <p style={{fontSize: "12px", opacity: 0.7, marginTop: "-5px"}}>
        AI Chat by Crypto-Prof
      </p>

      <div style={{margin: "10px 0", display: "flex", gap: "10px", flexWrap: "wrap"}}>
        {Object.keys(contacts).map(name => (
          <button key={name} onClick={() => setActiveContact(name)} 
            style={{background: activeContact===name? contacts[name].color : "#333", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold"}}>
            {name}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{background: "#555", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "20px"}}>
          Toggle Light
        </button>
        <button onClick={clearChat} style={{background: "red", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "20px"}}>
          Clear Chat
        </button>
      </div>

      <div style={{background: chatBg, padding: "15px", borderRadius: "10px", height: "400px", overflowY: "auto"}}>
        <h3>{activeContact} ({contacts[activeContact].personality})</h3>
        {chats[activeContact].map((m, i) => (
          <div key={i} style={{textAlign: m.sender==="me"? "right" : "left", margin: "8px 0"}}>
            <span style={{background: m.sender==="me"? "#ff69b4" : aiMsgBg, color: m.sender==="me"? "#fff" : aiMsgText, padding: "8px 12px", borderRadius: "15px", display: "inline-block", maxWidth: "70%"}}>
              {m.text}
            </span>
            <div style={{fontSize: "10px", opacity: 0.6}}>{m.time}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{display: "flex", marginTop: "10px"}}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()}
          placeholder="Type a message..." 
          style={{flex: 1, padding: "10px", borderRadius: "20px", border: "none", outline: "none"}}/>
        <button onClick={sendMessage} style={{marginLeft: "10px", background: "#ff69b4", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold"}}>
          Send
        </button>
      </div>
    </div>
  )
}
