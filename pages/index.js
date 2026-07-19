function VoiceRoom({ onClose }) {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [users, setUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]); // NEW CHAT
  const [inputText, setInputText] = useState(''); // NEW CHAT

  // NEW: send message inside voice room
  const sendVoiceRoomMsg = () => {
    if(!inputText.trim()) return;
    setChatMessages([...chatMessages, {user: 'YOU', text: inputText}]);
    setInputText('');
  }

  useEffect(() => {
    let agoraClient;
    let audioTrack;
    const init = async () => {
      const Agora = (await import("agora-rtc-sdk-ng")).default;
      agoraClient = Agora.createClient({ mode: "rtc", codec: "vp8" });
      setClient(agoraClient);
      
      await agoraClient.join(APP_ID, CHANNEL, null, null);
      audioTrack = await Agora.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
      await agoraClient.publish([audioTrack]);

      agoraClient.on("user-published", async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
          setUsers((prev) => [...prev, user]);
        }
      });

      agoraClient.on("user-unpublished", (user) => {
        setUsers((prev) => prev.filter((u) => u.uid!== user.uid));
      });
    };
    if(typeof window!== "undefined") init();

    return () => {
      localAudioTrack?.close();
      client?.leave();
    }
  }, []);

  const toggleMic = async () => {
    if(localAudioTrack) {
      await localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  }

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 320, 
      background: '#ff1493', padding: 20, borderRadius: 20, 
      color: 'white', zIndex: 999, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:0}}>🔴 Open Voice Room</h3>
        <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:20}}>X</button>
      </div>
      <p style={{fontSize:12, opacity:0.8, margin:'5px 0'}}>{users.length + 1} Live</p>
      
      {/* USERS */}
      <div style={{display:'flex', justifyContent:'center', margin:'15px 0', gap:10, flexWrap:'wrap'}}>
        <div style={{width:70, height:70, borderRadius:'50%', background:'white', color:'#ff1493', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>
          YOU<div style={{fontSize:18}}>{isMuted? '🔇' : '🎤'}</div>
        </div>
        {users.map(user => (
          <div key={user.uid} style={{width:70, height:70, borderRadius:'50%', background:'white', color:'#ff1493', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>
            USER
          </div>
        ))}
      </div>

      {/* NEW: VOICE ROOM CHAT BOX */}
      <div style={{height:140, background:'#1a1a1a', borderRadius:12, margin:'10px 0', display:'flex', flexDirection:'column', border:'1px solid #333'}}>
        <div style={{flex:1, overflowY:'auto', padding:8, fontSize:13}}>
          {chatMessages.length === 0 && <div style={{opacity:0.5, textAlign:'center', marginTop:50}}>Chat in this room...</div>}
          {chatMessages.map((msg,i) => (
            <div key={i} style={{margin:'4px 0'}}>
              <b style={{color:'#ff1493'}}>{msg.user}:</b> {msg.text}
            </div>
          ))}
        </div>
        <div style={{display:'flex', padding:8, borderTop:'1px solid #333'}}>
          <input 
            value={inputText} 
            onChange={e=>setInputText(e.target.value)}
            onKeyPress={e=>e.key==='Enter'&&sendVoiceRoomMsg()}
            placeholder="Chat in room..." 
            style={{flex:1, background:'#333', border:'none', color:'white', padding:8, borderRadius:8, outline:'none'}}
          />
          <button onClick={sendVoiceRoomMsg} style={{background:'#ff1493', border:'none', color:'white', padding:'8px 14px', marginLeft:6, borderRadius:8, fontWeight:'bold', cursor:'pointer'}}>Send</button>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{display:'flex', justifyContent:'center', gap:15, marginTop:10}}>
        <button onClick={toggleMic} style={{width:50, height:50, borderRadius:'50%', border:'none', fontSize:20, background:'white', color:'#ff1493', cursor:'pointer'}}>
          {isMuted?'🔇':'🎤'}
        </button>
        <button onClick={onClose} style={{width:50, height:50, borderRadius:'50%', border:'none', fontSize:20, background:'red', color:'white', cursor:'pointer'}}>❌</button>
      </div>
    </div>
  )
}
