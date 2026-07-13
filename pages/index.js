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

  // SMART REPLY FUNCTION
  const getSmartReply = (contact, userMsg) => {
    const msg = userMsg.toLowerCase()
    
    if(contact === "Luna") {
      if(msg.includes("how") || msg.includes("you")) return "I'm doing great now that you're here 🥰"
      if(msg.includes("love") || msg.includes("cute")) return "aww stop you're making me blush 💕"
      if(msg.includes("sad")) return "come here, I got you. What's wrong? 💖"
      return ["he", "tell me more", "you're so sweet", "aww 🥰"][Math.floor(Math.random()*4)]
    }
    
    if(contact === "Coral") {
      if(msg.includes("how")) return "yo I'm good bro, wassup 😎"
      if(msg.includes("funny") || msg.includes("lol")) return "lmaooo dead 💀"
      if(msg.includes("game") || msg.includes("play")) return "bet let's play! what we doing?"
      return ["fr??", "say less", "bet", "yo that's crazy"][Math.floor(Math.random()*4)]
    }
    
    if(contact === "Indigo") {
      if(msg.includes("sad") || msg.includes("mind") || msg.includes("feel")) return "I hear you. I'm here and I'm listening 💜"
      if(msg.includes("thanks")) return "Anytime. That's what I'm here for"
      if(msg.includes("
