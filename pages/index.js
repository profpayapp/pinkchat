import { useState } from "react"

export default function Home() {
  const [theme, setTheme] = useState("light")
  const [activeContact, setActiveContact] = useState("Luna")
  const [message, setMessage] = useState("")
  const [chats, setChats] = useState({
    Luna: [{text: "Hey! Ready to test PinkChat? 💖", time: "10:30 AM"}],
    Coral: [{text: "Hi! This is Coral", time: "10:31 AM"}],
    Indigo: [{text: "Indigo here! 👋", time: "10:32 AM"}]
  })

  const bgColor = theme === "dark"? "#0f0f0f" : "#fff0f5"
  const textColor = theme === "dark"? "#fff" : "#000"
  const chatBg = theme === "dark"? "#1a1a1a" : "#ffe4ec"
  const buttonBg = theme === "dark"? "#333" : "#fff"

  const sendMessage = () => {
    if(message.trim() === "") return
    const newMsg = {text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
    setChats({...chats, [activeContact]: [...chats[activeContact], newMsg]})
    setMessage("")
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "20px", transition: "all 0.3s"}}>
      
      <h1>Crypto-Prof</h1>
      
      <div style={{margin: "10px 0"}}>
        {["Luna", "Coral", "Indigo"].map(contact => (
          <button 
            key={contact}
            onClick={() => setActiveContact(contact)}
            style={{margin: "5px", padding: "8px 15px", background: activeContact === contact? "#ff69b4" : buttonBg, color: activeContact === contact? "#fff" : textColor, border: "none", borderRadius: "8px", cursor: "pointer"}}
          >
            {contact}
          </button>
        ))}
      </div>

      <button 
        onClick={() => setTheme(theme === "light"? "dark" : "light")}
        style={{padding: "10px 20px", borderRadius: "8px", cursor: "pointer", margin: "10px 0"}}
      >
        Toggle {theme === "light"? "dark" : "light"}
      </button>

      <h2>{activeContact}</h2>
      
      <div style={{background: chatBg, borderRadius: "10px", padding: "15px", margin: "10px 0", minHeight: "200px"}}>
        {chats[activeContact].map((msg, i) => (
          <div key={i} style={{margin: "10px 0"}}>
            <p>{msg.text}</p>
            <p style={{fontSize: "12px", opacity: 0.7}}>{msg.time}</p>
          </div>
        ))}
      </div>

      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..." 
        style={{padding: "8px", width: "70%"}} 
      />
      <button onClick={sendMessage} style={{padding: "8px 15px", marginLeft: "5px"}}>Send</button>
    </div>
  )
}
