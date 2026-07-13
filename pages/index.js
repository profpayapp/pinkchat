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
    const msg = userMsg.toLowerCase()
    
    if(contact === "Luna") {
      if(msg.includes("sad") || msg.includes("bad")) return "come here, I got you. You deserve better 💖"
      if(msg.includes("love") || msg.includes("cute")) return "aww stop you're making me blush 🥰"
      if(msg.includes("miss")) return "I miss you too 😭 when are we talking again?"
      if(msg.includes("busy")) return "it's okay, I understand. Just don't forget me okay?"
      return ["you're so sweet", "tell me more", "you always make my day", "he ok 💖"][Math.floor(Math.random()*4)]
    }
    
    if(contact === "Coral") {
      if(msg.includes("nice") || msg.includes("something")) return "you're lowkey the coolest person I know fr 😎"
      if(msg.includes("bored") || msg.includes("do")) return "let's cause some trouble then 😈 what we doing?"
      if(msg.includes("game") || msg.includes("play")) return "bet let's run it! You picking the game"
      if(msg.includes("money") || msg.includes("bro")) return "no cap we gon be rich one day 💰"
      return ["bet", "fr??", "say less", "deadass 💀"][Math.floor(Math.random()*4)]
    }
    
    if(contact === "Indigo") {
      if(msg.includes("mind") || msg.includes("think") || msg.includes("feel")) return "I hear you. What's really going on?"
      if(msg.includes("sad") || msg.includes("down")) return "It's okay to feel that way. I'm here with you 💜"
      if(msg.includes("today") || msg.includes("have")) return "For you today? Clarity, peace, and strength"
      if(msg.includes("thanks") || msg.includes("help")) return "Anytime. That's what real ones do"
      return ["That makes sense", "I'm listening", "Take your time", "You got this 💜"][Math.floor(Math.random()*4)]
    }
  }

  const sendMessage = () => {
    if(message.trim() === "") return
    const newMsg = {text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "me"}
    
    const updatedChats = {...chats, [activeContact]: [...chats[activeContact], newMsg]}
    setChats(updatedChats)
    setMessage("")

    // TYPING INDICATOR
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const replyText = getSmartReply(activeContact, message)
      const replyMsg = {text: replyText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "them"}
      setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], replyMsg]}))
    }, 1500)
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "20px", transition: "all 0.3s"}}>
      
      <h1 style={{color: "#ff69b4"}}>Crypto-Prof</h1>
      
      <div style={{margin: "10px 0"}}>
        {["Luna", "Coral", "Indigo"].map(contact => (
          <button 
            key={contact}
            onClick={() => setActiveContact(contact)}
            style={{margin: "5px", padding: "8px 15px", 
              background: activeContact === contact? 
                (contact === "Luna"? "#ff69b4" : contact === "Coral"? "#ff7f50" : "#6a5acd") 
                : buttonBg, 
              color: activeContact === contact? "#fff" : textColor, 
              border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"}}
          >
            {contact}
          </button>
        ))}
      </div>

      <button 
        onClick={() => setTheme(theme === "light"? "dark" : "light")}
        style={{padding: "10px 20px", borderRadius: "8px", cursor: "pointer", margin: "10px 0", border: "none"}}
      >
        Toggle {theme === "light"? "🌙 Dark" : "☀️ Light"}
      </button>

      <h2>{activeContact}</h2>
      
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
          <div style={{display: "flex", justifyContent: "flex-start"}}>
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
