return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 340, 
      background: '#ff1493', padding: 16, borderRadius: 20, 
      color: 'white', zIndex: 999, boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <h3 style={{margin:0, fontSize:16}}>🔴 Open Voice Room</h3>
        <button onClick={onClose} style={{background:'white', border:'none', color:'#ff1493', width:24, height:24, borderRadius:'50%', fontWeight:'bold', cursor:'pointer'}}>X</button>
      </div>
      <p style={{fontSize:12, opacity:0.8, margin:'0 0 12px 0'}}>{users.length + 1} Live</p>
      
      {/* USERS */}
      <div style={{display:'flex', justifyContent:'center', margin:'12px 0'}}>
        <div style={{width:70, height:70, borderRadius:'50%', background:'white', color:'#ff1493', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:12}}>
          <div>YOU</div>
          <div style={{fontSize:18}}>{isMuted? '🔇' : '🎤'}</div>
        </div>
      </div>

      {/* CHAT BOX - FIXED */}
      <div style={{height:150, background:'#1a1a1a', borderRadius:12, margin:'12px 0', display:'flex', flexDirection:'column', border:'1px solid #333'}}>
        <div style={{flex:1, overflowY:'auto', padding:10, fontSize:13}}>
          {chatMessages.length === 0 && <div style={{opacity:0.5, textAlign:'center', marginTop:50}}>Chat in this room...</div>}
          {chatMessages.map((msg,i) => (
            <div key={i} style={{margin:'5px 0'}}>
              <b style={{color:'#ff1493'}}>{msg.user}:</b> <span style={{color:'white'}}>{msg.text}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex', padding:8, borderTop:'1px solid #333', gap:6}}>
          <input 
            value={inputText} 
            onChange={e=>setInputText(e.target.value)}
            onKeyPress={e=>e.key==='Enter'&&sendVoiceRoomMsg()}
            placeholder="Chat in room..." 
            style={{flex:1, background:'#333', border:'none', color:'white', padding:'10px', borderRadius:8, outline:'none', fontSize:14}}
          />
          <button 
            onClick={sendVoiceRoomMsg} 
            style={{background:'#ff1493', border:'none', color:'white', padding:'10px 16px', borderRadius:8, fontWeight:'bold', cursor:'pointer'}}
          >
            Send
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{display:'flex', justifyContent:'center', gap:15, marginTop:12}}>
        <button onClick={toggleMic} style={{width:50, height:50, borderRadius:'50%', border:'none', fontSize:22, background:'white', color:'#ff1493', cursor:'pointer'}}>
          {isMuted?'🔇':'🎤'}
        </button>
        <button onClick={onClose} style={{width:50, height:50, borderRadius:'50%', border:'none', fontSize:22, background:'red', color:'white', cursor:'pointer'}}>❌</button>
      </div>
    </div>
  )
