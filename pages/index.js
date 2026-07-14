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
  const [isLive, setIsLive] = useState(false)
  const [liveStream, setLiveStream] = useState(null)
  const [typing, setTyping] = useState("")
  const [viewerCount, setViewerCount] = useState(0)
  const [liveViewers, setLiveViewers] = useState([])
  const [gifts, setGifts] = useState([])
  const [coins, setCoins] = useState(0)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const chatEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const docInputRef = useRef(null)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const lastAudioRef = useRef(null)

  const contactColors = {
    Group: "#ff1493", Prof: "#ff69b4", Queen: "#ff7f50", Indigo: "#6a5acd",
    Boss: "#00bfff", Tech: "#32cd32", Gist: "#ffa500"
  }

  const giftList = [
    {emoji: "❤️", name: "Heart", coins: 1},
    {emoji: "🌹", name: "Rose", coins: 5},
    {emoji: "🔥", name: "Fire", coins: 10},
    {emoji: "🚀", name: "Rocket", coins: 50},
    {emoji: "👑", name: "Crown", coins: 100}
  ]

  useEffect(() => {
    const savedUser = localStorage.getItem("crypto-prof-user") || ""
    const savedProfile = localStorage.getItem("crypto-prof-profile")
    const savedChats = localStorage.getItem("crypto-prof-chats")
    const savedCoins = localStorage.getItem("crypto-prof-coins")

    setUser(savedUser)
    setProfile(savedProfile? JSON.parse(savedProfile) : {name: "", bio: ""})
    setCoins(savedCoins? parseInt(savedCoins) : 0)

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
      localStorage.setItem("crypto-prof-coins", coins.toString())
    }
  }, [chats, user, profile, coins])

  useEffect(() => {chatEndRef.current?.scrollIntoView({ behavior: "smooth" })}, [chats, activeContact])

  useEffect(() => {
    if(isLive && videoRef.current && liveStream) {
      videoRef.current.srcObject = liveStream
    }
  }, [isLive, liveStream])

  useEffect(() => {
    const chatBox = chatContainerRef.current
    if(!chatBox) return
    const handleScroll = () => {
      const isNearBottom = chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 100
      setShowScrollBtn(!isNearBottom)
    }
    chatBox.addEventListener("scroll", handleScroll)
    return () => chatBox.removeEventListener("scroll", handleScroll)
  }, [activeContact])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
        groupReplyWithTyping()
      } else {
        aiReply(activeContact)
      }
    }, 1000)
  }

  const handleGallery = () => {fileInputRef.current?.click()}
  const handleVideo = () => {videoInputRef.current?.click()}
  const handleDoc = () => {docInputRef.current?.click()}

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

  const handleVideoSend = (e) => {
    const file = e.target.files[0]
    if(!file) return
    const videoUrl = URL.createObjectURL(file)
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const msg = {text: `🎥 Video`, video: videoUrl, time, sender: user}
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], msg]}))
    setTimeout(() => {
      const reply = activeContact==="Group"? "Group: Nice video! 👥" : "I got your video! 🎥"
      setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: reply, time, sender: activeContact}]}))
    }, 1000)
  }

  const handleDocSend = (e) => {
    const file = e.target.files[0]
    if(!file) return
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const msg = {text: `📄 Document: ${file.name}`, time, sender: user}
    setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], msg]}))
    setTimeout(() => {
      const reply = activeContact==="Group"? "Group: Got the document! Let me read it 👥" : "I got your document! 📄"
      setChats(prev => ({...prev, [activeContact]: [...prev[activeContact], {text: reply, time, sender: activeContact}]}))
    }, 1000)
  }

  const joinLive = (viewerName) => {
    if(!liveViewers.includes(viewerName)) {
      setLiveViewers(prev => [...prev, viewerName])
      setViewerCount(prev => prev + 1)
      const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      const msg = {text: `${viewerName} joined the live 👁️`, time, sender: "System"}
      setChats(prev => ({...prev, Group: [...prev.Group, msg]}))
    }
  }

  const sendGift = (gift) => {
    setCoins(prev => prev + gift.coins)
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const msg = {text: `${user} sent ${gift.emoji} ${gift.name}! [+${gift.coins} coins]`, time, sender: user}
    setChats(prev => ({...prev, Group: [...prev.Group, msg]}))
    setGifts(prev => [...prev, gift])

    setTimeout(() => {
      const ai = ["Prof", "Queen", "Indigo"][Math.floor(Math.random()*3)]
      const reactions = {
        "❤️": "Thank you for the heart! ❤️",
        "🌹": "Wow a rose! 🌹",
        "🔥": "This is fire! 🔥",
        "🚀": "To the moon! 🚀",
        "👑": "King behavior! 👑"
      }
      const reply = {text: `${ai}: ${reactions[gift.emoji]}`, time, sender: ai}
      setChats(prev => ({...prev, Group: [...prev.Group, reply]}))
    }, 800)
  }

  const toggleLive = async () => {
    if(!isLive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setLiveStream(stream)
        setIsLive(true)
        setLiveViewers(["Prof", "Queen", "Indigo", "Boss", "Tech", "Gist"])
        setViewerCount(6)
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        const msg = {text: `📹 ${user} is LIVE 🔴 • 6 viewers`, time, sender: user}
        setChats(prev => ({...prev, Group: [...prev.Group, msg]}))
        const liveComments = [
          `Prof: Welcome ${viewerCount} people watching! 💡`,
          `Queen: Hi everyone! Thanks for joining 👑`,
          `Indigo: Drop a comment if you can hear me 🔧`,
          `Boss: Let's make this live viral! 💰`,
          `Tech: Stream is stable 💻`,
          `Gist: Omo the live is sweet o 😂`
        ]
        liveComments.forEach((comment, index) => {
          setTimeout(() => {
            const t = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            setChats(prev => ({...prev, Group: [...prev.Group, {text: comment, time: t, sender: comment.split(":")[0]}))
          }, (index + 1) * 1500)
        })
      } catch(err) {
        alert("Camera access denied. Please allow camera permission.")
      }
    } else {
      liveStream?.getTracks().forEach(track => track.stop())
      setLiveStream(null)
      setIsLive(false)
      setLiveViewers([])
      setViewerCount(0)
      setGifts([])
      const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      const msg = {text: `📹 Live ended • ${viewerCount} viewers • Total: ${coins} coins`, time, sender: user}
      setChats(prev => ({...prev, Group: [...prev.Group, msg]}))
    }
  }

  const toggleRecording = async () => {
    if(!recording) {
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
      setRecording(false)
      mediaRecorderRef.current?.stop()
    }
  }

  const playLastAudio = () => {
    if(lastAudioRef.current) {
      new Audio(lastAudioRef.current).play()
    }
  }

  const groupReplyWithTyping = () => {
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
        setTyping(`${ai.name} is typing...`)
        setTimeout(() => {
          const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          setChats(prev => ({...prev, Group: [...prev.Group, {text: ai.text, time, sender: ai.name}]}))
          setTyping("")
        }, 1200)
      }, index * 2000)
    })
  }

  const aiReply = (name) => {
    setTyping(`${name} is typing...`)
    setTimeout(() => {
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
      setTyping("")
    }, 1200)
  }

  const clearChat = () => {setChats({...chats, [activeContact]: []})}
  const clearAllData = () => {if(window.confirm("⚠️ This will delete EVERYTHING! Are you sure?")){localStorage.clear(); window.location.reload()}}
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
      <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoSend} style={{display: "none"}} />
      <input type="file" accept=".pdf,.doc,.docx,.txt,.xlsx" ref={docInputRef} onChange={handleDocSend} style={{display: "none"}} />

      <div style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", padding: "10px", borderRadius: "15px", marginBottom: "10px", textAlign: "center"}}>
        <h1 style={{color: "#fff", fontSize: "22px", margin: "0", fontWeight: "900"}}>PINKCHAT 💖</h1>
        <p style={{color: "#fff", fontSize: "10px", margin: "0"}}>by CRYPTO-PROF | {profile.bio}</p>
        {isLive && (
          <div style={{background: "#000", padding: "5px", borderRadius: "10px", marginTop: "5px", color: "#ffd700", fontWeight: "bold", fontSize: "14px"}}>
            🪙 Total Coins: {coins}
          </div>
        )}
      </div>

      {isLive && (
        <div style={{background: "#000", borderRadius: "10px", marginBottom: "10px", padding: "5px"}}>
          <video ref={videoRef} autoPlay muted playsInline style={{width: "100%", borderRadius: "8px", maxHeight: "250px"}} />
          <div style={{color: "red", textAlign: "center", fontWeight: "bold", fontSize: "14px"}}>
            🔴 LIVE • {viewerCount} viewers 👁️
          </div>
          <div style={{display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", margin: "5px 0"}}>
            {["Fan1", "Fan2", "Fan3"].map(fan => (
              <button key={fan} onClick={() => joinLive(fan)} 
                style={{background: "#ff69b4", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "10px", fontSize: "10px"}}>
                + Join as {fan}
              </button>
            ))}
          </div>
          <div style={{display: "flex", gap: "12px", justifyContent: "center", margin: "10px 0", background: "#1a1a1a", padding: "8px", borderRadius: "10px", flexWrap: "wrap"}}>
            <p style={{width: "100%", textAlign: "center", color: "#ff69b4", fontSize: "12px", margin: "0", fontWeight: "bold"}}>Send Gift:</p>
            {giftList.map(gift => (
              <button key={gift.name} onClick={() => sendGift(gift)}
                style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", border: "none", borderRadius: "50%", width: "50px", height: "50px", fontSize: "24px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                {gift.emoji}
                <span style={{fontSize: "8px", color: "#ffd700", fontWeight: "bold"}}>{gift.coins}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {contacts.map(name => (
          <button key={name} onClick={() => setActiveContact(name)}
            style={{background: activeContact===name? contactColors[name] : "#333", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px", fontWeight: name==="Group"?"bold":"normal"}}>
            {name === "Group"? "👥 Group" : name}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{background: "#555", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Light</button>
        <button onClick={clearChat} style={{background: "red", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Clear</button>
        <button onClick={clearAllData} style={{background: "orange", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px", fontSize: "12px"}}>Delete Everything</button>
      </div>

      <div style={{position: "relative"}}>
        <div 
          ref={chatContainerRef}
          style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "50vh", overflowY: "auto"}}
        >
          <h3>{activeContact} {activeContact==="Group" && "👥 6 AIs"} {isLive && `🔴 LIVE • ${viewerCount} viewers`}</h3>
          {chats[activeContact].map((m, i) => (
            <div key={i} style={{textAlign: m.sender===user? "right" : "left", margin: "8px 0"}}>
              <div style={{fontSize: "10px", color: contactColors[m.sender] || "#aaa", fontWeight: "bold"}}>{m.sender}</div>
              {m.video? (
                <div style={{background: "#fff", padding: "6px", borderRadius: "12px", display: "inline-block", maxWidth: "60%"}}>
                  <video src={m.video} controls style={{width: "100%", borderRadius: "8px"}} />
                </div>
              ) : (
                <span
                  onClick={() => m.hasAudio && playLastAudio()}
                  style={{background: m.sender===user? "linear-gradient(90deg, #ff69b4, #ffa500)" : "#444", color: "#fff", padding: "8px 12px", borderRadius: "15px", display: "inline-block", maxWidth: "75%", cursor: m.hasAudio? "pointer" : "default"}}
                >
                  {m.text}
                </span>
              )}
              <div style={{fontSize: "10px", opacity: 0.6}}>{m.time}</div>
            </div>
          ))}
          {typing && (
            <div style={{fontSize: "11px", color: "#ff69b4", fontStyle: "italic", margin: "5px 0"}}>
              {typing} <span className="dots">...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {showScrollBtn && (
          <button 
            onClick={scrollToBottom}
            style={{
              position: "absolute",
              right: "15px",
              bottom: "15px",
              background: "linear-gradient(90deg, #ff69b4, #ffa500)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              cursor: "pointer",
              zIndex: 10
            }}
          >
            ⬇️
          </button>
        )}
      </div>

      <div style={{marginTop: "8px", display: "flex", gap: "8px"}}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()}
          placeholder="Message..." style={{flex: 1, padding: "12px", borderRadius: "25px", border: "none", outline: "none"}}/>
        <button onClick={sendMessage} style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px", fontWeight: "bold"}}>Send</button>
      </div>

      <div style={{display: "flex", gap: "10px", justifyContent: "space-around", marginTop: "10px"}}>
        <button onClick={handleGallery} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>📎 Gallery</button>
        <button onClick={handleVideo} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>🎥 Video</button>
        <button onClick={handleDoc} style={{background: "none", border: "none", color: textColor, fontSize: "10px"}}>📄 Doc</button>
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
        <button
          onClick={toggleLive}
          style={{
            background: isLive? "red" : "none",
            border: "none",
            color: isLive? "#fff" : textColor,
            fontSize: "10px",
            fontWeight: isLive? "bold" : "normal"
          }}>
          📹 {isLive? "End Live" : "Live"}
        </button>
      </div>
    </div>
  )
}
