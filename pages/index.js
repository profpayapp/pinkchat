import { useState } from "react"

export default function Home() {
  const [theme, setTheme] = useState("light")

  const bgColor = theme === "dark" ? "#0f0f0f" : "#fff0f5"
  const textColor = theme === "dark" ? "#fff" : "#000"
  const chatBg = theme === "dark" ? "#1a1a1a" : "#ffe4ec"

  return (
    <div style={{background: bgColor, color: textColor, minHeight: "100vh", padding: "20px", transition: "all 0.3s"}}>
      
      <h1>Crypto-Prof</h1>
      <p>Luna<br/>Coral<br/>Indigo</p>
      
      <button 
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{padding: "10px 20px", borderRadius: "8px", cursor: "pointer"}}
      >
        Toggle {theme === "light" ? "dark" : "light"}
      </button>

      <h2>Luna</h2>
      
      <div style={{background: chatBg, borderRadius: "10px", padding: "15px", margin: "10px 0"}}>
        <p>Hey! Ready to test PinkChat? 💖</p>
        <p>10:30 AM</p>
      </div>

      <input placeholder="Type a message..." style={{padding: "8px"}} />
      <button>Send</button>
    </div>
  )
}
