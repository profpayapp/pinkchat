export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      
      {/* HEADER - FIXED: Sharp Pink + Single Byline */}
      <div className="bg-[#FF1493] p-4 rounded-b-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2">
          PINKCHAT 💖
        </h1>
        <p className="text-center text-sm text-white/90 mt-1">
          By Crypto-Prof AI App Owner
        </p>
      </div>

      {/* MODE BUTTONS */}
      <div className="flex flex-wrap gap-2 p-4 justify-center">
        <button className="px-4 py-2 bg-gray-700 rounded-full text-sm">👥 Group</button>
        <button className="px-4 py-2 bg-[#FF1493] rounded-full text-sm font-semibold">Prof</button>
        <button className="px-4 py-2 bg-gray-700 rounded-full text-sm">Queen</button>
        <button className="px-4 py-2 bg-gray-700 rounded-full text-sm">Indigo</button>
        <button className="px-4 py-2 bg-gray-700 rounded-full text-sm">Boss</button>
        <button className="px-4 py-2 bg-gray-700 rounded-full text-sm">Tech</button>
        <button className="px-4 py-2 bg-gray-700 rounded-full text-sm">Gist</button>
        <button className="px-4 py-2 bg-gray-700 rounded-full text-sm">Light</button>
        <button className="px-4 py-2 bg-red-600 rounded-full text-sm">Clear</button>
        <button className="px-4 py-2 bg-yellow-500 text-black rounded-full text-sm">Reset</button>
      </div>

      {/* CHAT AREA */}
      <div className="p-4 space-y-4 pb-32">
        <div>
          <p className="text-xs text-gray-400 ml-2">Prof</p>
          <div className="bg-gray-800 p-3 rounded-2xl mt-1">
            Prof: Let me explain this properly 💡
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-400 mr-2">Crypto-Prof</p>
          <div className="bg-[#FF1493] p-3 rounded-2xl inline-block">
            How are doing today guy
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400 mr-2">Crypto-Prof</p>
          <div className="bg-[#FF1493] p-3 rounded-2xl inline-block">
            🎙️ Voice Note ▶️ Tap to play
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 ml-2">Prof</p>
          <div className="bg-gray-800 p-3 rounded-2xl mt-1">
            I heard your voice note! 🔊
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400 mr-2">Crypto-Prof</p>
          <div className="bg-[#FF1493] p-3 rounded-2xl inline-block">
            📄 Document: practice-questions-english
          </div>
        </div>
      </div>

      {/* INPUT */}
      <div className="fixed bottom-16 left-0 right-0 p-4 flex gap-2 bg-[#1a1a2e]">
        <input 
          type="text" 
          placeholder="Message..." 
          className="flex-1 bg-gray-800 rounded-full px-4 py-3 outline-none"
        />
        <button className="bg-[#FF1493] px-6 py-3 rounded-full font-semibold">Send</button>
      </div>

      {/* FEATURE BUTTONS - ALL FEATURES BACK */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around p-3 border-t border-gray-800 bg-[#1a1a2e]">
        <button className="flex flex-col items-center text-xs">📎 Gallery</button>
        <button className="flex flex-col items-center text-xs">🎥 Video</button>
        <button className="flex flex-col items-center text-xs">📄 Doc</button>
        <button className="flex flex-col items-center text-xs bg-[#FF1493] px-4 py-2 rounded-full">🎙️ Talk</button>
        <button className="flex flex-col items-center text-xs">📡 Live</button>
      </div>

    </div>
  )
}
