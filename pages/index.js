const getSmartReply = (contact, userMsg) => {
  // CLEAN THE MESSAGE: remove quotes, punctuation, make lowercase
  const msg = userMsg.toLowerCase().replace(/["'.,!?]/g, "")

  if(contact === "Luna") {
    if(msg.includes("sad") || msg.includes("bad") || msg.includes("hurt")) return "come here, I got you. You deserve better 💖"
    if(msg.includes("good") || msg.includes("notice")) return "I noticed YOU 😊 what's up?"
    if(msg.includes("how")) return "I'm amazing now that you're here 🥰 how are you?"
    if(msg.includes("ok") || msg.includes("fine")) return "I'm great! Missed talking to you 💕"
    return ["you're so sweet", "tell me more", "you always make my day", "he ok 💖"][Math.floor(Math.random()*4)]
  }

  if(contact === "Coral") {
    if(msg.includes("ok") || msg.includes("sure") || msg.includes("fine")) return "yeah I'm good bro, just chilling. you?"
    if(msg.includes("how")) return "I'm chillin man, you good?"
    if(msg.includes("bro") || msg.includes("call")) return "yo what's good bro 👀"
    if(msg.includes("bored") || msg.includes("do") || msg.includes("trouble")) return "let's cause some trouble then 😈 what we doing?"
    if(msg.includes("rich") || msg.includes("money")) return "no cap we gon be rich one day 💰"
    return ["bet", "fr??", "say less", "no cap", "deadass 💀"][Math.floor(Math.random()*4)]
  }

  if(contact === "Indigo") {
    if(msg.includes("mind") || msg.includes("think") || msg.includes("feel")) return "I hear you. What's really going on?"
    if(msg.includes("ok") || msg.includes("sure") || msg.includes("fine")) return "I'm okay, thank you for checking on me 💜"
    if(msg.includes("today") || msg.includes("have")) return "For you today? Clarity, peace, and strength"
    return ["That makes sense", "I'm listening", "Take your time", "You got this 💜"][Math.floor(Math.random()*4)]
  }
}
