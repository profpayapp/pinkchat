const sendMessage = () => {
  if(message.trim() === "") return
  const newMsg = {text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "me"}

  const updatedChats = {...chats, [activeContact]: [...chats[activeContact], newMsg]}
  setChats(updatedChats)
  setMessage("")

  // TYPING INDICATOR FIX
  setIsTyping(true)
  setTimeout(() => {
    setIsTyping(false)
    const replyText = getSmartReply(activeContact, message)
    const replyMsg = {text: replyText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sender: "them"}
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], replyMsg]}))
  }, 2000) // 2 seconds typing
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
