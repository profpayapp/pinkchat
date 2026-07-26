import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, push, onChildAdded } from "firebase/database"

const VoiceRoom = dynamic(() => import('../VoiceRoom'), { ssr: false })

// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCDEpSOucQ-ndn0EiTse8r0765LdJtnsBU",
  authDomain: "pinkchat-56bdf.firebaseapp.com",
  databaseURL: "https://pinkchat-56bdf-default-rtdb.firebaseio.com",
  projectId: "pinkchat-56bdf",
  storageBucket: "pinkchat-56bdf.firebasestorage.app",
  messagingSenderId: "445551411546",
  appId: "1:445551411546:web:8075d12382eb1065923363",
  measurementId: "G-ZPJ06V7ECM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export default function Home() {
  const [showVoice, setShowVoice] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [isLive, setIsLive] = useState(false);

  // AUTH STATE
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if(currentUser) loadMessages();
    });
    return () => unsub();
  }, []);

  // LOGIN / SIGNUP
  const login = () => {
    signInWithEmailAndPassword(auth, email, password).catch(err => alert(err.message));
  }
  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password).catch(err => alert(err.message));
  }
  const logout = () => signOut(auth);

  // CHAT
  const loadMessages = () => {
    const chatRef = ref(db, 'messages');
    onChildAdded(chatRef, (data) => {
      setMessages(prev => [...prev, data.val()]);
    });
  }

  const sendMsg = () => {
    if(msgInput.trim() === '' || !user) return;
    push(ref(db, 'messages'), {
      text: msgInput,
      uid: user.uid,
      time: Date.now()
    });
    setMsgInput('');
  }

  // LIVE
  const startLive = async () => {
    setIsLive(true);
    alert('You are LIVE! Share this link with friends to join.');
  }

  // STYLES
  const styles = {
    container: {background:'linear-gradient(135deg,#ff9a9e,#fad0c4)', minHeight:'100vh', padding:20},
    box: {background:'white', padding:30, borderRadius:20, boxShadow:'0 10px 40px rgba(0,0,0,0.1)', maxWidth:400, margin:'50px auto', textAlign:'center'},
    input: {width:'100%', padding:12, margin:'10px 0', border:'2px solid #fad0c4', borderRadius:10},
    btn: {background:'linear-gradient(135deg,#ff6b9d,#ff9a9e)', color:'white', border:'none', padding:'12px 30px', borderRadius:10, cursor:'pointer', fontWeight:'bold', width:'100%', marginTop:10},
    header: {display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', padding:15, borderRadius:15, marginBottom:20},
    chatBox: {background:'white', borderRadius:15, padding:20, height:300, overflowY:'auto', marginBottom:20},
    msg: {margin:'10px 0', padding:10, borderRadius:10, maxWidth:'70%'},
    me: {background:'#ff6b9d', color:'white', marginLeft:'auto', textAlign:'right'},
    them: {background:'#f0f0f0', textAlign:'left'},
    liveBtn: {background:'#ff4757', color:'white', padding:15, borderRadius:15, textAlign:'center', cursor:'pointer', marginTop:20, fontWeight:'bold'}
  }

  return (
    <div style={styles.container}>
      
      {!user ? (
        // LOGIN SCREEN
        <div style={styles.box}>
          <h1 style={{color:'#ff6b9d', display:'flex', alignItems:'center', justifyContent:'center', gap:10}}>
            <img src="/logo.png" alt="logo" style={{width:50, height:50, borderRadius:'50%'}} />
            💗 PinkChat
          </h1>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button style={styles.btn} onClick={login}>Login</button>
          <button style={{...styles.btn, background:'#ccc', color:'#333'}} onClick={signup}>Sign Up</button>
        </div>
      ) : (
        // DASHBOARD
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <div style={styles.header}>
            <h2 style={{display:'flex', alignItems:'center', gap:10}}>
              <img src="/logo.png" alt="logo" style={{width:40, height:40, borderRadius:'50%'}} />
              Welcome to PinkChat
            </h2>
            <button style={{...styles.btn, width:'auto'}} onClick={logout}>Logout</button>
          </div>

          {/* CHAT SECTION */}
          <div style={styles.chatBox}>
            {messages.map((msg, i) => (
              <div key={i} style={{...styles.msg, ...(msg.uid === user.uid ? styles.me : styles.them)}}>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{display:'flex', gap:10}}>
            <input style={{...styles.input, flex:1}} type="text" placeholder="Type message..." value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&sendMsg()} />
            <button style={{...styles.btn, width:'auto'}} onClick={sendMsg}>Send</button>
          </div>

          {/* VOICE + LIVE */}
          <button 
            onClick={()=>setShowVoice(true)}
            style={{...styles.btn, marginTop:20}}
          >
            🎤 Join Voice Room
          </button>

          <div style={styles.liveBtn} onClick={startLive}>🔴 GO LIVE</div>
          {isLive && <video autoPlay muted style={{width:'100%', borderRadius:15, marginTop:20, background:'black'}} />}
          {showVoice && <VoiceRoom onClose={()=>setShowVoice(false)} />}
        </div>
      )}
    </div>
  )
}
