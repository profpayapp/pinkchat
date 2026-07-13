import { useState, useEffect } from "react"

export default function Home() {
  const [theme, setTheme] = useState("light")
  const [activeContact, setActiveContact] = useState("Luna")
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [editingName, setEditingName] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newContactName, setNewContactName] = useState("")
  
  const [contacts, setContacts] = useState({
    Luna: {color: "#ff69b4", img: "https://i.pravatar.cc/150?img=1"},
    Coral: {color: "#ff7f50", img: "https://i.pravatar.cc/150?img=3"},
    Indigo: {color: "#6a5acd", img: "https://i.pravatar.cc/150?img=5"},
    Boss: {color: "#00bfff", img: "https://i.pravatar.cc/150?img=11"} // NEW BOSS
  })

  const [chats, setChats] = useState({
    Luna: [{text: "Hey! Ready to test PinkChat? 💖", time: "10:30 AM", sender: "them"}],
    Coral: [{text: "Hi! This is Coral", time: "10:31 AM", sender: "them"}],
    Indigo: [{text: "Indigo here! 👋", time: "10:32 AM", sender: "them"}],
    Boss: [{text: "Let's make money today. What we building? 💼", time: "10:33 AM", sender: "them"}] // NEW
  })

  useEffect(() => {
    const savedChats = localStorage.getItem("pinkchat-chats")
    const savedTheme = localStorage.getItem("pinkchat-theme")
    const savedContacts = localStorage.getItem("pinkchat-contacts")
    if(savedChats) setChats(JSON.parse(savedChats))
    if(savedTheme) setTheme(savedTheme)
    if(savedContacts) setContacts(JSON.parse(savedContacts))
  }, [])

  useEffect(() => {localStorage.setItem("pinkchat-chats", JSON.stringify(chats))}, [chats])
  useEffect(() => {localStorage.setItem("pinkchat-theme", theme)}, [theme])
  useEffect(() => {localStorage.setItem("pinkchat-contacts", JSON.stringify(contacts))}, [contacts])

  const bgColor = theme === "dark"? "#0f0f0f" : "#fff0f5"
  const textColor = theme === "dark"? "#fff" : "#000"
  const chatBg = theme === "dark"? "#1a1a1a" : "#ffe4ec"
  const buttonBg = theme === "dark"? "#333" : "#fff"

  const getSmartReply = (contact, userMsg) => {
    const msg = userMsg.toLowerCase().replace(/["'.,!?]/g, "")
    
    // NEW BOSS PERSONALITY
    if(contact === "Boss") {
      if(msg.includes("money") || msg.includes("business")) return "That's the mindset! Scale it, automate it, dominate it 💰 What's the next move?"
      if(msg.includes("tired") || msg.includes("hard")) return "Champions don't quit. Rest 10min then get back to work. We eating soon 👑"
      if(msg.includes("idea")) return "Pitch it to me. If it makes money, we do it. No excuses."
      return ["Let's go", "Lock in", "Bigger vision", "Execute now 💼"][Math.floor(Math.random()*4)]
    }
    
    if(!["Luna","Coral","Indigo","Boss"].includes(contact)) {
      if(msg.includes("hi")) return `Hey! I'm ${contact}. Nice to meet you 😊`
      return ["Got it", "Tell me more", "I understand"][Math.floor(Math.random()*3)]
    }
    if(contact === "Luna") {
      if(msg.includes("sad")) return "come here, I got you. You deserve better 💖"
      return ["you're so sweet", "tell me more"][Math.floor(Math.random()*2)]
    }
    if(contact === "Coral") {
      if(msg.includes("ok")) return "yeah I'm good bro, just chilling. you?"
      return ["bet", "say less"][Math.floor(Math.random()*2)]
    }
    if(contact === "Indigo") {
      if(msg.includes("ok")) return "I'm okay, thank you for checking on me 💜"
      return ["I hear you", "That makes sense"][Math.floor(Math.random()*2)]
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

  const clearChat = () => {
    if(confirm(`Clear chat with ${activeContact}?`)) {
      setChats(prev => ({...prev, [activeContact]: [{text: `Chat with ${activeContact} started`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "them"}]}))
    }
  }

  const renameContact = (oldName, newName) => {
    if(newName.trim() === "" || contacts[newName]) return
    const updatedContacts = {...contacts}
    updatedContacts[newName] = updatedContacts[oldName]
    delete updatedContacts[oldName]
    const updatedChats = {...chats}
    updatedChats[newName] = updatedChats[oldName]
    delete updatedChats[oldName]
    setContacts(updatedContacts)
    setChats(updatedChats)
    setActiveContact(newName)
    setEditingName(null)
  }

  const addContact = () => {
    if(newContactName.trim() === "" || contacts[newContactName]) return
    const colors = ["#00bfff", "#32cd32", "#ff1493", "#ffa500", "#9370db"]
    const randomColor = colors[Math.floor(Math.random()*colors.length)]
    const randomImg = `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}`
    setContacts(prev => ({...prev, [newContactName]: {color: randomColor, img: randomImg}}))
    setChats(prev => ({...prev, [newContactName]: [{text: `Hi! I'm ${newContactName}`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "them"}]}))
    setActiveContact(newContactName)
    setNewContactName("")
    setShowAddModal(false)
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "20px", transition: "all 0.3s"}}>
      <h1 style={{color: "#ff69b4"}}>Crypto-Prof</h1>
      
      <div style={{margin: "10px 0", display: "flex", gap: "10px", flexWrap: "wrap"}}>
        {Object.keys(contacts).map(contact => (
          <div key={contact} style={{position: "relative"}}>
            <button 
              onClick={() => setActiveContact(contact)}
              style={{display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", 
                background: activeContact === contact? contacts[contact].color : buttonBg, 
                color: activeContact === contact? "#fff" : textColor, 
                border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold"}}
            >
              <img src={contacts[contact].img} style={{width: "30px", height: "30px", borderRadius: "50%"}} />
              {contact}
            </button>
            <button onClick={() => setEditingName(contact)} style={{position: "absolute", top: "-5px", right: "-5px", background: "#ff69b4", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "10px", cursor: "pointer"}}>✏️</button>
          </div>
        ))}
        <button onClick={() => setShowAddModal(true)} style={{display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "#00ff7f", color: "#000", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold"}}>
          ➕ Add
        </button>
      </div>

      {showAddModal && (
        <div style={{background: buttonBg, padding: "15px", borderRadius: "10px", margin: "10px 0"}}>
          <p><b>Add New Contact</b></p>
          <input value={newContactName} onChange={(e) => setNewContactName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addContact()} placeholder="Enter name: Boss, Bestie, etc" style={{padding: "8px", borderRadius: "8px", border: "1px solid #ddd", marginRight: "5px", width: "60%"}} />
          <button onClick={addContact} style={{padding: "8px 12px", borderRadius: "8px", border: "none", background: "#00ff7f", cursor: "pointer"}}>Create</button>
          <button onClick={() => setShowAddModal(false)} style={{padding: "8px 12px", borderRadius: "8px", border: "none", marginLeft: "5px"}}>Cancel</button>
        </div>
      )}

      {editingName && (
        <div style={{background: buttonBg, padding: "10px", borderRadius: "10px", margin: "10px 0"}}>
          <p>Rename {editingName} to:</p>
          <input autoFocus onKeyPress={(e) => e.key === 'Enter' && renameContact(editingName, e.target.value)} placeholder="New name" style={{padding: "8px", borderRadius: "8px", border: "1px solid #ddd", marginRight: "5px"}} />
          <button onClick={() => setEditingName(null)} style={{padding: "8px 12px", borderRadius: "8px", border: "none"}}>Cancel</button>
        </div>
      )}

      <div style={{display: "flex", gap: "10px"}}>
        <button onClick={() => setTheme(theme === "light"? "dark" : "light")} style={{padding: "10px 20px", borderRadius: "8px", cursor: "pointer", margin: "10px 0", border: "none"}}>
          Toggle {theme === "light"? "🌙 Dark" : "☀️ Light"}
        </button>
        <button onClick={clearChat} style={{padding: "10px 20px", borderRadius: "8px", cursor: "pointer", margin: "10px 0", border: "none", background: "#ff4444", color: "#fff"}}>
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
            <div style={{background: msg.sender === "me"? "#ff69b4" : "#fff", color: msg.sender === "me"? "#fff" : "#000", padding: "10px 15px", borderRadius: "18px", maxWidth: "70%"}}>
              <p style={{margin: "0"}}>{msg.text}</p>
              <p style={{fontSize: "10px", opacity: 0.7, margin: "5px 0 0 0", textAlign: "right"}}>{msg.time}</p>
            </div>
          </div>
        ))}
        {isTyping && <div>{activeContact} is typing...</div>}
      </div>

      <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." style={{padding: "10px", width: "70%", borderRadius: "20px", border: "1px solid #ddd"}} />
      <button onClick={sendMessage} style={{padding: "10px 20px", marginLeft: "5px", borderRadius: "20px", border: "none", background: "#ff69b4", color: "#fff", cursor: "pointer", fontWeight: "bold"}}>Send</button>
    </div>
  )
}
