import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function PinkChat() {
  const [user, setUser] = useState(null)
  const [activeChat, setActiveChat] = useState('Luna')
  const [messages, setMessages] = useState({
    Luna: [{ from: 'Luna', text: 'Hey! Ready to test PinkChat? 💖', time: '10:30 AM' }],
    Coral: [{ from: 'Coral', text: 'This UI is so clean!', time: '9:15 AM' }],
    Indigo: [{ from: 'Indigo', text: 'Can we do a video call later?', time: 'Yesterday' }]
  })
  const [input, setInput] = useState('')
  const [theme, setTheme] = useState('light')
  const [profilePic, setProfilePic] = useState(null)
  const fileRef = useRef()

  const contacts = ['Luna', 'Coral', 'Indigo']

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg = { from: 'You', text: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
    setMessages({...messages, [activeChat]: [...messages[activeChat], newMsg]})
    setInput('')
  }

  const handleProfileUpload = (e) => {
    const file = e.target.files[0]
    if (file) setProfilePic(URL.createObjectURL(file))
  }

  const startCall = (type) => alert(`${type} call with ${activeChat} - Demo mode`)
  const sendVoice = () => alert('Voice note recorded - Demo mode')

  return (
    <div className={`app ${theme}`}>
      <div className="sidebar">
        <div className="profile">
          <img src={profilePic || 'https://i.pravatar.cc/100'} onClick={() => fileRef.current.click()} />
          <input type="file" ref={fileRef} onChange={handleProfileUpload} hidden accept="image/*" />
          <h3>Crypto-Prof</h3>
        </div>
        {contacts.map(c => (
          <div key={c} className={`contact ${activeChat === c? 'active' : ''}`} onClick={() => setActiveChat(c)}>
            {c}
          </div>
        ))}
        <button onClick={() => setTheme(theme === 'light'? 'dark' : 'light')}>Toggle {theme}</button>
      </div>

      <div className="chat">
        <div className="chat-header">
          <h2>{activeChat}</h2>
          <div>
            <button onClick={() => startCall('Voice')}>📞</button>
            <button onClick={() => startCall('Video')}>📹</button>
          </div>
        </div>
        <div className="messages">
          {messages[activeChat].map((m, i) => (
            <motion.div key={i} className={`msg ${m.from === 'You'? 'me' : 'them'}`}
              initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
              <p>{m.text}</p><span>{m.time}</span>
            </motion.div>
          ))}
        </div>
        <div className="input-area">
          <button onClick={sendVoice}>🎤</button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
  }
