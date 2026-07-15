import React, { useState, useEffect, useRef } from "react"

export default function App() {
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState("")
  const [profile, setProfile] = useState({name: "", bio: ""})
  const [activeContact, setActiveContact] = useState("Group")
  const [input, setInput] = useState("")
  const [chats, setChats] = useState({
    Group: [], Prof: [], Queen: [], Indigo: [], Boss: [], Tech: [], Gist: []
  })
  const [isLive, setIsLive] = useState(false)
  const [liveStream, setLiveStream] = useState(null)
  const [viewerCount, setViewerCount] = useState(0)
  const [coins, setCoins] = useState(0)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [bottomTab, setBottomTab] = useState("chat") // chat, galaxy, video, doc, call, voice, live
  const chatEndRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(new Audio()) // for sound effect

  const giftList = [
    {emoji: "❤️", name: "Heart", coins: 1},
    {emoji: "🌹", name: "Rose", coins: 5},
    {emoji: "🔥", name: "Fire", coins: 10},
    {emoji: "🚀", name: "Rocket", coins: 50},
    {emoji: "👑", name: "Crown", coins: 100}
  ]

  const leaderboard = [
    {name: "Queen", coins: 540},
    {name: "Boss", coins: 320},
    {name: "You", coins: coins},
    {name: "Indigo", coins: 180},
    {name: "Prof", coins: 90}
  ].sort((a,b) => b.coins - a.coins)

  useEffect(() => {
    const savedUser = localStorage.getItem("crypto-prof-user") || ""
    const savedProfile = localStorage.getItem("crypto-prof-profile")
    const savedChats = localStorage.getItem("crypto-prof-chats")
    const savedCoins = localStorage.getItem("crypto-prof-coins")
    setUser(savedUser)
    setProfile(savedProfile? JSON.parse(savedProfile) : {name: "", bio: ""})
    setCoins(savedCoins? parseInt(savedCoins) : 0)
    if(savedChats) setChats(JSON.parse(savedChats))
  }, [])

  useEffect(() => {
    if(user) {
      localStorage.setItem("crypto-prof-chats", JSON.stringify(chats))
      localStorage.setItem("crypto-prof-coins", coins.toString())
    }
  }, [chats, user, coins])

  useEffect(() => {chatEndRef.current?.scrollIntoView({ behavior: "smooth" })}, [chats, activeContact])

  const bgColor = dark? "#0e0e0e" : "#ffffff"
  const textColor = dark? "#ffffff" : "#000"
  const chatBg = dark? "#1a1a1a" : "#f1f1f1"

  const playGiftSound = () => {
    // Simple beep sound
    audioRef.current.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQAAAAA="
    audioRef.current.play().catch(()=>{})
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
  }

  const sendGift = (gift) => {
    setCoins(prev => prev + gift.coins)
    playGiftSound()
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
        setChats(prev => ({...prev, Group: [...prev.Group, {text: "📹 Crypto-Prof is LIVE 🔴 • 6 viewers", time: "", sender: "system"}]}))
      } catch(err) {alert("Camera access denied")}
    } else {
      liveStream?.getTracks().forEach(track => track.stop())
      setLiveStream(null)
      setIsLive(false)
      setViewerCount(0)
      setChats(prev => ({...prev, Group: [...prev.Group, {text: `📹 Live ended • ${viewerCount} viewers • Total earned: ${coins} coins`, time: "", sender: "system"}]}))
    }
  }

  const withdraw = () => {
    if(coins < 1000) return alert("Minimum 1000 coins to withdraw")
    alert(`Withdrawal request for ${coins} coins sent! 💰`)
    setCoins(0)
  }

  const clearAllData = () => {if(window.confirm("⚠️ Delete EVERYTHING?")){localStorage.clear(); window.location.reload()}}
  const contacts = ["Group", "Prof", "Queen", "Indigo", "Boss", "Tech", "Gist"]

  if(!user) {
    return (
      <div style={{background: bgColor, color: textColor, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px"}}>
        <h1 style={{color: "#ff69b4"}}>PINKCHAT LIVE GIFT 💖 V4.4.0</h1>
        <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Username" style={{padding: "12px", margin: "8px 0", width: "80%"}} />
        <button onClick={handleLogin} style={{background: "#ff69b4", color: "#fff", padding: "14px 40px", borderRadius: "25px", border: "none"}}>Join</button>
      </div>
    )
  }

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", paddingBottom: "80px"}}>
      <div style={{background: "linear-gradient(90deg, #ff69b4, #ffa500)", padding: "10px", borderRadius: "15px", textAlign: "center"}}>
        <h1>PINKCHAT LIVE GIFT 💖 V4.4.0</h1>
        <div style={{color: "#ffd700", fontWeight: "bold"}}>🪙 Wallet: {coins} coins</div>
        <button onClick={() => setShowLeaderboard(!showLeaderboard)} style={{background: "#ffd700", color: "#000", border: "none", padding: "4px 10px", borderRadius: "10px", marginTop: "5px"}}>🏆 Leaderboard</button>
      </div>

      {showLeaderboard && (
        <div style={{background: chatBg, margin: "10px", padding: "10px", borderRadius: "10px"}}>
          <h3>🏆 Top Gifters</h3>
          {leaderboard.map((p,i) => <div key={i}>{i+1}. {p.name} - {p.coins} coins</div>)}
        </div>
      )}

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

      <div style={{margin: "8px", display: "flex", gap: "6px", flexWrap: "wrap"}}>
        {contacts.map(name => (
          <button key={name} onClick={() => setActiveContact(name)} style={{background: activeContact===name? "#ff69b4" : "#333", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px"}}>
            {name}
          </button>
        ))}
        <button onClick={clearAllData} style={{background: "orange", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px"}}>Delete Everything</button>
        <button onClick={withdraw} style={{background: "green", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "15px"}}>💰 Withdraw</button>
      </div>

      <div style={{background: chatBg, padding: "12px", borderRadius: "10px", height: "45vh", overflowY: "auto", margin: "8px"}}>
        <h3>{activeContact} {isLive && `🔴 LIVE`}</h3>
        {chats[activeContact].map((m, i) => <div key={i}>{m.text}</div>)}
        <div ref={chatEndRef} />
      </div>

      <div style={{display: "flex", gap: "8px", margin: "8px"}}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Message..." style={{flex: 1, padding: "12px", borderRadius: "25px"}}/>
        <button onClick={sendMessage} style={{background: "#ff69b4", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px"}}>Send</button>
      </div>

      <button onClick={toggleLive} style={{margin: "8px", background: isLive? "red" : "#ff69b4", color: "#fff", border: "none", padding: "10px", width: "calc(100% - 16px)", borderRadius: "15px"}}>
        📹 {isLive? "End Live" : "Go Live"}
      </button>

      {/* BOTTOM NAVIGATION */}
      <div style={{position: "fixed", bottom: 0, left: 0, right: 0, background: dark? "#111" : "#fff", display: "flex", justifyContent: "space-around", padding: "8px 0", borderTop: "1px solid #ff69b4"}}>
        {["chat","galaxy","video","doc","call","voice","live"].map(tab => (
          <button key={tab} onClick={() => setBottomTab(tab)} style={{background: "none", border: "none", color: bottomTab===tab? "#ff69b4" : "#888", fontSize: "10px"}}>
            {tab==="chat" && "💬"}
            {tab==="galaxy" && "🌌"}
            {tab==="video" && "🎥"}
            {tab==="doc" && "📄"}
            {tab==="call" && "📞"}
            {tab==="voice" && "🎤"}
            {tab==="live" && "🔴"}
            <div>{tab}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
