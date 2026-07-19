import { useState, useEffect, useRef } from 'react';

export default function VoiceRoom({ currentUser, addMessage }) {
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [chatMessages]);

  const sendVoiceRoomMsg = () => {
    if(!inputText.trim()) return;
    
    const newMsg = { user: currentUser, text: inputText };
    setChatMessages([...chatMessages, newMsg]);
    
    // Also send to main chat
    addMessage(currentUser, `[Voice Room] ${inputText}`);
    
    setInputText('');
  }

  return (
    <div className="voice-room">
      <h3>🔴 Open Voice Room <span>1 Live</span></h3>
      
      <div id="userGrid">
        <div className="user-circle">
          <div>YOU</div>
          <small>🎤</small>
        </div>
      </div>

      {/* VOICE ROOM CHAT BOX - NEW */}
      <div className="voice-chat-box">
        <div className="voice-chat-messages">
          {chatMessages.map((msg, i) => (
            <div key={i} className="msg">
              <b>{msg.user}:</b> {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="voice-chat-input">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendVoiceRoomMsg()}
            placeholder="Chat in room..." 
          />
          <button onClick={sendVoiceRoomMsg}>Send</button>
        </div>
      </div>

      <div className="voice-controls">
        <button onClick={() => setIsMuted(!isMuted)}>
          {isMuted? '🔇' : '🎤'}
        </button>
        <button className="leave-btn">❌</button>
      </div>

      <style jsx>{`
       .voice-room { background: #ff1493; padding: 20px; border-radius: 20px; color: white; }
       .voice-room h3 { text-align: center; margin-bottom: 10px; }
       .voice-room span { font-size: 12px; opacity: 0.8; }
        #userGrid { display: flex; justify-content: center; margin: 15px 0; }
       .user-circle { width: 70px; height: 70px; border-radius: 50%; background: white; color: #ff1493; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: bold; }
       .voice-chat-box { height: 140px; background: #1a1a1a; border-radius: 12px; margin: 10px 0; display: flex; flex-direction: column; border: 1px solid #333; }
       .voice-chat-messages { flex: 1; overflow-y: auto; padding: 8px; font-size: 13px; }
       .msg { margin: 4px 0; }
       .msg b { color: #ff1493; }
       .voice-chat-input { display: flex; padding: 8px; border-top: 1px solid #333; }
       .voice-chat-input input { flex: 1; background: #333; border: none; color: white; padding: 8px; border-radius: 8px; outline: none; }
       .voice-chat-input button { background: #ff1493; border: none; color: white; padding: 8px 14px; margin-left: 6px; border-radius: 8px; font-weight: bold; }
       .voice-controls { display: flex; justify-content: center; gap: 15px; margin-top: 10px; }
       .voice-controls button { width: 50px; height: 50px; border-radius: 50%; border: none; font-size: 20px; }
       .voice-controls button:first-child { background: white; color: #ff1493; }
       .leave-btn { background: red; color: white; }
      `}</style>
    </div>
  )
}
