import { useState, useEffect } from "react"

export default function Home() {
  const [theme, setTheme] = useState("light")
  const [activeContact, setActiveContact] = useState("Luna")
  const [message, setMessage] = useState("")
  const [chats, setChats] = useState({
    Luna: [{text: "Hey! Ready to test PinkChat? 💖", time: "10:30 AM", sender: "them"}],
    Coral: [{text: "Hi! This is Coral", time: "10:31 AM", sender: "them"}],
    Indigo: [{text: "Indigo here! 👋", time: "10:32 AM", sender: "them"}]
  })

  // LOAD SAVED CHATS WHEN APP STARTS
  useEffect(() => {
    const savedChats = localStorage.getItem("pinkchat-chats")
    const savedTheme = localStorage.getItem("pinkchat-theme")
    if(savedChats) setChats(JSON.parse(savedChats))
    if(savedTheme) setTheme(savedTheme)
  }, [])

  // SAVE CHATS EVERY TIME THEY CHANGE
  useEffect(() => {
    localStorage.setItem("pinkchat-chats", JSON.stringify(chats))
  }, [chats])

  // SAVE THEME
  useEffect(() => {
    localStorage.setItem("pinkchat-theme", theme)
  }, [theme])

  const bgColor = theme === "dark"? "#0f0f0f" : "#fff0f5"
  const textColor = theme === "dark"? "#fff" : "#000"
  const chatBg = theme === "dark"? "#1a1a1a" : "#ffe4ec"
  const buttonBg = theme === "dark"? "#333" : "#fff"

  const sendMessage = () => {
    if(message.trim() === "") return
    const newMsg = {text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "me"}
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
            style={{margin: "5px", padding: "8px 15px",
              background: activeContact === contact?
                (contact === "Luna"? "#ff69b4" : contact === "Coral"? "#ff7f50" : "#6a5acd")
                : buttonBg,
              color: activeContact === contact? "#fff" : textColor,
              border: "none", borderRadius: "8px", cursor: "pointer"}}
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
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
        style={{padding: "10px", width: "70%", borderRadius: "20px", border: "1px solid #ddd"}}
      />
      <button onClick={sendMessage} style={{padding: "10px 20px", marginLeft: "5px", borderRadius: "20px", border: "none", background: "#ff69b4", color: "#fff", cursor: "pointer"}}>Send</button>
    </div>
  )
}
