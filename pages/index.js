import { useState, useEffect } from "react"

export default function Home() {
  const [theme, setTheme] = useState("light")
  const [activeContact, setActiveContact] = useState("Luna")
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chats, setChats] = useState({
    Luna: [{text: "Hey! Ready to test PinkChat? 💖", time: "10:30 AM", sender: "them"}],
    Coral: [{text: "Hi! This is Coral", time: "10:31 AM", sender: "them"}],
    Indigo: [{text: "Indigo here! 👋", time: "10:32 AM", sender: "them"}]
  })

  const contacts = {
    Luna: {color: "#ff69b4", img: "https://i.pravatar.cc/150?img=1"},
    Coral: {color: "#ff7f50", img: "https://i.pravatar.cc/150?img=3"},
    Indigo: {color: "#6a5acd", img: "https://i.pravatar.cc/150?img=5"}
  }

  useEffect(() => {
    const savedChats = localStorage.getItem("pinkchat-chats")
    const savedTheme = localStorage.getItem("pinkchat-theme")
    if(savedChats) setChats(JSON.parse(savedChats))
    if(savedTheme) setTheme(savedTheme)
  }, [])

  useEffect(() => {
    localStorage.setItem("pinkchat-chats", JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    localStorage.setItem("pinkchat-theme", theme)
  }, [theme])

  const bgColor = theme === "dark"? "#0f0f0f" : "#fff0f5"
  const textColor = theme === "dark"? "#fff" : "#000"
  const chatBg = theme === "dark"? "#1a1a1a" : "#ffe4ec"
  const buttonBg = theme === "dark"? "#333" : "#fff"

  const getSmartReply = (contact, userMsg) => {
    const msg = userMsg.toLowerCase().replace(/["'.,!?]/g, "")
    if(contact === "Luna") {
      if(msg.includes("sad") || msg.includes("bad")) return "come here, I got you. You deserve better 💖"
      if(msg.includes("how")) return "I'm amazing now that you're here 🥰 how are you?"
      return ["you're so sweet", "tell me more", "you always make my day"][Math.floor(Math.random()*3)]
    }
    if(contact === "Coral") {
      if(msg.includes("ok")) return "yeah I'm good bro, just chilling. you?"
      if(msg.includes("bro")) return "yo what's good bro 👀"
      return ["bet", "fr??", "say less", "no cap"][Math.floor(Math.random()*4)]
    }
    if(contact === "Indigo") {
      if(msg.includes("ok")) return "I'm okay, thank you for checking on me 💜"
      return ["That makes sense", "I'm listening", "You got this 💜"][Math.floor(Math.random()*3)]
    }
  }

  const sendMessage = () => {
    if(message.trim() === "") return
    const newMsg = {text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "me"}
    const updatedChats = {...chats, [activeContact]: [...chats[activeContact], newMsg]}
    setChats(updatedChats)
    setMessage("")
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const replyText = getSmartReply(activeContact, message)
      const replyMsg = {text: replyText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "them"}
      setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], replyMsg]}))
    }, 2000)
  }

  // NEW FUNCTION: CLEAR CHAT
  const clearChat = () => {
    if(confirm(`Clear chat with ${activeContact}?`)) {
      setChats(prev => ({
       ...prev, 
        [activeContact]: [{text: `Chat with ${activeContact} started`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "them"}]
      }))
    }
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "20px", transition: "all 0.3s"}}>
      
      <h1 style={{color: "#ff69b4"}}>Crypto-Prof</h1>
      
      <div style={{margin: "10px 0", display: "flex", gap: "10px"}}>
        {Object.keys(contacts).map(contact => (
          <button 
            key={contact}
            onClick={() => setActiveContact(contact)}
            style={{display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", 
              background: activeContact === contact? contacts[contact].color : buttonBg, 
              color: activeContact === contact? "#fff" : textColor, 
              border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold"}}
          >
            <img src={contacts[contact].img} style={{width: "30px", height: "30px", borderRadius: "50%"}} />
            {contact}
          </button>
        ))}
      </div>

      <div style={{display: "flex", gap: "10px"}}>
        <button 
          onClick={() => setTheme(theme === "light"? "dark" : "light")}
          style={{padding: "10px 20px", borderRadius: "8px", cursor: "pointer", margin: "10px 0", border: "none"}}
        >
          Toggle {theme === "light"? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* NEW CLEAR BUTTON */}
        <button 
          onClick={clearChat}
          style={{padding: "10px 20px", borderRadius: "8px", cursor: "pointer", margin: "10px 0", border: "none", background: "#ff4444", color: "#fff"}}
        >
          🗑️ Clear Chat
        </button>
      </div>

      <div style={{display: "flex", alignItems: "center", gap: "10px", margin: "10px 0"}}>
        <img src={contacts[activeContact].img} style={{width: "40px", height: "40px", borderRadius: "50%"}} />
        <h2 style={{margin: 0}}>{activeContact}</h2>
      </div>
      
      <div style={{background: chatBg, borderRadius: "10px", padding: "15px", margin: "10px 0", minHeight: "300px", overflowY: "auto"}}>
        {chats[activeContact].map((msg, i) => (
          <div key={i} style={{display: "flex", justifyContent: msg.sender === "me"? "flex-end" : "flex-start", margin: "8px 0"}}>
            <div style={{
              background: msg.sender === "me"? "#ff69b4" : "#fff", 
              color: msg.sender === "me"? "#fff" : "#000",
              padding: "10px 15px", 
              borderRadius: "18px",
              maxWidth: "70%",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}>
              <p style={{margin: "0"}}>{msg.text}</p>
              <p style={{fontSize: "10px", opacity: 0.7, margin: "5px 0 0 0", textAlign: "right"}}>{msg.time}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px"}}>
            <img src={contacts[activeContact].img} style={{width: "25px", height: "25px", borderRadius: "50%"}} />
            <div style={{background: "#fff", color: "#000", padding: "10px 15px", borderRadius: "18px"}}>
              {activeContact} is typing...
            </div>
          </div>
        )}
      </div>

      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..." 
        style={{padding: "10px", width: "70%", borderRadius: "20px", border: "1px solid #ddd"}} 
      />
      <button onClick={sendMessage} style={{padding: "10px 20px", marginLeft: "5px", borderRadius: "20px", border: "none", background: "#ff69b4", color: "#fff", cursor: "pointer", fontWeight: "bold"}}>Send</button>
    </div>
  )
}
