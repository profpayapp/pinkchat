const getSmartReply = (contact, userMsg) => {
  const msg = userMsg.toLowerCase()
  
  if(contact === "Luna") {
    if(msg.includes("sad") || msg.includes("bad")) return "come here, I got you. You deserve better 💖"
    if(msg.includes("nice") || msg.includes("good")) return "you're making me smile so hard rn 🥰"
    if(msg.includes("time") || msg.includes("out")) return "with you? anytime. Let's go 💕"
    return ["aww you're sweet", "tell me more", "you always know what to say", "he ok 💖"][Math.floor(Math.random()*4)]
  }
  
  if(contact === "Coral") {
    if(msg.includes("nice") || msg.includes("something")) return "you're lowkey the coolest person I know fr 😎"
    if(msg.includes("know") || msg.includes("tell")) return "bet, did you know penguins propose with rocks?"
    if(msg.includes("cool") || msg.includes("time")) return "no cap, this is peak vibes right now"
    return ["bet", "fr??", "say less", "deadass 💀"][Math.floor(Math.random()*4)]
  }
  
  if(contact === "Indigo") {
    if(msg.includes("mind") || msg.includes("think")) return "What's on your mind? I'm all ears 💜"
    if(msg.includes("today") || msg.includes("have")) return "For you? Peace, clarity, and someone who gets you"
    if(msg.includes("nice") || msg.includes("good")) return "You bring good energy. Never forget that"
    return ["I hear you", "That makes sense", "I'm here for you", "Take your time 💜"][Math.floor(Math.random()*4)]
  }
}
