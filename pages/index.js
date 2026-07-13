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

  // SMART REPLY FUNCTION - UPGRADED
  const getSmartReply = (contact, userMsg) => {
    const msg = userMsg.toLowerCase()

    if(contact === "Luna") {
      if(msg.includes("sad") || msg.includes("bad")) return "come here, I got you. You deserve better 💖"
      if(msg.includes("good") || msg.includes("notice")) return "I noticed YOU 😊 what's up?"
      if(msg.includes("how")) return "I'm amazing now that you're here 🥰 how are you?"
      return ["you're so sweet", "tell me more", "you always make my day", "he ok 💖"][Math.floor(Math.random()*4)]
    }

    if(contact === "Coral") {
      if(msg.includes("okay") || msg.includes("sure")) return "yeah I'm good bro, just chilling. you?"
      if(msg.includes("how")) return "I'm chillin man, you good?"
      if(msg.includes("good") || msg.includes("notice")) return "always noticing good vibes when you text 😎"
      if(msg.includes("bored") || msg.includes("do")) return "let's cause some trouble then 😈 what we doing?"
      return ["bet", "fr??", "say less", "no cap"][Math.floor(Math.random()*4)]
    }

    if(contact === "Indigo") {
      if(msg.includes("mind") || msg.includes("think")) return "I hear you. What's really going on?"
      if(msg.includes("okay") || msg.includes("sure")) return "I'm okay, thank you for checking on me 💜"
      if(msg.includes("today") || msg.includes("have")) return "For you today? Clarity, peace, and strength"
      return ["That makes sense", "I'm listening", "Take your time", "You got this 💜"][Math.floor(Math.random()*4)]
    }
  }

  // SEND MESSAGE FUNCTION - WITH TYPING INDICATOR
  const sendMessage = () => {
    if(message.trim() === "") return
    const newMsg = {text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "me"}

    const updatedChats = {...chats, [activeContact]: [...chats[activeContact], newMsg]}
    setChats(updatedChats)
    setMessage("")

    // TYPING INDICATOR FIX - 2 second delay
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const replyText = getSmartReply(activeContact, message)
      const replyMsg = {text: replyText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "them"}
      setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], replyMsg]}))
    }, 2000)
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
        Toggle {theme === "light"? "🌙 Dark
