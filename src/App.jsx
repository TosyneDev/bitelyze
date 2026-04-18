import { useState, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, signOut, onAuthStateChanged
} from "firebase/auth";
import {
  initializeFirestore, doc, setDoc, getDoc, arrayUnion
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdin15LOt0vwN3H1EXAnFox2Zyjek5J4Y",
  authDomain: "bitelyze-project.firebaseapp.com",
  projectId: "bitelyze-project",
  storageBucket: "bitelyze-project.firebasestorage.app",
  messagingSenderId: "989253564001",
  appId: "1:989253564001:web:ba5593143b7735049e1c20",
};
const firebaseApp    = initializeApp(firebaseConfig);
const auth           = getAuth(firebaseApp);
const db             = initializeFirestore(firebaseApp, { experimentalForceLongPolling: true });
const googleProvider = new GoogleAuthProvider();

const T={bg:"#08080e",card:"#111118",border:"#1c1c2a",accent:"#00e5a0",accentDim:"#00e5a015",accentGlow:"#00e5a035",orange:"#ff6b35",orangeDim:"#ff6b3515",blue:"#4facfe",blueDim:"#4facfe15",purple:"#a78bfa",purpleDim:"#a78bfa15",text:"#eeeef5",muted:"#777799",danger:"#ff4757"};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:#08080e;font-family:'DM Sans',sans-serif}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}@keyframes pop{0%{transform:scale(0.82);opacity:0}65%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.fadeUp{animation:fadeUp .4s ease forwards}.fadeIn{animation:fadeIn .35s ease forwards}.slideIn{animation:slideIn .32s ease forwards}.pop{animation:pop .38s ease forwards}.glow:hover{box-shadow:0 0 28px #00e5a040,0 0 8px #00e5a020;transform:translateY(-2px)}.ripple:active{transform:scale(0.97)}.upload:hover{border-color:#00e5a0!important;background:#00e5a00c!important}@keyframes ringGlow{0%,100%{filter:drop-shadow(0 0 6px #00e5a030)}50%{filter:drop-shadow(0 0 14px #00e5a050)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}.ring-glow{animation:ringGlow 3s ease-in-out infinite}.spin{animation:spin 1s linear infinite}@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}input::placeholder{font-size:13px!important;font-weight:400!important;opacity:0.45!important;color:#777799!important}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1c1c2a;border-radius:99px}@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulseGlow{0%,100%{box-shadow:0 0 12px #00e5a030,0 4px 24px #00e5a015}50%{box-shadow:0 0 24px #00e5a050,0 4px 32px #00e5a030}}@keyframes staggerIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.01)}}@keyframes fillRing{from{stroke-dashoffset:var(--ring-circumference)}to{stroke-dashoffset:var(--ring-target)}}@keyframes bouncePop{0%{transform:scale(0.7);opacity:0}50%{transform:scale(1.15)}75%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}@keyframes logoPulse{0%,85%,100%{transform:scale(1)}90%{transform:scale(1.12)}95%{transform:scale(0.96)}}@keyframes bobFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes phaseSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes barGrow{from{height:0}to{height:var(--bar-h)}}@keyframes shimmerRing{0%{stroke-opacity:0.6}50%{stroke-opacity:1}100%{stroke-opacity:0.6}}.breathe{animation:breathe 3s ease-in-out infinite}.bounce-pop{animation:bouncePop .5s ease forwards}.logo-pulse{animation:logoPulse 8s ease-in-out infinite}.bob-float{animation:bobFloat 2s ease-in-out infinite}.bar-grow{animation:barGrow .8s cubic-bezier(0.16,1,0.3,1) forwards}.shimmer-ring{animation:shimmerRing 2s ease-in-out infinite}.pulse-glow{animation:pulseGlow 2s ease-in-out infinite}@keyframes floatChaos0{0%,100%{transform:rotate(-15deg) translateY(0)}50%{transform:rotate(-10deg) translateY(-6px)}}@keyframes floatChaos1{0%,100%{transform:rotate(10deg) translateY(0)}50%{transform:rotate(15deg) translateY(-8px)}}@keyframes floatChaos2{0%,100%{transform:rotate(-5deg) translateY(0)}50%{transform:rotate(5deg) translateY(-5px)}}@keyframes lineGlow{0%,100%{box-shadow:0 0 4px #00e5a040,0 0 12px #00e5a020}50%{box-shadow:0 0 14px #00e5a060,0 0 28px #00e5a030}}@keyframes floatUnified{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes labelPulse{0%,100%{opacity:0.7}50%{opacity:1}}@keyframes glowBreath{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}@keyframes breatheDark{0%,100%{background:radial-gradient(circle,transparent 30%,rgba(0,0,0,0.4) 100%)}50%{background:radial-gradient(circle,transparent 25%,rgba(0,0,0,0.5) 100%)}}@keyframes rotateIcon{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}@keyframes lockBounce{0%{transform:scale(1)}30%{transform:scale(1.25)}60%{transform:scale(0.9)}100%{transform:scale(1)}}@keyframes lockGlowPulse{0%,100%{box-shadow:0 0 20px #00e5a015,0 0 40px #00e5a010}50%{box-shadow:0 0 35px #00e5a030,0 0 60px #00e5a020}}@keyframes shimmerSweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes nudge{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}@keyframes tooltipFade{0%{opacity:0;transform:translateY(-4px)}15%{opacity:1;transform:translateY(0)}85%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(4px)}}@keyframes unlockPulse{0%{transform:scale(0);opacity:0.8}100%{transform:scale(4);opacity:0}}@keyframes pillPop{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}@keyframes fogIn{from{backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px)}to{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}}@keyframes pulseDivider{0%,100%{box-shadow:0 0 6px #00e5a030,0 0 18px #00e5a015;opacity:0.7}50%{box-shadow:0 0 16px #00e5a060,0 0 36px #00e5a030;opacity:1}}@keyframes fadeStagger{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes glowPulse{0%,100%{box-shadow:0 0 30px #00e5a020,0 0 60px #00e5a010}50%{box-shadow:0 0 50px #00e5a040,0 0 80px #00e5a020}}@keyframes driftUp{0%{opacity:0;transform:translateY(20px) rotate(var(--rot,0deg))}15%{opacity:0.4}85%{opacity:0.4}100%{opacity:0;transform:translateY(-80px) rotate(var(--rot,0deg))}}@keyframes pillFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes borderGlow{0%,100%{box-shadow:inset 0 0 60px #00e5a010}50%{box-shadow:inset 0 0 60px #00e5a020}}`;

const calcGoal=(p)=>{if(!p)return 2000;const w=parseFloat(p.weight),h=parseFloat(p.height),a=parseFloat(p.age);if(!w||!h||!a)return 2000;const bmr=p.gender==="Male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161;const act={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};const def={lose_fast:-750,lose:-500,lose_slow:-250,maintain:0,gain:300};return Math.round(bmr*(act[p.activity]||1.375)+(def[p.goal]||-500));};
const TODAY=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
// ── Rate Limiting (3 analyses per day) ──
const DAILY_LIMIT=5;
const getDeviceFingerprint=()=>{try{const c=document.createElement("canvas");const ctx=c.getContext("2d");ctx.textBaseline="top";ctx.font="14px Arial";ctx.fillText("fp",2,2);const d=c.toDataURL().slice(-50);const s=`${screen.width}x${screen.height}x${screen.colorDepth}x${navigator.hardwareConcurrency||0}x${Intl.DateTimeFormat().resolvedOptions().timeZone}x${d}`;let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return"dev_"+Math.abs(h).toString(36);}catch(e){return"dev_fallback";}};
const getRateLimitKey=(uid)=>{const today=new Date().toISOString().split("T")[0];return`rate_${uid}_${today}`;};
const getDeviceRateLimitKey=()=>{const today=new Date().toISOString().split("T")[0];return`rate_${getDeviceFingerprint()}_${today}`;};
const getUsageCount=(uid)=>{const userCount=parseInt(localStorage.getItem(getRateLimitKey(uid))||"0",10);const deviceCount=parseInt(localStorage.getItem(getDeviceRateLimitKey())||"0",10);return Math.max(userCount,deviceCount);};
const incrementUsage=(uid)=>{const userKey=getRateLimitKey(uid);const deviceKey=getDeviceRateLimitKey();const userCount=parseInt(localStorage.getItem(userKey)||"0",10)+1;const deviceCount=parseInt(localStorage.getItem(deviceKey)||"0",10)+1;const newCount=Math.max(userCount,deviceCount);localStorage.setItem(userKey,String(newCount));localStorage.setItem(deviceKey,String(newCount));return newCount;};
const getRemainingAnalyses=(uid)=>Math.max(0,DAILY_LIMIT-getUsageCount(uid));

const HOUR=new Date().getHours();
const coachGreeting=(name)=>{if(HOUR<12)return`Good morning, ${name}! 🌅 Breakfast sets the tone.`;if(HOUR<17)return`Hey ${name}! 🌤️ Midday check-in — how's your eating going?`;return`Evening, ${name}! 🌙 Almost done for the day.`;};
const coachTips=["💡 Eating slowly helps your brain register fullness — aim for 20 mins per meal.","💡 Protein at breakfast reduces cravings by up to 60% throughout the day.","💡 Drinking water before meals can reduce calorie intake by ~13%.","💡 Your body burns more calories digesting protein than carbs or fat.","💡 Sleep affects hunger hormones — aim for 7–8 hours for best results.","💡 Eating from smaller plates naturally reduces portion sizes."];
const BADGES=[{id:"first_meal",icon:"🍽️",name:"First Bite",desc:"Log your first meal",check:(s)=>s.totalMeals>=1},{id:"hydrated",icon:"💧",name:"Hydration Hero",desc:"Hit water goal",check:(s)=>s.waterGoalHits>=1},{id:"streak3",icon:"🔥",name:"3-Day Streak",desc:"Log meals 3 days in a row",check:(s)=>s.streak>=3},{id:"streak7",icon:"⚡",name:"Week Warrior",desc:"7-day logging streak",check:(s)=>s.streak>=7},{id:"meals10",icon:"🏅",name:"10 Meals Logged",desc:"Track 10 meals total",check:(s)=>s.totalMeals>=10},{id:"undergoal",icon:"🎯",name:"On Target",desc:"Stay under calorie goal",check:(s)=>s.daysUnderGoal>=1},{id:"earlybird",icon:"🌅",name:"Early Bird",desc:"Log breakfast before 9am",check:(s)=>s.earlyBreakfast>=1},{id:"coach",icon:"🧠",name:"Coach's Pet",desc:"Open app 5 days running",check:(s)=>s.streak>=5}];

const saveProfile=async(uid,profile)=>{
  try{localStorage.setItem("profile_"+uid,JSON.stringify(profile));}catch(e){}
  try{await setDoc(doc(db,"users",uid,"data","profile"),profile,{merge:true});}catch(e){console.log("Firestore save error:",e);}
};
const loadProfile=async(uid)=>{
  // Try Firestore first with a 5s timeout, fall back to localStorage
  try{
    const snap=await Promise.race([getDoc(doc(db,"users",uid,"data","profile")),new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),5000))]);
    if(snap.exists()){const data=snap.data();try{localStorage.setItem("profile_"+uid,JSON.stringify(data));}catch(e){}return data;}
  }catch(e){console.log("Firestore load failed, using localStorage:",e);}
  try{const local=localStorage.getItem("profile_"+uid);if(local)return JSON.parse(local);}catch(e){}
  return null;
};
const LS={get:(k)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};

const saveTodayData=async(uid,data)=>{
  const today=new Date().toISOString().split("T")[0];
  LS.set(`day_${uid}_${today}`,data);
  try{await setDoc(doc(db,"users",uid,"days",today),data,{merge:true});}catch(e){}
};
const loadTodayData=async(uid)=>{
  const today=new Date().toISOString().split("T")[0];
  try{const snap=await Promise.race([getDoc(doc(db,"users",uid,"days",today)),new Promise((_,r)=>setTimeout(()=>r(),5000))]);if(snap.exists()){LS.set(`day_${uid}_${today}`,snap.data());return snap.data();}}catch(e){}
  return LS.get(`day_${uid}_${today}`);
};
const saveStats=async(uid,stats)=>{
  LS.set(`stats_${uid}`,stats);
  try{await setDoc(doc(db,"users",uid,"data","stats"),stats,{merge:true});}catch(e){}
};
const loadStats=async(uid)=>{
  const def={streak:1,totalMeals:0,waterGoalHits:0,daysUnderGoal:0,earlyBreakfast:0};
  try{const snap=await Promise.race([getDoc(doc(db,"users",uid,"data","stats")),new Promise((_,r)=>setTimeout(()=>r(),5000))]);if(snap.exists()){LS.set(`stats_${uid}`,snap.data());return snap.data();}}catch(e){}
  return LS.get(`stats_${uid}`)||def;
};
const addMealToHistory=async(uid,meal)=>{
  const hist=LS.get(`history_${uid}`)||[];hist.push(meal);LS.set(`history_${uid}`,hist);
  try{await setDoc(doc(db,"users",uid,"data","history"),{meals:arrayUnion(meal)},{merge:true});}catch(e){}
};
const loadHistory=async(uid)=>{
  try{const snap=await Promise.race([getDoc(doc(db,"users",uid,"data","history")),new Promise((_,r)=>setTimeout(()=>r(),5000))]);if(snap.exists()){const m=snap.data().meals||[];LS.set(`history_${uid}`,m);return m;}}catch(e){}
  return LS.get(`history_${uid}`)||[];
};

const loadRecentDays=async(uid,n=14)=>{
  const days={};const today=new Date();
  for(let i=0;i<n;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const key=d.toISOString().split("T")[0];
    try{const snap=await Promise.race([getDoc(doc(db,"users",uid,"days",key)),new Promise((_,r)=>setTimeout(()=>r(),3000))]);if(snap.exists()){days[key]=snap.data();LS.set(`day_${uid}_${key}`,snap.data());}}
    catch(e){const local=LS.get(`day_${uid}_${key}`);if(local)days[key]=local;}
  }
  return days;
};

// Calculate real streak from day data
const calcStreak=(daysMap)=>{
  let streak=0;
  const today=new Date();
  for(let i=0;i<365;i++){
    const d=new Date(today);
    d.setDate(d.getDate()-i);
    const key=d.toISOString().split("T")[0];
    const day=daysMap[key];
    if(day&&day.meals&&day.meals.length>0){
      streak++;
    }else if(i===0){
      continue; // today might not have meals yet
    }else{
      break;
    }
  }
  return Math.max(streak,1);
};

// Build 7-day chart data
const buildWeekData=(daysMap)=>{
  const result=[];
  const today=new Date();
  for(let i=6;i>=0;i--){
    const d=new Date(today);
    d.setDate(d.getDate()-i);
    const key=d.toISOString().split("T")[0];
    const day=daysMap[key];
    result.push({
      label:d.toLocaleDateString("en",{weekday:"short"}).slice(0,3),
      cal:day?day.consumed||0:0,
      isToday:i===0,
    });
  }
  return result;
};

const Btn=({onClick,disabled,children,style={}})=>(<button className={disabled?"":"glow ripple"} onClick={onClick} disabled={disabled} style={{width:"100%",padding:"15px",borderRadius:16,border:"none",background:disabled?"#1c1c2a":`linear-gradient(135deg,${T.accent},#00b87a)`,color:disabled?T.muted:"#000",fontWeight:800,fontSize:15,cursor:disabled?"not-allowed":"pointer",transition:"all .2s",fontFamily:"inherit",boxShadow:disabled?"none":`0 4px 24px ${T.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`,...style}}>{children}</button>);
const Card=({children,style={}})=>(<div style={{background:`linear-gradient(145deg,${T.card},#0d0d15)`,border:`1px solid ${T.border}`,borderRadius:20,padding:"18px 20px",marginBottom:14,boxShadow:"0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",backdropFilter:"blur(10px)",...style}}>{children}</div>);
const CardTitle=({icon,children})=>(<p style={{fontSize:13,fontWeight:800,marginBottom:14,display:"flex",alignItems:"center",gap:8,color:T.text,letterSpacing:"-0.01em"}}><span style={{fontSize:16}}>{icon}</span>{children}</p>);
function MacroBar({label,val,max,color}){const pct=Math.min((val/max)*100,100);return(<div style={{marginBottom:11}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{color:T.muted,fontWeight:500}}>{label}</span><span style={{fontWeight:700,color}}>{val}g</span></div><div style={{height:8,borderRadius:99,background:"#1a1a28",overflow:"hidden",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.3)"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${color},${color}aa)`,borderRadius:99,transition:"width 1s cubic-bezier(0.16,1,0.3,1)",boxShadow:`0 0 12px ${color}40`}}/></div></div>);}
function ProgressDots({total,current}){return(<div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:26}}>{Array.from({length:total}).map((_,i)=>(<div key={i} style={{width:i===current?22:7,height:7,borderRadius:99,background:i<=current?T.accent:T.border,transition:"all .3s ease"}}/>))}</div>);}
function NumInput({label,value,onChange,unit,placeholder}){return(<div style={{marginBottom:15}}><p style={{fontSize:11,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>{label}</p><div style={{display:"flex",alignItems:"center",background:"#0e0e16",border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}><input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{flex:1,padding:"13px 16px",background:"transparent",border:"none",color:T.text,fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit"}}/>{unit&&<span style={{padding:"0 16px",color:T.muted,fontSize:13,fontWeight:600}}>{unit}</span>}</div></div>);}
function TextInput({label,value,onChange,placeholder,type="text"}){return(<div style={{marginBottom:15}}><p style={{fontSize:11,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>{label}</p><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"13px 16px",background:"#0e0e16",border:`1.5px solid ${T.border}`,borderRadius:12,color:T.text,fontSize:15,outline:"none",fontFamily:"inherit",fontWeight:500}}/></div>);}

function CountUp({target,duration=800}){
  const[val,setVal]=useState(0);
  useEffect(()=>{
    let start=0;const step=target/((duration/16)||1);
    const timer=setInterval(()=>{start+=step;if(start>=target){setVal(target);clearInterval(timer);}else setVal(Math.round(start));},16);
    return()=>clearInterval(timer);
  },[target,duration]);
  return val;
}

function AnalyzeLoader(){
  const[phase,setPhase]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),1500);
    const t2=setTimeout(()=>setPhase(2),3000);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  const phases=["📸 Reading your meal...","🔬 Identifying ingredients...","⚡ Calculating nutrition..."];
  return(<div style={{textAlign:"center",padding:"32px 0"}}>
    <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>{[0,1,2].map(i=>(<div key={i} style={{width:9,height:9,borderRadius:"50%",background:T.accent,animation:`pulse .8s ease-in-out ${i*.2}s infinite`,display:"inline-block"}}/>))}</div>
    <p key={phase} style={{color:T.text,fontSize:14,fontWeight:600,animation:"phaseSlide .4s ease forwards"}}>{phases[phase]}</p>
  </div>);
}

function HealthScoreCircle({score}){
  const color=score>=7?T.accent:score>=4?T.orange:T.danger;
  const r=20;const c=2*Math.PI*r;const offset=c*(1-score/10);
  return(<div style={{position:"relative",width:52,height:52,flexShrink:0}}>
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#1a1a28" strokeWidth="4"/>
      <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 26 26)" style={{transition:"stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)"}} className="shimmer-ring"/>
    </svg>
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontSize:16,fontWeight:900,color}}>{score}</span>
    </div>
  </div>);
}

function AuthScreen({initialMode="signup"}){
  const[mode,setMode]=useState(initialMode);
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[name,setName]=useState("");
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const[resetSent,setResetSent]=useState(false);
  const friendlyError=(msg)=>{const m=msg||"";if(m.includes("email-already-in-use"))return"This email is already registered. Try signing in instead.";if(m.includes("invalid-email"))return"Please enter a valid email address.";if(m.includes("weak-password"))return"Password is too weak. Use at least 6 characters.";if(m.includes("user-not-found"))return"No account found with this email.";if(m.includes("wrong-password")||m.includes("invalid-credential"))return"Incorrect email or password.";if(m.includes("too-many-requests"))return"Too many attempts. Please wait a moment and try again.";if(m.includes("network-request-failed"))return"Network error. Check your internet connection.";if(m.includes("popup-closed")||m.includes("popup_closed"))return"Sign-in popup was closed. Try again.";if(m.includes("popup-blocked")||m.includes("popup_blocked"))return"Popup was blocked by your browser. Allow popups for this site and try again.";if(m.includes("cancelled-popup-request")||m.includes("canceled"))return"Sign-in was cancelled. Try again.";if(m.includes("unauthorized-domain"))return"This domain is not authorized for sign-in. Contact support.";const clean=m.replace("Firebase: ","").replace(/\s*\(auth\/[\w-]+\)\.?/g,"").replace(/^Error\.?$/i,"").trim();return clean||"Something went wrong. Please try again.";};
  const handleEmail=async()=>{if(!email||!pass)return setError("Please fill in all fields");if(mode==="signup"&&!name)return setError("Please enter your name");setLoading(true);setError("");try{if(mode==="signup"){const cred=await createUserWithEmailAndPassword(auth,email,pass);try{await Promise.race([saveProfile(cred.user.uid,{name}),new Promise(r=>setTimeout(r,5000))]);}catch(e){console.log("Profile save error:",e);}}else{await signInWithEmailAndPassword(auth,email,pass);}}catch(e){setError(friendlyError(e.message));}finally{setLoading(false);}};
  const handleForgotPassword=async()=>{if(!email)return setError("Enter your email address first");setLoading(true);setError("");try{await sendPasswordResetEmail(auth,email);setResetSent(true);}catch(e){setError(friendlyError(e.message));}finally{setLoading(false);}};
  const handleGoogle=async()=>{setLoading(true);setError("");try{await signInWithPopup(auth,googleProvider);}catch(e){setError(friendlyError(e.message));}finally{setLoading(false);}};
  return(<div className="fadeIn" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 22px",background:T.bg,backgroundImage:`radial-gradient(ellipse at 50% 28%, #00e5a012 0%, transparent 62%)`}}><div className="pop" style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:22,boxShadow:`0 0 52px ${T.accentGlow}`}}>🍽️</div><h1 style={{fontSize:30,fontWeight:900,marginBottom:6,color:T.text}}>Welcome to <span style={{color:T.accent}}>Bitelyze</span></h1><p style={{color:T.muted,fontSize:13,marginBottom:32}}>{mode==="login"?"Sign in to continue your journey":"Create your free account"}</p><div style={{width:"100%",maxWidth:360}}><button onClick={handleGoogle} className="ripple" style={{width:"100%",padding:"13px",borderRadius:13,border:`1.5px solid ${T.border}`,background:"#0e0e16",color:T.text,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}><span style={{fontSize:20}}>🔵</span>Continue with Google</button><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{flex:1,height:1,background:T.border}}/><span style={{fontSize:11,color:T.muted}}>or</span><div style={{flex:1,height:1,background:T.border}}/></div>{mode==="signup"&&<TextInput label="Your Name" value={name} onChange={setName} placeholder="Enter your name"/>}<TextInput label="Email" value={email} onChange={setEmail} placeholder="Enter your email" type="email"/><TextInput label="Password" value={pass} onChange={setPass} placeholder="Enter your password" type="password"/>{mode==="login"&&<p onClick={handleForgotPassword} style={{textAlign:"right",fontSize:12,color:T.accent,cursor:"pointer",marginBottom:12,fontWeight:600}}>Forgot password?</p>}{resetSent&&<div style={{background:T.accentDim,border:`1px solid ${T.accent}40`,borderRadius:10,padding:"10px 14px",marginBottom:14,color:T.accent,fontSize:12}}>✅ Password reset email sent! Check your inbox.</div>}{error&&<div style={{background:"#1a0f0f",border:`1px solid ${T.danger}40`,borderRadius:10,padding:"10px 14px",marginBottom:14,color:T.danger,fontSize:12}}>⚠️ {error}</div>}<Btn onClick={handleEmail} disabled={loading}>{loading?"Please wait…":mode==="login"?"Sign In →":"Create Account →"}</Btn><p style={{textAlign:"center",marginTop:18,fontSize:13,color:T.muted}}>{mode==="login"?"Don't have an account? ":"Already have an account? "}<span onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");}} style={{color:T.accent,cursor:"pointer",fontWeight:700}}>{mode==="login"?"Sign Up":"Sign In"}</span></p></div></div>);
}

function Onboarding({onDone}){
  const total=3;
  const[slide,setSlide]=useState(0);
  const[dragOffset,setDragOffset]=useState(0);
  const[isDragging,setIsDragging]=useState(false);
  const touchStartX=useRef(0);
  const touchCurrentX=useRef(0);
  const autoTimer=useRef(null);
  const resumeTimer=useRef(null);
  const containerRef=useRef(null);
  const navy='#090912';
  const[unlocking,setUnlocking]=useState(false);
  const[showTooltip,setShowTooltip]=useState(false);
  const[nudging,setNudging]=useState(false);

  const startAutoAdvance=()=>{
    clearInterval(autoTimer.current);
    autoTimer.current=setInterval(()=>{
      setSlide(s=>s<total-1?s+1:0);
    },4000);
  };

  useEffect(()=>{startAutoAdvance();return()=>{clearInterval(autoTimer.current);clearTimeout(resumeTimer.current);};},[]);

  const handleTouchStart=(e)=>{
    clearInterval(autoTimer.current);
    clearTimeout(resumeTimer.current);
    touchStartX.current=e.touches[0].clientX;
    touchCurrentX.current=e.touches[0].clientX;
    setIsDragging(true);
  };
  const handleTouchMove=(e)=>{
    if(!isDragging)return;
    touchCurrentX.current=e.touches[0].clientX;
    const diff=touchCurrentX.current-touchStartX.current;
    const atEdge=(slide===0&&diff>0)||(slide===total-1&&diff<0);
    setDragOffset(atEdge?diff*0.25:diff);
  };
  const handleTouchEnd=()=>{
    if(!isDragging)return;
    setIsDragging(false);
    const diff=touchCurrentX.current-touchStartX.current;
    const threshold=60;
    if(diff<-threshold&&slide<total-1)setSlide(s=>s+1);
    else if(diff>threshold&&slide>0)setSlide(s=>s-1);
    setDragOffset(0);
    resumeTimer.current=setTimeout(startAutoAdvance,2000);
  };
  // Mouse drag support
  const handleMouseDown=(e)=>{
    clearInterval(autoTimer.current);
    clearTimeout(resumeTimer.current);
    touchStartX.current=e.clientX;
    touchCurrentX.current=e.clientX;
    setIsDragging(true);
  };
  const handleMouseMove=(e)=>{
    if(!isDragging)return;
    touchCurrentX.current=e.clientX;
    const diff=touchCurrentX.current-touchStartX.current;
    const atEdge=(slide===0&&diff>0)||(slide===total-1&&diff<0);
    setDragOffset(atEdge?diff*0.25:diff);
  };
  const handleMouseUp=()=>{
    if(!isDragging)return;
    handleTouchEnd();
  };

  const screenW=typeof window!=='undefined'?window.innerWidth:400;
  const visualPos=slide-dragOffset/screenW;
  const goAuth=(mode)=>onDone(mode);
  const handleSignUp=()=>{
    if(slide===2&&!unlocking){
      setUnlocking(true);
      setTimeout(()=>goAuth("signup"),900);
    } else {
      goAuth("signup");
    }
  };
  const handleLockedTap=()=>{
    if(unlocking)return;
    setNudging(true);
    setShowTooltip(true);
    setTimeout(()=>setNudging(false),300);
    setTimeout(()=>setShowTooltip(false),1800);
  };

  return(<div ref={containerRef} style={{position:"relative",height:"100vh",maxHeight:"100vh",background:navy,overflow:"hidden",fontFamily:"'DM Sans',sans-serif",color:T.text,userSelect:"none",touchAction:"pan-y"}}
    onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
    onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
    {/* Progress dots — real-time drag position */}
    <div style={{display:"flex",justifyContent:"center",gap:8,padding:"20px 0 0",position:"relative",zIndex:4}}>
      {Array.from({length:total}).map((_,i)=>{
        const dist=Math.abs(i-visualPos);
        const active=dist<0.5;
        const w=active?28:8;
        const opacity=Math.max(0.3,1-dist*0.6);
        return(<div key={i} style={{width:w,height:8,borderRadius:99,background:active?T.accent:T.border,opacity,transition:isDragging?'none':'all .4s ease',boxShadow:active?`0 0 12px ${T.accentGlow}`:'none'}}/>);
      })}
    </div>

    {/* Slides container */}
    <div style={{position:"relative",width:"100%",height:"calc(100vh - 180px)",overflow:"hidden"}}>

      {/* ═══ SLIDE 1 — Food Spread with Calorie Labels ═══ */}
      <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:`translateX(${(0-slide)*100+dragOffset/screenW*100}%)`,transition:isDragging?'none':'transform .5s cubic-bezier(0.16,1,0.3,1)',overflow:"hidden"}}>
        {/* Food image — fills entire slide, gradient handles the fade */}
        <div style={{position:"absolute",inset:0,backgroundImage:"url(/food-spread.jpg)",backgroundSize:"cover",backgroundPosition:"center top",opacity:slide===0?1:0,transition:"opacity .5s ease"}}/>
        {/* Gradient overlay — fades food smoothly into navy */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(9,9,18,0.0) 0%, rgba(9,9,18,0.0) 25%, rgba(9,9,18,0.2) 40%, rgba(9,9,18,0.55) 52%, rgba(9,9,18,0.8) 60%, #090912 68%)"}}/>
        <div style={{position:"absolute",inset:0,animation:"borderGlow 4s ease-in-out infinite",pointerEvents:"none",zIndex:3}}/>

        {/* Floating question marks — slightly more visible */}
        {[{x:"12%",s:24,d:0,r:-15},{x:"78%",s:18,d:1.2,r:12},{x:"45%",s:30,d:0.6,r:-8},{x:"25%",s:16,d:1.8,r:20},{x:"65%",s:20,d:2.4,r:-10},{x:"88%",s:16,d:0.4,r:15}].map((q,i)=>(
          <span key={i} style={{position:"absolute",top:"8%",left:q.x,fontSize:q.s,color:"rgba(255,255,255,0.55)",zIndex:2,animation:`driftUp ${4+i*0.5}s ease-in-out ${q.d}s infinite`,["--rot"]:q.r+"deg",pointerEvents:"none"}}>?</span>
        ))}

          {/* Calorie pill labels — positioned within image area */}
          {[
            {label:"Roast Chicken · 1,320 kcal",top:"40%",left:"18%",delay:0.8},
            {label:"Fries · 365 kcal",top:"72%",left:"6%",delay:1.2},
            {label:"Pasta · 580 kcal",top:"28%",left:"3%",delay:1.6},
            {label:"Cheese · 740 kcal",top:"22%",left:"55%",delay:2.0}
          ].map((p,i)=>(
            <div key={i} style={{position:"absolute",top:p.top,left:p.left,zIndex:2,opacity:slide===0?1:0,animation:slide===0?`fadeIn .4s ease ${p.delay}s both, pillFloat 3s ease-in-out ${1+i*0.3}s infinite`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.92)",borderRadius:20,padding:"3px 8px",boxShadow:"0 2px 12px rgba(0,0,0,0.3)",whiteSpace:"nowrap"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:T.accent,flexShrink:0}}/>
                <span style={{fontSize:10,fontWeight:600,color:"#1a1a2a"}}>{p.label}</span>
              </div>
              <div style={{width:1,height:10,background:T.accent,margin:"0 auto",opacity:0.5}}/>
            </div>
          ))}

        {/* Text area — sits over the faded-out bottom portion */}
        <div style={{position:"absolute",bottom:"12%",left:0,right:0,padding:"0 22px",zIndex:2}}>
          <h1 style={{fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.25,marginBottom:6,opacity:slide===0?1:0,animation:slide===0?"fadeUp .5s ease 1.2s both":"none"}}>Do you actually know<br/>what you just ate?</h1>
          <p style={{fontSize:13,color:T.accent,fontWeight:600,opacity:slide===0?1:0,animation:slide===0?"fadeUp .5s ease 1.4s both":"none"}}>Bitelyze tells you exactly. Every single meal.</p>
        </div>
      </div>

      {/* ═══ SLIDE 2 — Be Specific ═══ */}
      <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:`translateX(${(1-slide)*100+dragOffset/screenW*100}%)`,transition:isDragging?'none':'transform .5s cubic-bezier(0.16,1,0.3,1)',padding:"24px 20px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <h2 style={{fontSize:26,fontWeight:900,textAlign:"center",marginBottom:8,letterSpacing:"-0.5px"}}>Be specific. Get <span style={{color:T.accent}}>smarter</span> results.</h2>
        <p style={{fontSize:13,color:T.muted,textAlign:"center",marginBottom:28,maxWidth:320}}>The more detail you give, the more accurate we are.</p>
        <div style={{display:"flex",gap:14,width:"100%",maxWidth:400}}>
          {/* Bad example */}
          <div style={{flex:1,background:"#12121f",border:`2px solid ${T.danger}35`,borderRadius:18,padding:"18px 14px",textAlign:"center"}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${T.danger}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,margin:"0 auto 10px"}}>📱</div>
            <p style={{fontSize:13,fontWeight:700,color:T.danger,marginBottom:10}}>Vague input</p>
            <div style={{background:"#0a0a14",borderRadius:10,padding:"10px",marginBottom:8}}><p style={{fontSize:12,color:T.muted}}>"rice"</p></div>
            <div style={{background:`${T.danger}10`,borderRadius:10,padding:"10px"}}><p style={{fontSize:12,color:"#cc8888"}}>~200-400 kcal 🤷</p></div>
          </div>
          {/* Good example */}
          <div style={{flex:1,background:"#12121f",border:`2px solid ${T.accent}35`,borderRadius:18,padding:"18px 14px",textAlign:"center"}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${T.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,margin:"0 auto 10px"}}>📱</div>
            <p style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:10}}>Specific input</p>
            <div style={{background:"#0a0a14",borderRadius:10,padding:"10px",marginBottom:8}}><p style={{fontSize:12,color:T.text}}>"1 cup cooked white rice"</p></div>
            <div style={{background:`${T.accent}10`,borderRadius:10,padding:"10px"}}><p style={{fontSize:12,color:T.accent}}>206 kcal · 45g carbs</p></div>
          </div>
        </div>
      </div>

      {/* ═══ SLIDE 3 — FOMO Locked Preview ═══ */}
      <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:`translateX(${(2-slide)*100+dragOffset/screenW*100}%)`,transition:isDragging?'none':'transform .5s cubic-bezier(0.16,1,0.3,1)',overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* === Layer 1: Dashboard mockup (fills entire slide) === */}
        <div style={{position:"absolute",inset:0,padding:"14px 16px 0",background:"linear-gradient(180deg,#0c0c15,#08080e)",opacity:slide===2?1:0,transition:"opacity .4s ease .2s"}} onClick={handleLockedTap}>
          {/* Header bar */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"8px 12px",background:"rgba(14,14,24,0.9)",borderRadius:12,border:`1px solid ${T.border}`}}>
            <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🍽️</div>
            <span style={{fontSize:13,fontWeight:800,color:T.text,flex:1}}>Bitelyze</span>
            <div style={{background:"linear-gradient(135deg,#2a1a0a,#1a0f05)",border:`1px solid ${T.orange}35`,borderRadius:16,padding:"3px 8px",fontSize:10,color:T.orange,fontWeight:800}}>🔥 1d</div>
          </div>
          {/* Calorie ring + stats */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
            <div style={{position:"relative",flexShrink:0}}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1a1a28" strokeWidth="8"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke={T.accent} strokeWidth="8" strokeDasharray={314} strokeDashoffset={314*0.82} strokeLinecap="round" transform="rotate(-90 60 60)"/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:22,fontWeight:900,color:T.accent}}>428</span>
                <span style={{fontSize:9,color:T.muted}}>of 2377 kcal</span>
              </div>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}>
              {[["EATEN","428",T.accent],["REMAINING","1949",T.blue],["GOAL","2377",T.orange]].map(([l,v,c])=>(
                <div key={l} style={{background:`${c}08`,border:`1px solid ${c}18`,borderRadius:10,padding:"5px 8px"}}>
                  <span style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:".4px",fontWeight:600,display:"block"}}>{l}</span>
                  <span style={{fontSize:16,fontWeight:900,color:c,display:"block"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Coach card */}
          <div style={{padding:"12px 14px",background:`${T.accent}0a`,border:`1px solid ${T.accent}25`,borderRadius:14,marginBottom:12}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{width:28,height:28,borderRadius:8,background:`${T.accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🧠</div>
              <div>
                <p style={{fontSize:8,fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:"1px"}}>Your Coach</p>
                <p style={{fontSize:11,color:T.text,fontWeight:500}}>Great start today! Keep it up 💪</p>
              </div>
            </div>
          </div>
          {/* Tab bar */}
          <div style={{display:"flex",background:"rgba(14,14,24,0.85)",borderRadius:12,padding:3,border:`1px solid ${T.border}`}}>
            {[["📸","Analyze",true],["📋","Log",false],["📊","Progress",false],["👤","Me",false]].map(([ic,lb,active])=>(
              <div key={lb} style={{flex:1,padding:"6px 4px",textAlign:"center",opacity:active?1:0.5}}>
                <span style={{fontSize:16,display:"block"}}>{ic}</span>
                <span style={{fontSize:8,fontWeight:700,color:active?T.accent:T.muted}}>{lb}</span>
              </div>
            ))}
          </div>
        </div>

        {/* === Layer 2: Blur + dark overlay === */}
        <div onClick={handleLockedTap} style={{position:"absolute",inset:0,backdropFilter:unlocking?'blur(0px)':'blur(10px)',WebkitBackdropFilter:unlocking?'blur(0px)':'blur(10px)',background:unlocking?'rgba(9,9,18,0)':'rgba(9,9,18,0.5)',transition:unlocking?'all .5s ease':'none',animation:slide===2&&!unlocking?'fogIn .4s ease .2s both':'none',zIndex:1,cursor:"pointer"}}>
          {!unlocking&&<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}><div style={{position:"absolute",top:0,left:0,width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent)",animation:"shimmerSweep 5s ease-in-out infinite"}}/></div>}
        </div>

        {/* === Layer 3: Headline + Lock pill (centered via flexbox) === */}
        <div style={{position:"absolute",inset:0,zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none",animation:nudging?'nudge .3s ease':'none'}}>
          {/* Headline */}
          <h2 style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:6,textAlign:"center"}}>Everything is ready for you.</h2>
          <p style={{fontSize:13,color:"#a0a0c0",marginBottom:24,textAlign:"center"}}>It's all waiting on the other side.</p>

          {/* Lock pill */}
          {!unlocking&&<div style={{pointerEvents:"auto",width:"85%",maxWidth:320,animation:slide===2?'pillPop .3s cubic-bezier(0.34,1.56,0.64,1) .4s both':'none'}} onClick={handleLockedTap}>
            <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid #00e5a050",borderRadius:20,padding:"24px 32px",textAlign:"center",animation:"lockGlowPulse 2.5s ease-in-out infinite",boxShadow:"0 0 40px #00e5a025"}}>
              <div style={{fontSize:32,marginBottom:12,animation:"lockBounce .6s ease .7s both",display:"inline-block"}}>🔒</div>
              <p style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>Your dashboard is ready.</p>
              <p style={{fontSize:13,color:"#a0a0c0"}}>Sign up to unlock it.</p>
            </div>
            {showTooltip&&<p style={{fontSize:12,color:T.accent,fontWeight:600,textAlign:"center",marginTop:10,animation:"tooltipFade 1.8s ease both"}}>Sign up to access →</p>}
          </div>}

          {/* Unlock pulse */}
          {unlocking&&<div style={{position:"relative",pointerEvents:"none"}}>
            <div style={{fontSize:32,textAlign:"center",animation:"lockBounce .3s ease"}}>🔓</div>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:80,height:80,borderRadius:"50%",background:T.accent,animation:"unlockPulse .5s ease .15s both"}}/>
          </div>}
        </div>
      </div>
    </div>

    {/* ═══ STATIC BOTTOM BUTTONS — always visible ═══ */}
    <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"0 22px 28px",background:`linear-gradient(180deg, transparent 0%, ${navy} 35%)`,zIndex:10,paddingTop:40}}>
      <div style={{maxWidth:340,margin:"0 auto"}}>
        <button onClick={handleSignUp} style={{width:"100%",padding:"15px",borderRadius:14,border:"none",background:T.accent,color:"#000",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"inherit",marginBottom:10,transition:"all .2s",boxShadow:`0 4px 20px ${T.accentGlow}`}}>Sign Up For Free</button>
        <button onClick={()=>goAuth("login")} style={{width:"100%",padding:"14px",borderRadius:14,border:`1.5px solid #333`,background:"transparent",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>Log In</button>
      </div>
    </div>
  </div>);
}

function Welcome({onNext}){return(<div className="fadeIn" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 22px",textAlign:"center",background:T.bg,backgroundImage:`radial-gradient(ellipse at 50% 28%, #00e5a012 0%, transparent 62%)`}}><div className="pop" style={{width:92,height:92,borderRadius:26,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,marginBottom:26,boxShadow:`0 0 52px ${T.accentGlow}`}}>🍽️</div><h1 style={{fontSize:34,fontWeight:900,letterSpacing:"-1px",marginBottom:10,lineHeight:1.15,color:T.text}}>Meet <span style={{color:T.accent}}>Bitelyze</span></h1><p style={{color:T.muted,fontSize:14,lineHeight:1.75,maxWidth:290,marginBottom:36}}>Your personal nutrition coach. Snap meals, track calories, build healthy habits — one bite at a time.</p><div style={{width:"100%",maxWidth:330}}>{[["📸","Snap food → instant calorie breakdown"],["🧠","Smart coaching tips personalised to you"],["🏆","Streaks, badges & weekly progress"],["💧","Hydration tracking & meal reminders"]].map(([icon,text])=>(<div key={text} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 15px",background:"#0e0e16",border:`1px solid ${T.border}`,borderRadius:12,marginBottom:9,textAlign:"left"}}><span style={{fontSize:19}}>{icon}</span><span style={{fontSize:13,color:"#b8b8d0",fontWeight:500}}>{text}</span></div>))}<Btn onClick={onNext} style={{marginTop:14,fontSize:16,padding:"15px"}}>Let's Go →</Btn></div></div>);}

function StepBasic({p,setP,onNext,onBack}){const ok=p.name.trim()&&p.age&&parseInt(p.age)>0&&p.gender;return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"20px 22px 16px",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}><button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14}}>←</button><ProgressDots total={4} current={0}/><h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Let's get to know you</h2><p style={{color:T.muted,fontSize:13}}>Step 1 of 4 — Basic information</p></div><div style={{padding:"24px 22px 40px",maxWidth:480,margin:"0 auto"}}><TextInput label="Your Name" value={p.name} onChange={v=>setP(x=>({...x,name:v}))} placeholder="Enter your name"/><NumInput label="Age" value={p.age} onChange={v=>setP(x=>({...x,age:v}))} unit="yrs" placeholder="Enter your age"/><p style={{fontSize:11,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>Gender</p><div style={{display:"flex",gap:10,marginBottom:26}}>{[["Male","👨"],["Female","👩"]].map(([g,icon])=>(<button key={g} onClick={()=>setP(x=>({...x,gender:g}))} style={{flex:1,padding:"13px",borderRadius:12,border:`1.5px solid ${p.gender===g?T.accent:T.border}`,background:p.gender===g?T.accentDim:"#0e0e16",color:p.gender===g?T.accent:T.text,fontWeight:700,fontSize:14,cursor:"pointer",transition:"all .18s",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{fontSize:20}}>{icon}</span>{g}</button>))}</div><Btn onClick={onNext} disabled={!ok}>Continue →</Btn></div></div>);}

function MeasureHelp({type,onClose}){const tips={height:{title:"How to Measure Your Height",icon:"📏",steps:["Stand barefoot on a flat floor against a wall.","Keep your heels, back, and head touching the wall.","Look straight ahead (chin parallel to the floor).","Place a flat object (book/ruler) on top of your head, pressing against the wall.","Mark the wall where the bottom of the object meets it.","Measure from the floor to the mark with a tape measure.","That's your height in cm."],alt:{title:"No tape measure?",tips:["Use a door frame — most standard doors are 203 cm (6'8\"). Mark your height on it and estimate.","Use a string/yarn to mark your height, then measure the string against a known object (e.g. A4 paper = 29.7 cm).","Most smartphone apps can measure height using your camera (search \"height measure\" in your app store)."]}},weight:{title:"How to Measure Your Weight",icon:"⚖️",steps:["Weigh yourself first thing in the morning, after using the bathroom.","Wear minimal or no clothing for accuracy.","Place the scale on a hard, flat surface (not carpet).","Stand still with weight evenly on both feet.","Wait for the number to stabilize before reading.","Record the number in kg."],alt:{title:"No scale at home?",tips:["Visit a pharmacy — most have free-to-use digital scales.","Your gym or local health center will have one.","If you only know your weight in lbs, divide by 2.205 to get kg (e.g. 154 lbs ÷ 2.205 = 69.8 kg)."]}}};const d=tips[type];return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"20px 20px 0 0",padding:"24px 22px 32px",maxWidth:480,width:"100%",maxHeight:"80vh",overflowY:"auto",animation:"slideUp .3s ease"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:20,fontWeight:800,color:T.text}}>{d.icon} {d.title}</span><button onClick={onClose} style={{background:"none",border:"none",color:T.muted,fontSize:20,cursor:"pointer"}}>✕</button></div><ol style={{paddingLeft:20,marginBottom:20}}>{d.steps.map((s,i)=>(<li key={i} style={{color:T.text,fontSize:13,lineHeight:1.7,marginBottom:6}}>{s}</li>))}</ol><div style={{background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:12,padding:"14px 16px"}}><p style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:8}}>{d.alt.title}</p>{d.alt.tips.map((t,i)=>(<p key={i} style={{fontSize:12,color:T.muted,lineHeight:1.6,marginBottom:i<d.alt.tips.length-1?6:0}}>• {t}</p>))}</div></div></div>);}
function StepBody({p,setP,onNext,onBack}){const[helpType,setHelpType]=useState(null);const ok=p.height&&p.weight&&parseFloat(p.height)>0&&parseFloat(p.weight)>0;const bmi=p.height&&p.weight?(parseFloat(p.weight)/((parseFloat(p.height)/100)**2)).toFixed(1):null;const bmiInfo=bmi?(bmi<18.5?["Underweight",T.blue]:bmi<25?["Healthy ✓",T.accent]:bmi<30?["Overweight",T.orange]:["Obese",T.danger]):null;return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"20px 22px 16px",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}><button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14}}>←</button><ProgressDots total={4} current={1}/><h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Body Measurements</h2><p style={{color:T.muted,fontSize:13}}>Step 2 of 4 — Used to calculate your BMR</p></div><div style={{padding:"22px 20px 40px",maxWidth:480,margin:"0 auto"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>Height</p><button onClick={()=>setHelpType("height")} style={{background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:8,padding:"3px 10px",fontSize:11,color:T.accent,fontWeight:600,cursor:"pointer"}}>📏 How to measure</button></div><div style={{display:"flex",alignItems:"center",background:"#0e0e16",border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:15}}><input type="number" value={p.height} onChange={e=>setP(x=>({...x,height:e.target.value}))} placeholder="Enter your height" style={{flex:1,padding:"13px 16px",background:"transparent",border:"none",color:T.text,fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit"}}/><span style={{padding:"0 16px",color:T.muted,fontSize:13,fontWeight:600}}>cm</span></div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>Current Weight</p><button onClick={()=>setHelpType("weight")} style={{background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:8,padding:"3px 10px",fontSize:11,color:T.accent,fontWeight:600,cursor:"pointer"}}>⚖️ How to measure</button></div><div style={{display:"flex",alignItems:"center",background:"#0e0e16",border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:15}}><input type="number" value={p.weight} onChange={e=>setP(x=>({...x,weight:e.target.value}))} placeholder="Enter your weight" style={{flex:1,padding:"13px 16px",background:"transparent",border:"none",color:T.text,fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit"}}/><span style={{padding:"0 16px",color:T.muted,fontSize:13,fontWeight:600}}>kg</span></div><NumInput label="Target Weight (optional)" value={p.targetWeight} onChange={v=>setP(x=>({...x,targetWeight:v}))} unit="kg" placeholder="Enter target weight"/><Btn onClick={onNext} disabled={!ok}>Continue →</Btn></div>{helpType&&<MeasureHelp type={helpType} onClose={()=>setHelpType(null)}/>}</div>);}

function StepActivity({p,setP,onNext,onBack}){const opts=[{k:"sedentary",l:"Sedentary",d:"Desk job, little or no exercise",i:"🛋️"},{k:"light",l:"Lightly Active",d:"Walk sometimes, light exercise 1–3x/week",i:"🚶"},{k:"moderate",l:"Moderately Active",d:"Exercise 3–5x per week",i:"🏃"},{k:"active",l:"Very Active",d:"Hard training 6–7x/week",i:"🏋️"},{k:"very_active",l:"Extremely Active",d:"Physical job + daily training",i:"⚡"}];return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"20px 22px 16px",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}><button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14}}>←</button><ProgressDots total={4} current={2}/><h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Activity Level</h2><p style={{color:T.muted,fontSize:13}}>Step 3 of 4 — How active are you?</p></div><div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>{opts.map(o=>(<div key={o.k} onClick={()=>setP(x=>({...x,activity:o.k}))} style={{display:"flex",alignItems:"center",gap:13,padding:"13px 15px",marginBottom:9,background:p.activity===o.k?T.accentDim:"#0e0e16",border:`1.5px solid ${p.activity===o.k?T.accent:T.border}`,borderRadius:14,cursor:"pointer",transition:"all .18s"}}><span style={{fontSize:24}}>{o.i}</span><div style={{flex:1}}><p style={{fontSize:14,fontWeight:700,color:p.activity===o.k?T.accent:T.text,marginBottom:2}}>{o.l}</p><p style={{fontSize:12,color:T.muted}}>{o.d}</p></div>{p.activity===o.k&&<span style={{color:T.accent,fontSize:18}}>✓</span>}</div>))}<Btn onClick={onNext} disabled={!p.activity} style={{marginTop:8}}>Continue →</Btn></div></div>);}

function StepGoal({p,setP,onNext,onBack}){const goals=[{k:"lose_fast",l:"Lose Weight Fast",d:"-750 kcal/day · ~0.75 kg/week",i:"🔥"},{k:"lose",l:"Lose Weight",d:"-500 kcal/day · ~0.5 kg/week",i:"📉",best:true},{k:"lose_slow",l:"Lose Gradually",d:"-250 kcal/day · ~0.25 kg/week",i:"🌱"},{k:"maintain",l:"Maintain Weight",d:"Eat at maintenance calories",i:"⚖️"},{k:"gain",l:"Build Muscle",d:"+300 kcal/day · lean bulk",i:"💪"}];return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"20px 22px 16px",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}><button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14}}>←</button><ProgressDots total={4} current={3}/><h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Your Goal</h2><p style={{color:T.muted,fontSize:13}}>Step 4 of 4 — Sets your daily calorie target</p></div><div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>{goals.map(g=>(<div key={g.k} onClick={()=>setP(x=>({...x,goal:g.k}))} style={{display:"flex",alignItems:"center",gap:13,padding:"13px 15px",marginBottom:9,background:p.goal===g.k?T.accentDim:"#0e0e16",border:`1.5px solid ${p.goal===g.k?T.accent:T.border}`,borderRadius:14,cursor:"pointer",transition:"all .18s"}}><span style={{fontSize:24}}>{g.i}</span><div style={{flex:1}}><p style={{fontSize:14,fontWeight:700,color:p.goal===g.k?T.accent:T.text,marginBottom:2}}>{g.l}{g.best&&<span style={{fontSize:9,background:T.accent,color:"#000",borderRadius:5,padding:"2px 6px",marginLeft:7,fontWeight:800}}>BEST</span>}</p><p style={{fontSize:12,color:T.muted}}>{g.d}</p></div>{p.goal===g.k&&<span style={{color:T.accent,fontSize:18}}>✓</span>}</div>))}<Btn onClick={onNext} disabled={!p.goal} style={{marginTop:8}}>Calculate My Plan →</Btn></div></div>);}

function PlanReady({profile,goal,onStart}){const p=profile||{};const w=parseFloat(p.weight)||0,h=parseFloat(p.height)||0,a=parseFloat(p.age)||0;const acts={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};const bmr=w&&h&&a?Math.round(p.gender==="Male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161):0;const tdee=Math.round(bmr*(acts[p.activity]||1.375));const bmi=h>0?(w/((h/100)**2)).toFixed(1):0;const bi=bmi<18.5?["Underweight",T.blue]:bmi<25?["Healthy",T.accent]:bmi<30?["Overweight",T.orange]:["Obese",T.danger];return(<div className="fadeIn" style={{minHeight:"100vh",background:T.bg,backgroundImage:`radial-gradient(ellipse at 50% 10%, #00e5a010 0%, transparent 58%)`,paddingBottom:48}}><div style={{padding:"36px 22px 22px",textAlign:"center"}}><div className="pop" style={{width:76,height:76,borderRadius:22,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 18px",boxShadow:`0 0 40px ${T.accentGlow}`}}>🎯</div><h2 style={{fontSize:26,fontWeight:900,marginBottom:7,color:T.text}}>Your Plan is Ready,<br/><span style={{color:T.accent}}>{p.name}!</span></h2><p style={{color:T.muted,fontSize:13}}>Here are your personalised targets</p></div><div style={{padding:"0 18px",maxWidth:480,margin:"0 auto"}}><div style={{background:`linear-gradient(135deg,#0e1a12,#091410)`,border:`1.5px solid ${T.accent}45`,borderRadius:20,padding:"26px 20px",marginBottom:13,textAlign:"center"}}><p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:9}}>Daily Calorie Goal</p><p style={{fontSize:64,fontWeight:900,color:T.accent,lineHeight:1}}>{goal}</p><p style={{fontSize:13,color:T.muted,marginTop:5}}>kcal per day</p></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:13}}>{[["BMR",`${bmr} kcal`,"Calories at rest",T.blue],["TDEE",`${tdee} kcal`,"Maintenance",T.orange],["BMI",bi[0],`${bmi} kg/m²`,bi[1]],["Target",p.targetWeight?`${p.targetWeight} kg`:"—","Goal weight",T.accent]].map(([l,v,s,c])=>(<div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"13px 15px"}}><p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".6px",marginBottom:5}}>{l}</p><p style={{fontSize:16,fontWeight:800,color:c,marginBottom:3}}>{v}</p><p style={{fontSize:11,color:T.muted}}>{s}</p></div>))}</div><Card><CardTitle icon="⚗️">Recommended Daily Macros</CardTitle><MacroBar label={`Protein — ${Math.round(goal*.3/4)}g`} val={Math.round(goal*.3/4)} max={200} color={T.blue}/><MacroBar label={`Carbs — ${Math.round(goal*.45/4)}g`} val={Math.round(goal*.45/4)} max={350} color={T.orange}/><MacroBar label={`Fat — ${Math.round(goal*.25/9)}g`} val={Math.round(goal*.25/9)} max={100} color="#ff6b9d"/></Card><Btn onClick={onStart} style={{fontSize:16,padding:"15px"}}>🚀 Start Tracking</Btn></div></div>);}

function TrackerApp({profile,goal,uid,onEditProfile,onSignOut}){
  const[tab,setTab]=useState("analyze");
  const[image,setImage]=useState(null);
  const[imgB64,setImgB64]=useState(null);
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const[error,setError]=useState(null);
  const[textFood,setTextFood]=useState("");
  const[consumed,setConsumed]=useState(0);
  const[mealLog,setMealLog]=useState([]);
  const[allHistory,setAllHistory]=useState([]);
  const[remaining,setRemaining]=useState(()=>getRemainingAnalyses(uid));
  const[water,setWater]=useState(0);
  const[stats,setStats]=useState({streak:1,totalMeals:0,waterGoalHits:0,daysUnderGoal:0,earlyBreakfast:0});
  const[saving,setSaving]=useState(false);
  const[recentDays,setRecentDays]=useState({});
  const[toast,setToast]=useState(null);
  const[tipCardIdx,setTipCardIdx]=useState(0);
  const[placeholderIdx,setPlaceholderIdx]=useState(0);
  const[showClarifier,setShowClarifier]=useState(false);
  const[clarifyFood,setClarifyFood]=useState('');
  const[selectedPortion,setSelectedPortion]=useState(null);
  const[customPortion,setCustomPortion]=useState('');
  const[clarifiedFoods,setClarifiedFoods]=useState(new Set());
  const[showPortionAdjust,setShowPortionAdjust]=useState(false);
  const[portionMultiplier,setPortionMultiplier]=useState(1);
  const fileRef=useRef();
  const tipIdx=useState(()=>Math.floor(Math.random()*coachTips.length))[0];

  const VAGUE_FOODS=['rice','pasta','pizza','bread','chicken','meat','soup','salad','chips','fries','cake','biscuit','biscuits','beans','yam','plantain','stew','sauce','juice','smoothie','sandwich','burger','noodles','spaghetti','pap','eba','fufu','amala','semovita','oats','cereal','yogurt','ice cream','chocolate','cookie','moi moi','akara','suya','shawarma','wrap','roll','pie','curry','stir fry','fried rice','egg','eggs','fried egg'];
  const PORTION_OPTIONS={
    'rice':[['🥄','Half a cup'],['🍚','1 cup'],['🍛','2 cups / full plate']],
    'jollof rice':[['🥄','Half a cup'],['🍚','1 cup'],['🍛','Full plate']],
    'fried rice':[['🥄','Half a cup'],['🍚','1 cup'],['🍛','Full plate']],
    'pizza':[['🍕','1 slice'],['🍕','2 slices'],['📦','3+ slices']],
    'chicken':[['🍗','1 small piece'],['🍗','1 large piece'],['🍽️','2-3 pieces']],
    'bread':[['🍞','1 slice'],['🍞','2 slices'],['🥪','Full sandwich']],
    'fries':[['🍟','Small portion'],['🍟','Medium portion'],['🍟','Large portion']],
    'chips':[['🍟','Small portion'],['🍟','Medium portion'],['🍟','Large portion']],
    'pasta':[['🍝','Half a plate'],['🍝','Full plate'],['🍝','Large bowl']],
    'spaghetti':[['🍝','Half a plate'],['🍝','Full plate'],['🍝','Large bowl']],
    'noodles':[['🍝','Half a pack'],['🍝','1 full pack'],['🍝','2 packs']],
    'suya':[['🥩','Small stick'],['🥩','2-3 sticks'],['🍱','Full plate']],
    'cake':[['🎂','1 small slice'],['🎂','1 large slice'],['🎂','2 slices']],
    'fufu':[['🍚','Small wrap'],['🍚','Medium wrap'],['🍚','Large wrap']],
    'eba':[['🍚','Small wrap'],['🍚','Medium wrap'],['🍚','Large wrap']],
    'amala':[['🍚','Small wrap'],['🍚','Medium wrap'],['🍚','Large wrap']],
    'eggs':[['🥚','1 egg'],['🥚','2 eggs'],['🍳','3 eggs / omelette']],
    'fried egg':[['🥚','1 egg'],['🥚','2 eggs'],['🍳','3 eggs']],
    'egg':[['🥚','1 egg'],['🥚','2 eggs'],['🍳','3 eggs']],
    '_default':[['🍽️','Small portion'],['🍽️','Medium portion'],['🍽️','Large portion']]
  };
  const isVagueInput=(text)=>{
    if(!text)return false;
    const t=text.trim().toLowerCase();
    const words=t.split(/\s+/);
    if(/\d/.test(t))return false;
    if(/(cup|cups|slice|slices|piece|pieces|gram|grams|plate|bowl|small|medium|large|half|full|pack|stick|glass|bottle|can|tablespoon|teaspoon|oz|ml|liter)/i.test(t))return false;
    if(words.length<=2){
      if(VAGUE_FOODS.some(f=>t===f||t.includes(f)))return true;
      if(words.length===1)return true;
    }
    return false;
  };
  const getPortionOptions=(food)=>{
    const f=food.trim().toLowerCase();
    for(const key of Object.keys(PORTION_OPTIONS)){
      if(key!=='_default'&&(f===key||f.includes(key)))return PORTION_OPTIONS[key];
    }
    return PORTION_OPTIONS['_default'];
  };
  const confirmClarifyRef=useRef(false);
  const confirmClarify=()=>{
    const portion=customPortion||selectedPortion;
    if(!portion)return;
    const improved=`${portion} of ${clarifyFood}`;
    const newSet=new Set(clarifiedFoods);
    newSet.add(clarifyFood.toLowerCase());
    newSet.add(improved.toLowerCase());
    setClarifiedFoods(newSet);
    setTextFood(improved);
    setShowClarifier(false);
    confirmClarifyRef.current=true;
  };
  useEffect(()=>{if(confirmClarifyRef.current&&textFood&&!showClarifier){confirmClarifyRef.current=false;analyze();}},[textFood,showClarifier]);

  const placeholders=["Enter your meal e.g. Jollof rice with chicken","Enter your meal e.g. Big Mac meal","Enter your meal e.g. Greek salad with feta","Enter your meal e.g. Pounded yam and egusi","Enter your meal e.g. Avocado toast with eggs"];

  useEffect(()=>{
    const interval=setInterval(()=>{setPlaceholderIdx(i=>(i+1)%placeholders.length);},3000);
    return()=>clearInterval(interval);
  },[]);

  // Toast auto-clear
  useEffect(()=>{
    if(!toast)return;
    const t=setTimeout(()=>setToast(null),3000);
    return()=>clearTimeout(t);
  },[toast]);

  useEffect(()=>{if(!uid)return;(async()=>{const[today,history,savedStats,days]=await Promise.all([loadTodayData(uid),loadHistory(uid),loadStats(uid),loadRecentDays(uid,14)]);if(today){setConsumed(today.consumed||0);setMealLog(today.meals||[]);setWater(today.water||0);}if(history)setAllHistory(history);setRecentDays(days);const realStreak=calcStreak(days);if(savedStats){setStats({...savedStats,streak:realStreak});}else{setStats(s=>({...s,streak:realStreak}));}})();},[uid]);

  useEffect(()=>{if(!uid)return;const t=setTimeout(async()=>{setSaving(true);await saveTodayData(uid,{consumed,meals:mealLog,water});// Recalculate streak with today's updated data
    const todayKey=new Date().toISOString().split("T")[0];const updatedDays={...recentDays,[todayKey]:{consumed,meals:mealLog,water}};setRecentDays(updatedDays);const realStreak=calcStreak(updatedDays);const newStats={...stats,streak:realStreak,totalMeals:allHistory.length,waterGoalHits:water>=8?Math.max(stats.waterGoalHits,1):stats.waterGoalHits,daysUnderGoal:consumed>0&&consumed<=goal?Math.max(stats.daysUnderGoal,1):stats.daysUnderGoal,earlyBreakfast:mealLog.some(m=>parseInt(m.time)<9)?Math.max(stats.earlyBreakfast,1):stats.earlyBreakfast};await saveStats(uid,newStats);setStats(newStats);setSaving(false);},1500);return()=>clearTimeout(t);},[consumed,mealLog,water]);

  // Build real 7-day chart — inject today's live consumed value
  const weekData=(()=>{const wd=buildWeekData(recentDays);const todayKey=new Date().toISOString().split("T")[0];return wd.map(d=>d.isToday?{...d,cal:consumed}:d);})();
  const rem=goal-consumed;
  const hc=result?(result.healthScore>=7?T.accent:result.healthScore>=4?T.orange:T.danger):T.accent;

  const compressImage=(file)=>new Promise((resolve)=>{const img=new Image();img.onload=()=>{const canvas=document.createElement("canvas");const MAX=1024;let w=img.width,h=img.height;if(w>MAX||h>MAX){if(w>h){h=Math.round(h*(MAX/w));w=MAX;}else{w=Math.round(w*(MAX/h));h=MAX;}}canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,w,h);const dataUrl=canvas.toDataURL("image/jpeg",0.7);resolve(dataUrl);};img.src=URL.createObjectURL(file);});
  const handleFile=async(file)=>{if(!file)return;setResult(null);setError(null);try{const dataUrl=await compressImage(file);setImage(dataUrl);setImgB64(dataUrl.split(",")[1]);}catch(e){setError("Error reading image: "+e.message);}};

  const analyze=async()=>{if(!imgB64&&!textFood)return;if(remaining<=0){setError("You've used all 5 analyses for today. Come back tomorrow for 5 more!");return;}
    if(!imgB64&&textFood&&isVagueInput(textFood)&&!clarifiedFoods.has(textFood.toLowerCase())){setClarifyFood(textFood);setSelectedPortion(null);setCustomPortion('');setShowClarifier(true);return;}
    setLoading(true);setError(null);try{
    const content=imgB64?[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgB64}},{type:"text",text:`Analyze this food image. Return ONLY valid JSON no markdown.`}]:`Analyze "${textFood}". Return ONLY valid JSON.`;
    const body={content,foodText:textFood||null,userProfile:{age:profile.age,gender:profile.gender,weight:profile.weight,consumed,goal}};
    const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(!res.ok){let msg="Server error ("+res.status+")";try{const err=await res.json();msg=err.error?.message||err.error||msg;}catch(e){}throw new Error(msg);}const data=await res.json();if(data.error)throw new Error(data.error.message||JSON.stringify(data.error));const txt=data.content.map(i=>i.text||"").join("");const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());parsed._source=data._source||"claude";parsed.totalCalories=Math.round(Number(parsed.totalCalories)||Number(parsed.calories)||0);parsed.protein=Math.round((Number(parsed.protein)||0)*10)/10;parsed.carbs=Math.round((Number(parsed.carbs)||0)*10)/10;parsed.fat=Math.round((Number(parsed.fat)||0)*10)/10;parsed.fiber=Math.round((Number(parsed.fiber)||0)*10)/10;parsed.healthScore=Math.round(Number(parsed.healthScore)||Number(parsed.health_score)||5);parsed.foodName=parsed.foodName||parsed.food_name||parsed.name||"Unknown food";setResult(parsed);incrementUsage(uid);setRemaining(getRemainingAnalyses(uid));}catch(err){setError("Error: "+err.message);}setLoading(false);};

  const logMeal=async(meal)=>{const m=meal||result;if(!m)return;const entry={...m,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};setConsumed(c=>c+m.totalCalories);setMealLog(l=>[...l,entry]);setAllHistory(h=>[...h,entry]);if(uid)await addMealToHistory(uid,entry);setToast("🍽️ "+m.foodName+" logged!");if(!meal){setResult(null);setImage(null);setImgB64(null);setTextFood("");}};

  const coachMsg=()=>{const pct=Math.round((consumed/goal)*100);if(consumed===0)return{msg:coachGreeting(profile.name),color:T.accent};if(pct<50)return{msg:`You've had ${consumed} kcal so far. ${goal-consumed} more to go today.`,color:T.blue};if(pct<90)return{msg:`Almost at your goal! Just ${goal-consumed} kcal left. Keep it up! 💪`,color:T.orange};if(pct<=105)return{msg:`Goal reached! Great discipline today, ${profile.name}. 🌙`,color:T.accent};return{msg:`You're ${consumed-goal} kcal over today. Go easy on the next meal.`,color:T.danger};};
  const cm=coachMsg();
  const earned=BADGES.filter(b=>b.check(stats));
  const locked=BADGES.filter(b=>!b.check(stats));

  const pct=Math.round(Math.min((consumed/goal)*100,100));
  const ringR=70;const ringC=2*Math.PI*ringR;
  const ringColor=pct<75?T.accent:pct<100?T.orange:T.danger;

  // Active tab indicator position
  const tabKeys=["analyze","log","progress","me"];
  const activeTabIdx=tabKeys.indexOf(tab);

  // Result card helpers
  const verdictText=result?(result.verdict||(result.totalCalories>600?"This is a calorie-dense meal. Consider pairing with lighter meals for the rest of the day.":result.healthScore>=7?"A well-balanced meal with good nutritional value. Keep it up!":"A decent choice. Try adding more vegetables or protein to boost nutrition.")):null;
  const remainingAfter=result?(goal-consumed-result.totalCalories):0;

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",color:T.text}}>
    {/* ── Toast Notification ── */}
    {toast&&(<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${T.accent},#00b87a)`,color:"#000",padding:"12px 24px",borderRadius:16,fontSize:14,fontWeight:700,zIndex:9999,animation:"slideUp .3s ease forwards",boxShadow:`0 8px 32px ${T.accentGlow}`,maxWidth:"90%",textAlign:"center"}}>{toast}</div>)}

    {/* ── Premium Frosted Header ── */}
    <div style={{padding:"14px 18px 0",background:"linear-gradient(180deg,rgba(14,14,24,0.95),rgba(12,12,19,0.9))",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:10,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <div className="logo-pulse" style={{width:42,height:42,borderRadius:14,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 16px ${T.accentGlow}`,flexShrink:0}}>🍽️</div>
        <span style={{fontSize:16,fontWeight:800,color:T.text,flex:1}}>Bitelyze</span>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#2a1a0a,#1a0f05)",border:`1px solid ${T.orange}35`,borderRadius:24,padding:"5px 12px",boxShadow:`0 0 16px ${T.orange}15`,flexShrink:0}}><span style={{fontSize:14}}>🔥</span><span className="bounce-pop" style={{fontSize:13,fontWeight:900,color:T.orange}}>{stats.streak}d</span></div>
        <button onClick={onSignOut} style={{background:"#16162a",border:`1px solid ${T.border}`,color:T.muted,borderRadius:10,padding:"7px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,transition:"all .2s",flexShrink:0}}>↩ Out</button>
      </div>
      {/* Slim calorie progress bar */}
      <div style={{height:4,borderRadius:99,background:"#1a1a28",overflow:"hidden",marginBottom:0}}>
        <div style={{height:"100%",width:`${Math.min((consumed/goal)*100,100)}%`,background:pct<50?T.accent:pct<85?`linear-gradient(90deg,${T.accent},${T.orange})`:`linear-gradient(90deg,${T.orange},${T.danger})`,borderRadius:99,transition:"width .8s cubic-bezier(0.16,1,0.3,1)"}}/>
      </div>
    </div>

    {/* ── Calorie Ring Summary — 160px ── */}
    <div style={{padding:"24px 18px 18px",background:"linear-gradient(180deg,#0c0c15,#08080e)"}}>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        <div style={{position:"relative",flexShrink:0}} className="ring-glow">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={ringColor}/>
                <stop offset="100%" stopColor={pct<75?"#00b87a":pct<100?"#e65c00":"#cc2936"}/>
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r={ringR} fill="none" stroke="#1a1a28" strokeWidth="10"/>
            <circle cx="80" cy="80" r={ringR} fill="none" stroke="url(#rg)" strokeWidth="10" strokeDasharray={ringC} strokeDashoffset={ringC*(1-Math.min(consumed/goal,1))} strokeLinecap="round" transform="rotate(-90 80 80)" style={{transition:"stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)"}} className="shimmer-ring"/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:32,fontWeight:900,color:ringColor,lineHeight:1}}><CountUp target={consumed} duration={1000}/></span>
            <span style={{fontSize:11,color:T.muted,marginTop:3,fontWeight:500}}>of {goal} kcal</span>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
          {[["Eaten",consumed,T.accent,"🍽️"],["Remaining",Math.max(rem,0),T.blue,"🎯"],["Goal",goal,T.orange,"⚡"]].map(([l,v,c,ic])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:8,background:l==="Goal"?"#1a1208":`${c}08`,border:`1px solid ${l==="Goal"?T.orange+"40":c+"18"}`,borderRadius:12,padding:"7px 10px"}}>
            <span style={{fontSize:12}}>{ic}</span>
            <div style={{flex:1}}>
              <span style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".4px",fontWeight:600,display:"block",lineHeight:1}}>{l}</span>
              <span style={{fontSize:20,fontWeight:900,color:c,display:"block",letterSpacing:"-0.02em",lineHeight:1.3}}>{v}</span>
            </div>
          </div>))}
        </div>
      </div>
      {/* saving indicator removed — saves silently */}
    </div>

    {/* ── Coach Card with swipeable tips ── */}
    <div style={{margin:"0 16px",padding:"16px 18px",background:`linear-gradient(145deg,${cm.color}0a,${cm.color}05)`,border:`1px solid ${cm.color}25`,borderRadius:18,marginTop:12,boxShadow:`0 4px 24px ${cm.color}08`}}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
        <div className="bob-float" style={{width:36,height:36,borderRadius:12,background:`${cm.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,border:`1px solid ${cm.color}25`}}>🧠</div>
        <div><p style={{fontSize:10,fontWeight:700,color:cm.color,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>Your Coach</p><p style={{fontSize:13,color:T.text,lineHeight:1.6,fontWeight:500}}>{cm.msg}</p></div>
      </div>
      <div onClick={()=>setTipCardIdx(i=>(i+1)%coachTips.length)} style={{padding:"10px 14px",background:"rgba(255,255,255,0.03)",borderRadius:12,borderLeft:`3px solid ${T.orange}`,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.02)",cursor:"pointer",transition:"all .2s"}}>
        <p style={{fontSize:12,color:"#d0c090",lineHeight:1.55}}>{coachTips[tipCardIdx]}</p>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:8}}>
        {coachTips.map((_,i)=>(<div key={i} style={{width:i===tipCardIdx?14:5,height:5,borderRadius:99,background:i===tipCardIdx?T.orange:T.border,transition:"all .3s"}}/>))}
      </div>
    </div>

    {/* ── Frosted Tab Bar ── */}
    <div style={{display:"flex",margin:"14px 16px 0",background:"rgba(14,14,24,0.85)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:16,padding:4,border:`1px solid ${T.border}`,position:"relative",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
      {/* Sliding indicator */}
      <div style={{position:"absolute",top:4,left:`calc(${activeTabIdx*25}% + 4px)`,width:"calc(25% - 4px)",height:"calc(100% - 8px)",background:`linear-gradient(135deg,${T.accent}18,${T.accent}08)`,borderRadius:12,transition:"left .3s cubic-bezier(0.16,1,0.3,1)",boxShadow:`0 0 12px ${T.accent}15,inset 0 1px 0 rgba(255,255,255,0.04)`,pointerEvents:"none"}}/>
      {[["analyze","📸","Analyze"],["log","📋","Log"],["progress","📊","Progress"],["me","👤","Me"]].map(([k,ic,lb])=>(<button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 4px",border:"none",background:"transparent",color:tab===k?T.accent:T.muted,fontWeight:700,cursor:"pointer",borderRadius:12,transition:"all .25s cubic-bezier(0.16,1,0.3,1)",fontFamily:"inherit",position:"relative",zIndex:1,opacity:tab===k?1:0.5,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
        <span style={{fontSize:20,display:"inline-block"}}>{ic}</span>
        <span style={{fontSize:10,fontWeight:700,color:tab===k?T.accent:T.muted}}>{lb}</span>
      </button>))}
    </div>

    <div style={{padding:"16px 16px 80px",maxWidth:480,margin:"0 auto"}}>
      {tab==="analyze"&&(<>
        {!image?(<div className="upload breathe" onClick={()=>fileRef.current.click()} style={{border:`2px dashed ${T.border}`,borderRadius:20,padding:"32px 20px",textAlign:"center",cursor:"pointer",background:"linear-gradient(145deg,#0e0e18,#0a0a14)",marginBottom:12,transition:"all .25s",boxShadow:"0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)"}}>
          <div style={{width:56,height:56,borderRadius:18,background:`${T.accent}12`,border:`1px solid ${T.accent}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>📷</div>
          <p style={{fontWeight:800,fontSize:15,marginBottom:4,letterSpacing:"-0.01em"}}>Snap or upload your meal</p>
          <p style={{fontSize:12,color:T.muted}}>JPG or PNG • or type food name below</p>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
        </div>):(<div style={{position:"relative",marginBottom:12}}>
          <img src={image} alt="food" style={{width:"100%",borderRadius:18,maxHeight:240,objectFit:"cover",border:`1px solid ${T.border}`,boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}/>
          <button onClick={()=>{setImage(null);setImgB64(null);setResult(null);}} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",border:`1px solid ${T.border}`,color:"#fff",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>✕</button>
        </div>)}
        {!image&&(<input style={{width:"100%",padding:"14px 16px",background:"#0e0e18",border:`1.5px solid ${T.border}`,borderRadius:14,color:T.text,fontSize:14,outline:"none",marginBottom:12,fontFamily:"inherit",transition:"border-color .2s",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.2)"}} placeholder={placeholders[placeholderIdx]} value={textFood} onChange={e=>setTextFood(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()} onFocus={e=>e.target.style.borderColor=T.accent+"60"} onBlur={e=>e.target.style.borderColor=T.border}/>)}
        {remaining<=0?(<div style={{background:"linear-gradient(135deg,#1a1a0a,#1a150a)",border:`1px solid ${T.orange}30`,borderRadius:16,padding:"20px 18px",textAlign:"center",marginBottom:12}}>
          <p style={{fontSize:28,marginBottom:8}}>⏳</p>
          <p style={{fontSize:15,fontWeight:800,color:T.orange,marginBottom:6}}>Daily limit reached</p>
          <p style={{fontSize:13,color:T.muted,lineHeight:1.6}}>You've used all 5 free analyses for today.<br/>Come back tomorrow for 5 more!</p>
        </div>):(<>
          <Btn onClick={analyze} disabled={(!image&&!textFood)||loading}>{loading?"Analyzing...":"🔍 Analyze Calories"}</Btn>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:10}}>
            {[...Array(DAILY_LIMIT)].map((_,i)=>(<div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<remaining?T.accent:T.border,transition:"background .3s",boxShadow:i<remaining?`0 0 8px ${T.accentGlow}`:"none"}}/>))}
            <span style={{fontSize:11,color:remaining<=1?T.orange:T.muted,fontWeight:600,marginLeft:4}}>{remaining} of {DAILY_LIMIT} analyses left today</span>
          </div>
        </>)}
        {loading&&<AnalyzeLoader/>}
        {error&&<div style={{background:"linear-gradient(135deg,#1a0a0a,#1a0f0f)",border:`1px solid ${T.danger}30`,borderRadius:14,padding:"13px 16px",marginTop:14,color:T.danger,fontSize:13,boxShadow:`0 4px 16px ${T.danger}10`}}>⚠️ {error}</div>}

        {showClarifier&&(<>
          <div onClick={()=>setShowClarifier(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:50,animation:"fadeIn .2s ease"}}/>
          <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.card,borderRadius:"24px 24px 0 0",padding:"28px 22px 36px",zIndex:51,animation:"slideUp .4s cubic-bezier(0.34,1.56,0.64,1)",border:`1px solid ${T.border}`,maxHeight:"70vh",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:28,animation:"bobFloat 2s ease-in-out infinite"}}>🤔</span>
              <div>
                <p style={{fontSize:16,fontWeight:800,color:T.text}}>Just to be accurate...</p>
                <p style={{fontSize:13,color:T.muted}}>How much <span style={{color:T.accent,fontWeight:700}}>{clarifyFood}</span> did you have?</p>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:18,marginBottom:16,flexWrap:"wrap"}}>
              {getPortionOptions(clarifyFood).map(([icon,label],i)=>(<button key={i} onClick={()=>{setSelectedPortion(label);setCustomPortion('');}} style={{flex:1,minWidth:90,padding:"14px 10px",borderRadius:14,border:`1.5px solid ${selectedPortion===label?T.accent:T.border}`,background:selectedPortion===label?T.accentDim:"#0e0e16",color:selectedPortion===label?T.accent:T.text,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",textAlign:"center"}}><span style={{fontSize:20,display:"block",marginBottom:4}}>{icon}</span>{label}{selectedPortion===label&&" ✓"}</button>))}
            </div>
            <input value={customPortion} onChange={e=>{setCustomPortion(e.target.value);setSelectedPortion(null);}} placeholder="Enter your portion size" style={{width:"100%",padding:"12px 16px",background:"#0e0e16",border:`1.5px solid ${T.border}`,borderRadius:12,color:T.text,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:16}}/>
            <Btn onClick={confirmClarify} disabled={!selectedPortion&&!customPortion}>Analyse This →</Btn>
            <p style={{textAlign:"center",fontSize:11,color:T.muted,marginTop:8}}>This helps us give you accurate calorie data</p>
          </div>
        </>)}

        {/* ── RESULT CARD ── */}
        {result&&!loading&&(<div className="fadeUp" style={{marginTop:18}}>

          {/* Section 1 — Meal Identity */}
          <div style={{background:`linear-gradient(145deg,#0f1a14,#0a1410)`,border:`1.5px solid ${T.accent}30`,borderRadius:22,overflow:"hidden",marginBottom:14,boxShadow:`0 8px 40px ${T.accent}10, inset 0 1px 0 rgba(255,255,255,0.04)`,position:"relative"}}>
            {/* Colored verdict banner */}
            <div style={{padding:"8px 16px",background:result.healthScore>=7?"#00e5a018":result.healthScore>=4?"#ff6b3518":"#ff475718",borderBottom:`1px solid ${result.healthScore>=7?T.accent:result.healthScore>=4?T.orange:T.danger}20`,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <span style={{fontSize:12,fontWeight:700,color:result.healthScore>=7?T.accent:result.healthScore>=4?T.orange:T.danger}}>
                {result.healthScore>=7?"Nutritious Choice ✓":result.healthScore>=4?"Moderate — Balance Your Day":"High Calorie — Plan Accordingly"}
              </span>
            </div>
            <div style={{padding:"18px 20px",position:"relative"}}>
              <div style={{position:"absolute",top:"-30%",right:"-20%",width:180,height:180,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}08,transparent 70%)`,pointerEvents:"none"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
                <div style={{flex:1,paddingRight:16}}>
                  <p style={{fontSize:22,fontWeight:900,marginBottom:4,letterSpacing:"-0.02em",lineHeight:1.2}}>{result.foodName}</p>
                  <p style={{fontSize:12,color:T.muted,fontWeight:500}}>{result.servingSize}</p>
                  {result._source==="usda+claude"&&<span style={{fontSize:9,background:T.accentDim,border:`1px solid ${T.accent}30`,color:T.accent,borderRadius:6,padding:"2px 7px",fontWeight:700,marginTop:6,display:"inline-block"}}>USDA Verified</span>}
                </div>
                <HealthScoreCircle score={result.healthScore}/>
              </div>
            </div>
          </div>

          {/* Section 2 — Calorie Hero */}
          <Card style={{textAlign:"center",padding:"20px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"-40%",left:"50%",transform:"translateX(-50%)",width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}0a,transparent 70%)`,pointerEvents:"none"}}/>
            <span style={{fontSize:48,fontWeight:900,color:T.accent,letterSpacing:"-0.03em",textShadow:`0 0 40px ${T.accentGlow}`,display:"block",lineHeight:1,position:"relative"}}><CountUp target={result.totalCalories} duration={1000}/></span>
            <span style={{fontSize:14,color:T.muted,fontWeight:600,position:"relative"}}>kcal</span>
            <div style={{margin:"14px 0 8px",height:8,borderRadius:99,background:"#1a1a28",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min((result.totalCalories/goal)*100,100)}%`,background:`linear-gradient(90deg,${T.accent},${T.orange})`,borderRadius:99,transition:"width 1s cubic-bezier(0.16,1,0.3,1)"}}/>
            </div>
            <p style={{fontSize:12,color:T.muted,fontWeight:500}}>{Math.round((result.totalCalories/goal)*100)}% of your daily goal</p>
          </Card>

          {/* Portion Adjustment for photos */}
          {imgB64&&!result._adjusted&&(<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#0e0e18",borderRadius:12,marginBottom:14,border:`1px solid ${T.border}`}}>
            <span style={{fontSize:14}}>📏</span>
            <span style={{fontSize:12,color:T.muted,flex:1}}>Is this portion accurate?</span>
            <button onClick={()=>setResult(r=>({...r,_adjusted:true}))} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${T.accent}30`,background:T.accentDim,color:T.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Looks right ✓</button>
            <button onClick={()=>setShowPortionAdjust(!showPortionAdjust)} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${T.orange}30`,background:`${T.orange}10`,color:T.orange,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Adjust</button>
          </div>)}
          {showPortionAdjust&&(<div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {[['−50%',0.5],['−25%',0.75],['+25%',1.25],['+50%',1.5],['+100%',2]].map(([label,mult])=>(<button key={label} onClick={()=>{
              setPortionMultiplier(mult);
              setResult(r=>({...r,
                totalCalories:Math.round((r._origCal||r.totalCalories)*mult),
                protein:Math.round((r._origProt||r.protein)*mult*10)/10,
                carbs:Math.round((r._origCarb||r.carbs)*mult*10)/10,
                fat:Math.round((r._origFat||r.fat)*mult*10)/10,
                fiber:Math.round((r._origFib||r.fiber)*mult*10)/10,
                _origCal:r._origCal||r.totalCalories,_origProt:r._origProt||r.protein,
                _origCarb:r._origCarb||r.carbs,_origFat:r._origFat||r.fat,_origFib:r._origFib||r.fiber,
                _adjusted:true
              }));
              setShowPortionAdjust(false);
            }} style={{padding:"8px 14px",borderRadius:10,border:`1.5px solid ${portionMultiplier===mult?T.accent:T.border}`,background:portionMultiplier===mult?T.accentDim:"#0e0e16",color:portionMultiplier===mult?T.accent:T.text,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>{label}</button>))}
          </div>)}
          {result._adjusted&&portionMultiplier!==1&&(<div style={{display:"inline-flex",alignItems:"center",gap:4,background:`${T.blue}15`,border:`1px solid ${T.blue}30`,borderRadius:8,padding:"3px 10px",fontSize:10,color:T.blue,fontWeight:700,marginBottom:12}}>Adjusted {portionMultiplier>1?"+":"−"}{Math.abs(Math.round((portionMultiplier-1)*100))}%</div>)}

          {/* Section 3 — Macronutrients */}
          <Card>
            <CardTitle icon="⚗️">Macronutrients</CardTitle>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
              {[["Protein",result.protein,T.blue],["Carbs",result.carbs,T.orange],["Fat",result.fat,"#ff6b9d"],["Fiber",result.fiber,T.accent]].map(([l,v,c])=>(<div key={l} style={{textAlign:"center",background:`${c}08`,borderRadius:12,padding:"10px 4px",border:`1px solid ${c}15`}}>
                <span style={{fontSize:20,fontWeight:900,color:c,display:"block",lineHeight:1,marginBottom:4}}>{v}g</span>
                <span style={{fontSize:10,color:T.muted,fontWeight:500}}>{l}</span>
              </div>))}
            </div>
            <MacroBar label="Protein" val={result.protein} max={150} color={T.blue}/>
            <MacroBar label="Carbs" val={result.carbs} max={300} color={T.orange}/>
            <MacroBar label="Fat" val={result.fat} max={80} color="#ff6b9d"/>
            <MacroBar label="Fiber" val={result.fiber} max={40} color={T.accent}/>
            {result.protein<15&&(<div style={{background:`${T.blue}10`,border:`1px solid ${T.blue}25`,borderRadius:10,padding:"10px 14px",marginTop:8}}>
              <p style={{fontSize:12,color:T.blue,fontWeight:600}}>⚠️ Low protein — add a protein source to your next meal</p>
            </div>)}
          </Card>

          {/* Section 4 — Meal Verdict */}
          <Card style={{borderLeft:`3px solid ${hc}`,padding:"16px 18px"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:22,flexShrink:0}}>🧑‍⚕️</span>
              <div>
                <p style={{fontSize:11,fontWeight:700,color:hc,textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>Meal Verdict</p>
                <p style={{fontSize:13,color:T.text,lineHeight:1.65,fontWeight:500}}>{verdictText}</p>
              </div>
            </div>
          </Card>

          {/* Section 5 — Coach Suggestions */}
          {result.suggestions&&result.suggestions.length>0&&(<Card>
            <CardTitle icon="💡">Coach Suggestions</CardTitle>
            {result.suggestions.slice(0,4).map((s,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<Math.min(result.suggestions.length,4)-1?`1px solid ${T.border}`:"none",animation:`staggerIn .4s ease ${i*0.1}s both`}}>
              <span style={{fontSize:17,flexShrink:0}}>{s.icon}</span>
              <span style={{fontSize:13,lineHeight:1.6,color:"#c8c8e0"}}>{s.text}</span>
            </div>))}
          </Card>)}

          {/* Section 6 — Smarter Swaps (replaces Burn It Off) */}
          {result.smarterSwaps&&result.smarterSwaps.length>0&&(<Card>
            <CardTitle icon="🔄">Smarter Swaps</CardTitle>
            {result.smarterSwaps.map((sw,i)=>(<div key={i} style={{padding:"12px 0",borderBottom:i<result.smarterSwaps.length-1?`1px solid ${T.border}`:"none",animation:`staggerIn .4s ease ${i*0.12}s both`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:700,color:T.danger,opacity:0.85,textDecoration:"line-through"}}>{sw.from}</span>
                <span style={{fontSize:14,color:T.muted}}>→</span>
                <span style={{fontSize:13,fontWeight:700,color:T.accent}}>{sw.to}</span>
              </div>
              <p style={{fontSize:11,color:T.muted,lineHeight:1.5,paddingLeft:2}}>{sw.reason}</p>
            </div>))}
          </Card>)}

          {/* Section 7 — Remaining Today */}
          <Card style={{background:remainingAfter>goal*0.25?`linear-gradient(145deg,#0a1a12,#081410)`:remainingAfter>=0?`linear-gradient(145deg,#1a1808,#141006)`:`linear-gradient(145deg,#1a0a0a,#140808)`,borderColor:remainingAfter>goal*0.25?`${T.accent}25`:remainingAfter>=0?`${T.orange}25`:`${T.danger}25`}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:24}}>{remainingAfter>goal*0.25?"✅":remainingAfter>=0?"⚠️":"🚨"}</span>
              <div>
                <p style={{fontSize:11,color:T.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px",marginBottom:3}}>If you log this</p>
                {remainingAfter>=0?(
                  <p style={{fontSize:15,fontWeight:800,color:remainingAfter>goal*0.25?T.accent:T.orange}}>{remainingAfter} kcal left today</p>
                ):(
                  <p style={{fontSize:15,fontWeight:800,color:T.danger}}>This puts you {Math.abs(remainingAfter)} kcal over your goal</p>
                )}
              </div>
            </div>
          </Card>

          {/* Log Meal + Analyse Another */}
          <button className="pulse-glow ripple" onClick={()=>logMeal()} style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${T.accent},#00b87a)`,color:"#000",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"inherit",marginBottom:6,transition:"all .2s"}}>✅ Log This Meal</button>
          <p style={{fontSize:11,color:T.muted,textAlign:"center",marginBottom:12}}>Logged meals are saved to today's diary</p>
          <button onClick={()=>{setResult(null);setImage(null);setImgB64(null);setTextFood("");}} className="ripple" style={{width:"100%",padding:"13px",borderRadius:14,border:`1px solid ${T.border}`,background:"#16162a",color:T.text,cursor:"pointer",fontSize:14,fontFamily:"inherit",fontWeight:600,transition:"all .2s"}}>📸 Analyse Another</button>

        </div>)}

        {/* Recent meals quick-add */}
        {allHistory.length>0&&(<Card style={{marginTop:18}}><CardTitle icon="🕒">Recent — Tap to Re-log</CardTitle>{allHistory.filter((m,i,a)=>a.findIndex(x=>x.foodName===m.foodName)===i).slice(0,5).map((m,i,arr)=>(<div key={i} onClick={()=>logMeal(m)} className="ripple" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",cursor:"pointer",transition:"all .15s"}}><div><p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:2}}>{m.foodName}</p><p style={{fontSize:11,color:T.muted}}>{m.servingSize}</p></div><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:13,fontWeight:800,color:T.accent}}>{m.totalCalories}</span><span style={{fontSize:11,color:T.accent,background:`${T.accent}12`,padding:"4px 10px",borderRadius:20,fontWeight:600,border:`1px solid ${T.accent}20`}}>+ Add</span></div></div>))}</Card>)}
      </>)}

      {tab==="log"&&(<>
        {/* Daily Progress Ring */}
        <Card style={{textAlign:"center",background:"linear-gradient(145deg,#0d0d18,#0a0a12)",padding:"24px 20px"}}>
          <p style={{fontSize:11,color:T.muted,marginBottom:14,textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>Today's Progress</p>
          <div style={{position:"relative",display:"inline-block",marginBottom:16}} className="ring-glow">
            <svg width="130" height="130" viewBox="0 0 130 130">
              <defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={T.accent}/><stop offset="100%" stopColor="#00b87a"/></linearGradient></defs>
              <circle cx="65" cy="65" r="54" fill="none" stroke="#1a1a28" strokeWidth="10"/>
              <circle cx="65" cy="65" r="54" fill="none" stroke="url(#lg1)" strokeWidth="10" strokeDasharray={`${2*Math.PI*54}`} strokeDashoffset={`${2*Math.PI*54*(1-Math.min(consumed/goal,1))}`} strokeLinecap="round" transform="rotate(-90 65 65)" style={{transition:"stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:28,fontWeight:900,color:T.accent,lineHeight:1}}>{pct}%</span>
              <span style={{fontSize:9,color:T.muted,marginTop:3}}>of daily goal</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[["Eaten",consumed,T.accent],["Goal",goal,T.blue],[rem<0?"Over":"Left",Math.abs(rem),rem<0?T.danger:T.orange]].map(([l,v,c])=>(<div key={l} style={{background:`${c}08`,borderRadius:12,padding:"10px 8px",border:`1px solid ${c}15`}}><span style={{fontSize:17,fontWeight:900,color:c,display:"block"}}>{v}</span><span style={{fontSize:9,color:T.muted,textTransform:"uppercase",fontWeight:600}}>{l}</span></div>))}
          </div>
        </Card>
        {/* Water Tracker with droplets */}
        <Card style={{background:"linear-gradient(145deg,#0c1520,#0a1018)"}}>
          <CardTitle icon="💧">Water Intake</CardTitle>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
            {Array.from({length:8}).map((_,i)=>(<div key={i} onClick={()=>setWater(i<water?i:i+1)} style={{width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",transition:"all .25s",background:i<water?`${T.blue}20`:"#1a1a28",boxShadow:i<water?`0 0 10px ${T.blue}30`:"none",border:`1px solid ${i<water?T.blue+"40":T.border}`}}>💧</div>))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
            <div style={{position:"relative",width:76,height:76,flexShrink:0}} className="ring-glow">
              <svg width="76" height="76" viewBox="0 0 76 76">
                <defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={T.blue}/><stop offset="100%" stopColor="#2a7fc8"/></linearGradient></defs>
                <circle cx="38" cy="38" r="31" fill="none" stroke="#1a1a28" strokeWidth="7"/>
                <circle cx="38" cy="38" r="31" fill="none" stroke="url(#wg)" strokeWidth="7" strokeDasharray={`${2*Math.PI*31}`} strokeDashoffset={`${2*Math.PI*31*(1-Math.min(water/8,1))}`} strokeLinecap="round" transform="rotate(-90 38 38)" style={{transition:"stroke-dashoffset .8s cubic-bezier(0.16,1,0.3,1)"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:17,fontWeight:900,color:T.blue}}>{water}</span><span style={{fontSize:8,color:T.muted,fontWeight:600}}>/8</span></div>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{water} of 8 glasses</p>
              <p style={{fontSize:12,color:T.muted,marginBottom:12}}>{water===0?"Start hydrating!":water<4?"Keep going 💧":water<8?"Almost there!":"Goal crushed! 🎉"}</p>
              <div style={{display:"flex",gap:8}}>
                <button className="ripple" onClick={()=>setWater(w=>Math.max(0,w-1))} style={{padding:"8px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:"#16162a",color:T.muted,fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .15s"}}>−</button>
                <button className="glow ripple" onClick={()=>setWater(w=>Math.min(12,w+1))} style={{flex:1,padding:"8px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${T.blue},#2a7fc8)`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 16px ${T.blue}30`}}>+ Add Glass</button>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:5}}>{Array.from({length:8}).map((_,i)=>(<div key={i} onClick={()=>setWater(i+1)} style={{flex:1,height:8,borderRadius:99,background:i<water?`linear-gradient(135deg,${T.blue},#2a7fc8)`:"#1a1a28",cursor:"pointer",transition:"all .25s",boxShadow:i<water?`0 0 8px ${T.blue}25`:"none"}}/>))}</div>
        </Card>
        {/* Meal Log with colored borders and visible delete */}
        {mealLog.length===0?(<Card style={{textAlign:"center",padding:"30px 20px"}}><div style={{width:56,height:56,borderRadius:18,background:"#16162a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px",border:`1px solid ${T.border}`}}>🍽️</div><p style={{fontSize:14,marginBottom:14,color:T.muted}}>No meals logged yet.</p><Btn onClick={()=>setTab("analyze")}>📸 Analyze Your First Meal</Btn></Card>):(<Card><CardTitle icon="🍴">Meals Today</CardTitle>{mealLog.map((m,i)=>{const mhc=m.healthScore>=7?T.accent:m.healthScore>=4?T.orange:T.danger;return(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",paddingLeft:12,borderBottom:i<mealLog.length-1?`1px solid ${T.border}`:"none",borderLeft:`3px solid ${mhc}`,marginLeft:-4}}>
          <div><p style={{fontSize:13,fontWeight:700,marginBottom:3}}>{m.foodName}</p><p style={{fontSize:11,color:T.muted,fontWeight:500}}>{m.time}</p></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,fontWeight:800,color:T.accent,background:`${T.accent}10`,padding:"4px 10px",borderRadius:8}}>{m.totalCalories} kcal</span>
            <button onClick={()=>{setConsumed(c=>Math.max(0,c-m.totalCalories));setMealLog(l=>l.filter((_,j)=>j!==i));}} style={{background:"none",border:`1px solid ${T.danger}25`,borderRadius:8,color:T.danger,fontSize:11,padding:"4px 8px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,transition:"opacity .2s"}}>✕</button>
          </div>
        </div>);})}</Card>)}
      </>)}

      {tab==="progress"&&(<>
        {/* Streak Card with bounce */}
        <Card style={{background:"linear-gradient(145deg,#18120a,#120e06)",borderColor:`${T.orange}25`,position:"relative",overflow:"hidden",padding:"22px 20px"}}>
          <div style={{position:"absolute",top:"-40%",right:"-20%",width:160,height:160,borderRadius:"50%",background:`radial-gradient(circle,${T.orange}10,transparent 70%)`,pointerEvents:"none"}}/>
          <CardTitle icon="🔥">Current Streak</CardTitle>
          <div style={{display:"flex",alignItems:"center",gap:20,position:"relative"}}>
            <div style={{textAlign:"center",background:`${T.orange}0a`,borderRadius:20,padding:"14px 18px",border:`1px solid ${T.orange}20`}}>
              <p className="bounce-pop" style={{fontSize:48,fontWeight:900,color:T.orange,lineHeight:1,textShadow:`0 0 30px ${T.orange}30`}}>{stats.streak}</p>
              <p style={{fontSize:10,color:T.muted,marginTop:4,fontWeight:600}}>day{stats.streak!==1?"s":""}</p>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>{stats.streak<3?"Start your streak today!":stats.streak>=7?"You're unstoppable! 🔥":`${stats.streak} day${stats.streak>1?"s":""} in a row!`}</p>
              <div style={{display:"flex",gap:5,marginTop:10}}>{Array.from({length:7}).map((_,i)=>(<div key={i} style={{flex:1,height:6,borderRadius:99,background:i<stats.streak%7?`linear-gradient(90deg,${T.orange},#ff8855)`:"#1a1a28",boxShadow:i<stats.streak%7?`0 0 8px ${T.orange}25`:"none",transition:"all .3s"}}/>))}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>{["M","T","W","T","F","S","S"].map((d,i)=>(<span key={i} style={{fontSize:8,color:i<stats.streak%7?T.orange:T.muted,fontWeight:600,flex:1,textAlign:"center"}}>{d}</span>))}</div>
            </div>
          </div>
        </Card>
        {/* 7-Day Chart with growing bars */}
        <Card style={{padding:"20px"}}>
          <CardTitle icon="📊">7-Day Calorie Trend</CardTitle>
          <div style={{display:"flex",alignItems:"flex-end",gap:7,height:110,marginBottom:10,padding:"0 4px"}}>
            {weekData.map((wd,i)=>{const cal=wd.cal||0;const max=Math.max(goal*1.2,...weekData.map(x=>x.cal||0));const h=cal>0?Math.max((cal/max)*95,10):0;const over=cal>goal;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <div style={{fontSize:9,color:cal>0?T.accent:T.muted,fontWeight:700}}>{cal>0?cal:""}</div>
              <div style={{width:"100%",height:95,display:"flex",alignItems:"flex-end"}}>
                <div className="bar-grow" style={{"--bar-h":`${h}px`,width:"100%",height:`${h}px`,borderRadius:"8px 8px 4px 4px",background:h===0?"#1a1a28":over?`linear-gradient(180deg,${T.danger},${T.danger}66)`:`linear-gradient(180deg,${T.accent},${T.accent}55)`,boxShadow:cal>0?`0 0 12px ${over?T.danger:T.accent}20`:"none",border:wd.isToday?`1.5px solid ${T.accent}`:"1px solid transparent"}}/>
              </div>
              <span style={{fontSize:9,color:wd.isToday?T.accent:T.muted,fontWeight:wd.isToday?800:500}}>{wd.label}</span>
            </div>);})}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",borderTop:`1px solid ${T.border}`}}>
            <span style={{fontSize:11,color:T.muted}}>Daily Goal</span>
            <span style={{fontSize:11,fontWeight:700,color:T.accent}}>{goal} kcal</span>
          </div>
        </Card>
        {/* Earned Badges with glow */}
        {earned.length>0&&(<Card><CardTitle icon="🏆">Badges Earned ({earned.length}/{BADGES.length})</CardTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>{earned.map(b=>(<div key={b.id} className="pop" style={{textAlign:"center",padding:"12px 6px",background:`linear-gradient(145deg,${T.purple}12,${T.purple}06)`,border:`1px solid ${T.purple}30`,borderRadius:16,boxShadow:`0 4px 16px ${T.purple}10, 0 0 20px ${T.purple}08`}}><span style={{fontSize:28,display:"block",marginBottom:6}}>{b.icon}</span><p style={{fontSize:10,fontWeight:700,color:T.purple,lineHeight:1.3}}>{b.name}</p></div>))}</div></Card>)}
        {/* Locked Badges with grayscale+blur */}
        <Card><CardTitle icon="🔒">Locked Badges ({locked.length})</CardTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>{locked.map(b=>(<div key={b.id} style={{textAlign:"center",padding:"12px 6px",background:"#14142a",borderRadius:16,border:`1px solid ${T.border}`}}><span style={{fontSize:28,display:"block",marginBottom:6,filter:"grayscale(1) blur(1px)",opacity:.3}}>{b.icon}</span><p style={{fontSize:9,color:T.muted,lineHeight:1.3}}>{b.desc}</p></div>))}</div></Card>
      </>)}

      {tab==="me"&&(<>
        {/* Profile Hero with gradient */}
        <div style={{background:"linear-gradient(145deg,#0e1a14,#091410)",border:`1.5px solid ${T.accent}20`,borderRadius:22,padding:"28px 20px",marginBottom:14,textAlign:"center",position:"relative",overflow:"hidden",boxShadow:`0 8px 32px ${T.accent}08`}}>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${T.accent}06,${T.purple}04,${T.blue}06)`,pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:"-50%",left:"50%",transform:"translateX(-50%)",width:300,height:200,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}0a,transparent 70%)`,pointerEvents:"none"}}/>
          <div style={{width:68,height:68,borderRadius:22,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 14px",boxShadow:`0 8px 24px ${T.accentGlow}`,position:"relative"}}>{profile.gender==="Male"?"👨":"👩"}</div>
          <p style={{fontSize:22,fontWeight:900,letterSpacing:"-0.02em",position:"relative"}}>{profile.name}</p>
          <p style={{fontSize:12,color:T.muted,marginTop:4,fontWeight:500,position:"relative"}}>{profile.age} yrs · {profile.gender} · {profile.activity?.replace("_"," ")}</p>
        </div>
        {/* Stats as tappable pills */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {[["Total Meals",allHistory.length,T.accent,"🍽️"],["Streak",`${stats.streak}d`,T.orange,"🔥"],["Badges",`${earned.length}/${BADGES.length}`,T.purple,"🏆"],["Water",`${water}/8`,T.blue,"💧"]].map(([k,v,c,ic])=>(<div key={k} style={{flex:"1 1 calc(50% - 4px)",background:`${c}08`,border:`1px solid ${c}15`,borderRadius:14,padding:"14px 12px",textAlign:"center",cursor:"pointer",transition:"all .2s"}} className="ripple">
            <span style={{fontSize:18,display:"block",marginBottom:4}}>{ic}</span>
            <span style={{fontSize:18,fontWeight:900,color:c,display:"block",lineHeight:1}}>{v}</span>
            <span style={{fontSize:10,color:T.muted,marginTop:4,display:"block",fontWeight:500}}>{k}</span>
          </div>))}
        </div>
        {/* BMR/TDEE Data Cards */}
        {(()=>{const w=parseFloat(profile.weight)||0,h=parseFloat(profile.height)||0,a=parseFloat(profile.age)||0;const acts={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};const bmr=w&&h&&a?Math.round(profile.gender==="Male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161):0;const tdee=Math.round(bmr*(acts[profile.activity]||1.375));return(
          <Card>
            <CardTitle icon="📊">Body Metrics</CardTitle>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["BMR",`${bmr}`,T.blue,"kcal at rest"],["TDEE",`${tdee}`,T.orange,"maintenance"]].map(([l,v,c,desc])=>(<div key={l} style={{background:`${c}08`,border:`1px solid ${c}15`,borderRadius:12,padding:"12px"}}>
                <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>{l}</p>
                <p style={{fontSize:18,fontWeight:900,color:c}}>{v}</p>
                <p style={{fontSize:10,color:T.muted}}>{desc}</p>
              </div>))}
            </div>
          </Card>
        );})()}
        {/* Profile Details */}
        <Card><CardTitle icon="👤">My Profile</CardTitle>{[["Height",`${profile.height} cm`],["Weight",`${profile.weight} kg`],["Target Weight",profile.targetWeight?`${profile.targetWeight} kg`:"Not set"],["Daily Goal",`${goal} kcal`],["Activity",profile.activity?.replace("_"," ")],["Goal",profile.goal?.replace("_"," ")]].map(([k,v],i,a)=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none",fontSize:13}}><span style={{color:T.muted,fontWeight:500}}>{k}</span><span style={{fontWeight:700,color:T.blue,textTransform:"capitalize"}}>{v}</span></div>))}</Card>
        {/* Actions */}
        <button onClick={onEditProfile} className="ripple" style={{width:"100%",padding:"14px",borderRadius:14,border:`1px solid ${T.border}`,background:"#16162a",color:T.text,fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:14,marginBottom:10,transition:"all .2s",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.03)"}}>✏️ Edit Profile</button>
        <button onClick={onSignOut} className="ripple" style={{width:"100%",padding:"14px",borderRadius:14,border:`1px solid ${T.danger}20`,background:`${T.danger}08`,color:T.danger,fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:14,transition:"all .2s"}}>↩ Sign Out</button>
      </>)}
    </div>
  </div>);}

export default function App(){
  const[authUser,setAuthUser]=useState(undefined);
  const[screen,setScreen]=useState("welcome");
  const[profile,setProfile]=useState({name:"",age:"",gender:"Male",height:"",weight:"",targetWeight:"",activity:"",goal:""});
  const goal=calcGoal(profile);

  const[onboarded,setOnboarded]=useState(()=>!!localStorage.getItem('bitelyze_onboarded'));
  const[authInitialMode,setAuthInitialMode]=useState("signup");

  useEffect(()=>{const unsub=onAuthStateChanged(auth,async(user)=>{setAuthUser(user||null);if(user){
    const saved=await loadProfile(user.uid);
    if(saved&&saved.height&&saved.weight&&saved.activity&&saved.goal){setProfile(p=>({...p,...saved}));setScreen("app");}
    else{if(saved&&saved.name)setProfile(p=>({...p,...saved}));else if(user.displayName)setProfile(p=>({...p,name:user.displayName}));setScreen("welcome");}
  }});return unsub;},[]);

  const saveAndContinue=()=>{
    if(authUser){saveProfile(authUser.uid,profile);}
    setScreen("app");
  };

  if(!onboarded)return(<><style>{GS}</style><Onboarding onDone={(mode)=>{localStorage.setItem('bitelyze_onboarded','1');setAuthInitialMode(mode||"signup");setOnboarded(true);}}/></>);
  if(authUser===undefined)return(<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><style>{GS}</style><div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🍽️</div><div style={{width:32,height:32,border:`3px solid ${T.border}`,borderTop:`3px solid ${T.accent}`,borderRadius:"50%"}} className="spin"/></div>);
  if(!authUser)return(<><style>{GS}</style><AuthScreen initialMode={authInitialMode}/></>);
  return(<div style={{fontFamily:"'DM Sans',sans-serif"}}><style>{GS}</style>
    {screen==="welcome"&&<Welcome onNext={()=>setScreen("s1")}/>}
    {screen==="s1"&&<StepBasic p={profile} setP={setProfile} onNext={()=>setScreen("s2")} onBack={()=>setScreen("welcome")}/>}
    {screen==="s2"&&<StepBody p={profile} setP={setProfile} onNext={()=>setScreen("s3")} onBack={()=>setScreen("s1")}/>}
    {screen==="s3"&&<StepActivity p={profile} setP={setProfile} onNext={()=>setScreen("s4")} onBack={()=>setScreen("s2")}/>}
    {screen==="s4"&&<StepGoal p={profile} setP={setProfile} onNext={()=>setScreen("plan")} onBack={()=>setScreen("s3")}/>}
    {screen==="plan"&&<PlanReady profile={profile} goal={goal} onStart={saveAndContinue}/>}
    {screen==="app"&&<TrackerApp profile={profile} goal={goal} uid={authUser.uid} onEditProfile={()=>setScreen("s1")} onSignOut={()=>signOut(auth)}/>}
  </div>);}
