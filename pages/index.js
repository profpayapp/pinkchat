const getSmartReply = (contact, userMsg) => {
  const msg = userMsg.toLowerCase()

  if(contact === "Luna") {
    if(msg.includes("sad") || msg.includes("bad") || msg.includes("hurt") || msg.includes("cry")) return "come here, I got you. You deserve better 💖"
    if(msg.includes("good") || msg.includes("notice") || msg.includes("see")) return "I noticed YOU 😊 what's up?"
    if(msg.includes("how") || msg.includes("you")) return "I'm amazing now that you're here 🥰 how are you?"
    if(msg.includes("ok") || msg.includes("fine")) return "I'm great! Missed talking to you 💕"
    return ["you're so sweet", "tell me more", "you always make my day", "he ok 💖"][Math.floor(Math.random()*4)]
  }

  if(contact === "Coral") {
    // THIS IS THE KEY FIX - catches "are you okay", "you ok", etc
    if(msg.includes("ok") || msg.includes("sure") || msg.includes("fine") || msg.includes("good")) return "yeah I'm good bro, just chilling. you?"
    if(msg.includes("how") || msg.includes("you doing")) return "I'm chillin man, you good?"
    if(msg.includes("bro") || msg.includes("call") || msg.includes("calling")) return "yo what's good bro 👀"
    if(msg.includes("bored") || msg.includes("do") || msg.includes("trouble")) return "let's cause some trouble then 😈 what we doing?"
    if(msg.includes("rich") || msg.includes("money")) return "no cap we gon be rich one day 💰"
    return ["bet", "fr??", "say less", "no cap"][Math.floor(Math.random()*4)]
  }

  if(contact === "Indigo") {
    if(msg.includes("mind") || msg.includes("think") || msg.includes("feel")) return "I hear you. What's really going on?"
    if(msg.includes("ok") || msg.includes("sure") || msg.includes("fine")) return "I'm okay, thank you for checking on me 💜"
    if(msg.includes("today") || msg.includes("have")) return "For you today? Clarity, peace, and strength"
    return ["That makes sense", "I'm listening", "Take your time", "You got this 💜"][Math.floor(Math.random()*4)]
  }
}
