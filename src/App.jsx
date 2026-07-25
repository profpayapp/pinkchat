import { useState } from 'react'
import { Send, MessageCircle, User } from 'lucide-react'
import './App.css'

function App() {
  const [selectedChat, setSelectedChat] = useState('Pinkie Bot')
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState({
    'Pinkie Bot': [
      { sender: 'bot', text: 'Welcome to ProfChat! ❤️' },
      { sender: 'bot', text: 'How are you doing today?' }
    ],
    'Bestie': [
      { sender: 'bot', text: 'Hey bestie! 💖' }
    ],
    'Mom': [
      { sender: 'bot', text: 'Hi my love! 😘' }
    ]
  })

  const sendMessage = () => {
    if (message.trim() === '') return
    
    const newChats = {...chats }
    newChats[selectedChat].push({ sender: 'you', text: message })
    setChats(newChats)
    setMessage('')
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      {/* LEFT SIDEBAR */}
      <div className="w-80 bg-white shadow-lg">
        {/* HEADER WITH NEW NAME */}
        <div className="p-4 bg-pink-500 text-white">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ProfChat 🤝
            </h1>
            <p className="text-sm opacity-90">PinkChat by Crypto-Prof</p>
          </div>
        </div>
        
        {/* CHAT LIST */}
        <div className="p-2">
          {Object.keys(chats).map(chat => (
            <div 
              key={chat}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 rounded-lg cursor-pointer mb-2 flex items-center gap-3 ${
                selectedChat === chat? 'bg-pink-200' : 'hover:bg-pink-50'
              }`}
            >
              <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold">{chat}</p>
                <p className="text-sm text-gray-500">
                  {chats[chat][chats[chat].length - 1].text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {/* CHAT HEADER */}
        <div className="p-4 bg-white shadow-md">
          <h2 className="text-xl font-bold text-pink-600">{selectedChat}</h2>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chats[selectedChat].map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'you'? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-2xl ${
                msg.sender === 'you' 
                 ? 'bg-pink-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-3 border-2 border-pink-300 rounded-full focus:outline-none focus:border-pink-500"
            />
            <button
              onClick={sendMessage}
              className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
