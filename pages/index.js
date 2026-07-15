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
  }

  const sendGift = (gift) => {
    setCoins(prev => prev + gift.coins)
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const msg = {text: `${user} sent ${gift.emoji} ${gift.name}! [+${gift.coins} coins]`, time, sender: user}
    setChats(prev => ({...prev, Group: [...prev.Group, msg]}))
  }

  const toggleLive = async () => {
    if(!isLive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setLiveStream(stream)
        setIsLive(true)
        setViewerCount(6)
      } catch(err) {
        alert("Camera access denied")
      }
    } else {
      liveStream?.getTracks().forEach(track => track.stop())
      setLiveStream(null)
      setIsLive(false)
      setViewerCount(0)
    }
  }

  const clearChat = () => {setChats({...chats, [activeContact]: []})}
  const clearAllData = () => {if(window.confirm("⚠️ Delete EVERYTHING?")){localStorage.clear(); window.location.reload()}}
  const contacts = ["Group", "Prof", "Queen", "Indigo", "Boss", "Tech", "Gist"]

  if(!user) {
    return (
      <div style={{background: bgColor, color: textColor, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px"}}>
        <h1 style={{color: "#ff69b4"}}>PINKCHAT 💖 V4.3.3</h1>
        <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Username" style={{padding: "12px", margin: "8px 0", width: "80%"}} />
        <button onClick={handleLogin} style={{background: "#ff69b4", color: "#fff", padding: "14px 40px", borderRadius: "25px", border: "none"}}>Join</button>
      </div>
    )
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "10px"}}>
      <div style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", padding: "10px", borderRadius: "15px", textAlign: "center"}}>
        <h1>PINKCHAT 💖 V4.3.3</h1>
        {isLive && <div style={{color: "#ffd700", fontWeight: "bold"}}>🪙 Total Coins: {coins}</div>}
      </div>

      {isLive && (
        <div style={{background: "#000", borderRadius: "10px", padding: "5px", margin: "10px 0"}}>
          <div style={{color: "red", textAlign: "center"}}>🔴 LIVE • {viewerCount} viewers</div>
          <div style={{display: "flex", gap: "12px", justifyContent: "center", margin: "10px 0"}}>
            {giftList.map(gift => (
              <button key={gift.name} onClick={() => sendGift(gift)} style={{background: "#ff69b4", border: "none", borderRadius: "50%", width: "50px", height: "50px", fontSize: "24px"}}>
                {gift.emoji}<div style={{fontSize: "10px", color: "#ffd700"}}>{gift.coins}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{margin: "8px 0", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {contacts.map(name => (
          <button key={name} onClick={() => setActiveContact(name)} style={{background: activeContact===name? "#ff69b4" : "#333", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px"}}>
            {name}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{background: "#555", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px"}}>Light</button>
        <button onClick={clearChat} style={{background: "red", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px"}}>Clear</button>
        <button onClick={clearAllData} style={{background: "orange", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px"}}>Delete Everything</button>
      </div>

      <div style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "50vh", overflowY: "auto"}}>
        <h3>{activeContact} {isLive && `🔴 LIVE`}</h3>
        {chats[activeContact].map((m, i) => <div key={i}>{m.text}</div>)}
        <div ref={chatEndRef} />
      </div>

      <div style={{display: "flex", gap: "8px", marginTop: "8px"}}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Message..." style={{flex: 1, padding: "12px", borderRadius: "25px"}}/>
        <button onClick={sendMessage} style={{background: "#ff69b4", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px"}}>Send</button>
      </div>

      <button onClick={toggleLive} style={{marginTop: "10px", background: isLive? "red" : "#ff69b4", color: "#fff", border: "none", padding: "10px", width: "100%", borderRadius: "15px"}}>
        📹 {isLive? "End Live" : "Go Live"}
      </button>
    </div>
  )
}
