import { useState, useRef, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, signOut, onAuthStateChanged
} from "firebase/auth";
import {
  initializeFirestore, doc, setDoc, getDoc, arrayUnion
} from "firebase/firestore";
import { Camera, ClipboardList, BarChart3, User, Flame, Target, Zap, UtensilsCrossed, Brain, Droplets, Trophy, Heart, ArrowLeft, ArrowRight, Upload, Search, Settings, LogOut, ChevronRight, ChevronLeft, Lock, Unlock, HelpCircle, Plus, Minus, X, Star, Activity, Scale, Ruler, Calendar, Sun, Moon, Check, ChevronUp, ChevronDown, RotateCcw, Trash2, Share2, Download, FlaskConical, Clock, Pencil, AlertTriangle, Info, Rocket, Dumbbell, Sprout, Sofa, Footprints, TrendingUp, TrendingDown, Lightbulb, Sparkles, Stethoscope, Repeat, MessageCircle, Send, MoreHorizontal, Palette, Smartphone, Share, ArrowUpRight, Apple, Bell, BellOff, Mic, MicOff, Copy, Globe } from "lucide-react";
import { LANGUAGES, makeT, getStoredLang, setStoredLang } from "./i18n";

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
const db             = initializeFirestore(firebaseApp, { experimentalAutoDetectLongPolling: true });
const googleProvider = new GoogleAuthProvider();

const THEMES={
  dark:{bg:"#08080e",card:"#111118",border:"#1c1c2a",accent:"#00e5a0",accentDim:"#00e5a015",accentGlow:"#00e5a035",orange:"#ff6b35",orangeDim:"#ff6b3515",blue:"#4facfe",blueDim:"#4facfe15",purple:"#a78bfa",purpleDim:"#a78bfa15",text:"#eeeef5",muted:"#777799",danger:"#ff4757",inputBg:"#0e0e16",headerBg:"linear-gradient(180deg,rgba(14,14,24,0.95),rgba(12,12,19,0.9))",barBg:"#1a1a28",stepBg:"#0c0c13",cardShadow:"0 4px 16px rgba(0,0,0,0.25)"},
  // Premium light theme — inspired by Linear / Notion / Arc
  light:{
    bg:"#f7f8fa",                                                       // Soft off-white with faint cool tint
    card:"#ffffff",                                                     // Pure white cards
    border:"#e4e7ec",                                                   // Visible but soft border
    accent:"#00b87a",                                                   // Richer green that pops on white
    accentDim:"#e0f7ef",                                                // Visible mint tint (not transparency)
    accentGlow:"#00b87a35",                                             // Stronger glow for white bg
    orange:"#f97316",                                                   // Vibrant signal orange
    orangeDim:"#fff1e5",                                                // Visible orange wash
    blue:"#3b82f6",                                                     // Strong readable blue
    blueDim:"#e8f0fe",                                                  // Visible blue tint
    purple:"#7c3aed",                                                   // Deep premium purple
    purpleDim:"#f0ebff",                                                // Visible purple tint
    text:"#0f172a",                                                     // Slate-900 — max legibility
    muted:"#52606d",                                                    // Darker muted for AA contrast
    danger:"#dc2626",                                                   // Strong red
    inputBg:"#ffffff",                                                  // White inputs with borders
    headerBg:"linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,251,253,0.9))",
    barBg:"#e8eaee",                                                    // Visible grey track
    stepBg:"#ffffff",
    cardShadow:"0 2px 8px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)"  // Soft elevation on white
  }
};
let T=THEMES[localStorage.getItem("bitelyze_theme")||"dark"];
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;transition:background .3s ease}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}@keyframes pop{0%{transform:scale(0.82);opacity:0}65%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.fadeUp{animation:fadeUp .4s ease forwards}.fadeIn{animation:fadeIn .35s ease forwards}.slideIn{animation:slideIn .32s ease forwards}.pop{animation:pop .38s ease forwards}.glow:hover{box-shadow:0 0 28px #00e5a040,0 0 8px #00e5a020;transform:translateY(-2px)}.ripple:active{transform:scale(0.97)}.upload:hover{border-color:#00e5a0!important;background:#00e5a00c!important}@keyframes ringGlow{0%,100%{filter:drop-shadow(0 0 6px #00e5a030)}50%{filter:drop-shadow(0 0 14px #00e5a050)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}.ring-glow{animation:ringGlow 3s ease-in-out infinite}.spin{animation:spin 1s linear infinite}@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}input::placeholder{font-size:13px!important;font-weight:400!important;opacity:0.55!important}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1c1c2a;border-radius:99px}@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulseGlow{0%,100%{box-shadow:0 0 12px #00e5a030,0 4px 24px #00e5a015}50%{box-shadow:0 0 24px #00e5a050,0 4px 32px #00e5a030}}@keyframes staggerIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.01)}}@keyframes fillRing{from{stroke-dashoffset:var(--ring-circumference)}to{stroke-dashoffset:var(--ring-target)}}@keyframes bouncePop{0%{transform:scale(0.7);opacity:0}50%{transform:scale(1.15)}75%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}@keyframes logoPulse{0%,85%,100%{transform:scale(1)}90%{transform:scale(1.12)}95%{transform:scale(0.96)}}@keyframes bobFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes phaseSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes barGrow{from{height:0}to{height:var(--bar-h)}}@keyframes shimmerRing{0%{stroke-opacity:0.6}50%{stroke-opacity:1}100%{stroke-opacity:0.6}}.breathe{animation:breathe 3s ease-in-out infinite}.bounce-pop{animation:bouncePop .5s ease forwards}.logo-pulse{animation:logoPulse 8s ease-in-out infinite}.bob-float{animation:bobFloat 2s ease-in-out infinite}.bar-grow{animation:barGrow .8s cubic-bezier(0.16,1,0.3,1) forwards}.shimmer-ring{animation:shimmerRing 2s ease-in-out infinite}.pulse-glow{animation:pulseGlow 2s ease-in-out infinite}@keyframes floatChaos0{0%,100%{transform:rotate(-15deg) translateY(0)}50%{transform:rotate(-10deg) translateY(-6px)}}@keyframes floatChaos1{0%,100%{transform:rotate(10deg) translateY(0)}50%{transform:rotate(15deg) translateY(-8px)}}@keyframes floatChaos2{0%,100%{transform:rotate(-5deg) translateY(0)}50%{transform:rotate(5deg) translateY(-5px)}}@keyframes lineGlow{0%,100%{box-shadow:0 0 4px #00e5a040,0 0 12px #00e5a020}50%{box-shadow:0 0 14px #00e5a060,0 0 28px #00e5a030}}@keyframes floatUnified{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes labelPulse{0%,100%{opacity:0.7}50%{opacity:1}}@keyframes glowBreath{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}@keyframes breatheDark{0%,100%{background:radial-gradient(circle,transparent 30%,rgba(0,0,0,0.4) 100%)}50%{background:radial-gradient(circle,transparent 25%,rgba(0,0,0,0.5) 100%)}}@keyframes rotateIcon{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}@keyframes lockBounce{0%{transform:scale(1)}30%{transform:scale(1.25)}60%{transform:scale(0.9)}100%{transform:scale(1)}}@keyframes lockGlowPulse{0%,100%{box-shadow:0 0 20px #00e5a015,0 0 40px #00e5a010}50%{box-shadow:0 0 35px #00e5a030,0 0 60px #00e5a020}}@keyframes shimmerSweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes nudge{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}@keyframes tooltipFade{0%{opacity:0;transform:translateY(-4px)}15%{opacity:1;transform:translateY(0)}85%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(4px)}}@keyframes unlockPulse{0%{transform:scale(0);opacity:0.8}100%{transform:scale(4);opacity:0}}@keyframes pillPop{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}@keyframes fogIn{from{backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px)}to{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}}@keyframes pulseDivider{0%,100%{box-shadow:0 0 6px #00e5a030,0 0 18px #00e5a015;opacity:0.7}50%{box-shadow:0 0 16px #00e5a060,0 0 36px #00e5a030;opacity:1}}@keyframes fadeStagger{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes glowPulse{0%,100%{box-shadow:0 0 30px #00e5a020,0 0 60px #00e5a010}50%{box-shadow:0 0 50px #00e5a040,0 0 80px #00e5a020}}@keyframes driftUp{0%{opacity:0;transform:translateY(20px) rotate(var(--rot,0deg))}15%{opacity:0.4}85%{opacity:0.4}100%{opacity:0;transform:translateY(-80px) rotate(var(--rot,0deg))}}@keyframes pillFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes borderGlow{0%,100%{box-shadow:inset 0 0 60px #00e5a010}50%{box-shadow:inset 0 0 60px #00e5a020}}@keyframes confPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.55;transform:scale(0.85)}}`;

const calcGoal=(p)=>{if(!p)return 2000;const w=parseFloat(p.weight),h=parseFloat(p.height),a=parseFloat(p.age);if(!w||!h||!a)return 2000;const bmr=p.gender==="Male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161;const act={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};const def={lose_fast:-750,lose:-500,lose_slow:-250,maintain:0,gain:300};return Math.round(bmr*(act[p.activity]||1.375)+(def[p.goal]||-500));};
const TODAY=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});

// ── Date Helpers ──
const ymd=(d)=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const todayYMD=()=>ymd(new Date());
const parseYMD=(s)=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const addDays=(dateStr,n)=>{const d=parseYMD(dateStr);d.setDate(d.getDate()+n);return ymd(d);};
const formatDateLabel=(dateStr)=>{
  if(!dateStr)return"";
  const t=todayYMD();
  if(dateStr===t)return"Today";
  if(dateStr===addDays(t,-1))return"Yesterday";
  const d=parseYMD(dateStr);
  return d.toLocaleDateString("en",{weekday:"short",month:"short",day:"numeric"});
};
const getRange=(key)=>{
  const today=new Date();today.setHours(23,59,59,999);
  const start=new Date();start.setHours(0,0,0,0);
  if(key==="7d")start.setDate(start.getDate()-6);
  else if(key==="30d")start.setDate(start.getDate()-29);
  else if(key==="3m")start.setDate(start.getDate()-89);
  else if(key==="6m")start.setDate(start.getDate()-179);
  else if(key==="thisMonth")start.setDate(1);
  else if(key==="lastMonth"){start.setMonth(start.getMonth()-1);start.setDate(1);today.setDate(0);today.setHours(23,59,59,999);}
  else if(key==="thisYear"){start.setMonth(0);start.setDate(1);}
  else if(key==="lastYear"){start.setFullYear(start.getFullYear()-1);start.setMonth(0);start.setDate(1);today.setFullYear(today.getFullYear()-1);today.setMonth(11);today.setDate(31);today.setHours(23,59,59,999);}
  else if(key==="lifetime")start.setFullYear(2020);
  return{start,end:today};
};
const RANGE_LABELS={"7d":"Last 7 days","30d":"Last 30 days","thisMonth":"This month","lastMonth":"Last month","3m":"Last 3 months","6m":"Last 6 months","thisYear":"This year","lastYear":"Last year","lifetime":"Lifetime"};
const RANGE_KEYS=["7d","30d","thisMonth","lastMonth","3m","6m","thisYear","lastYear","lifetime"];
// Derive YYYY-MM-DD from a meal entry — prefer explicit date, then timestamp, else today
const mealDate=(m)=>{
  if(m.date)return m.date;
  if(m.timestamp){try{return ymd(new Date(m.timestamp));}catch(e){}}
  return todayYMD();
};
// Generate month calendar grid — returns array of {dateStr, day, current, future, hasData}
const buildCalendarGrid=(monthDate,history)=>{
  const year=monthDate.getFullYear(),month=monthDate.getMonth();
  const first=new Date(year,month,1);
  const firstDow=first.getDay();// 0 = Sun
  const daysInMonth=new Date(year,month+1,0).getDate();
  const daysSet=new Set(history.map(m=>mealDate(m)));
  const today=todayYMD();
  const grid=[];
  // Leading blanks — use days from prev month for spacing
  for(let i=0;i<firstDow;i++)grid.push(null);
  for(let d=1;d<=daysInMonth;d++){
    const ds=ymd(new Date(year,month,d));
    grid.push({dateStr:ds,day:d,future:ds>today,hasData:daysSet.has(ds),isToday:ds===today});
  }
  return grid;
};
// ── Rate Limiting (5 analyses per day) ──
// Developer accounts bypass all limits for testing
const DEV_EMAILS=["ogunlowooluwatosin28@gmail.com"];
const isDevUser=()=>{try{const u=auth.currentUser;return u&&DEV_EMAILS.includes((u.email||"").toLowerCase());}catch(e){return false;}};
const DAILY_LIMIT=5;
const getDeviceFingerprint=()=>{try{const c=document.createElement("canvas");const ctx=c.getContext("2d");ctx.textBaseline="top";ctx.font="14px Arial";ctx.fillText("fp",2,2);const d=c.toDataURL().slice(-50);const s=`${screen.width}x${screen.height}x${screen.colorDepth}x${navigator.hardwareConcurrency||0}x${Intl.DateTimeFormat().resolvedOptions().timeZone}x${d}`;let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return"dev_"+Math.abs(h).toString(36);}catch(e){return"dev_fallback";}};
const getRateLimitKey=(uid)=>{const today=new Date().toISOString().split("T")[0];return`rate_${uid}_${today}`;};
const getDeviceRateLimitKey=()=>{const today=new Date().toISOString().split("T")[0];return`rate_${getDeviceFingerprint()}_${today}`;};
const getUsageCount=(uid)=>{const userCount=parseInt(localStorage.getItem(getRateLimitKey(uid))||"0",10);const deviceCount=parseInt(localStorage.getItem(getDeviceRateLimitKey())||"0",10);return Math.max(userCount,deviceCount);};
const incrementUsage=(uid)=>{if(isDevUser())return 0;const userKey=getRateLimitKey(uid);const deviceKey=getDeviceRateLimitKey();const userCount=parseInt(localStorage.getItem(userKey)||"0",10)+1;const deviceCount=parseInt(localStorage.getItem(deviceKey)||"0",10)+1;const newCount=Math.max(userCount,deviceCount);localStorage.setItem(userKey,String(newCount));localStorage.setItem(deviceKey,String(newCount));return newCount;};
const getRemainingAnalyses=(uid)=>{if(isDevUser())return 999;return Math.max(0,DAILY_LIMIT-getUsageCount(uid));};

const HOUR=new Date().getHours();
const coachGreeting=(name)=>{if(HOUR<12)return`Good morning, ${name}! 🌅 Breakfast sets the tone.`;if(HOUR<17)return`Hey ${name}! 🌤️ Midday check-in — how's your eating going?`;return`Evening, ${name}! 🌙 Almost done for the day.`;};
const coachTips=["💡 Eating slowly helps your brain register fullness — aim for 20 mins per meal.","💡 Protein at breakfast reduces cravings by up to 60% throughout the day.","💡 Drinking water before meals can reduce calorie intake by ~13%.","💡 Your body burns more calories digesting protein than carbs or fat.","💡 Sleep affects hunger hormones — aim for 7–8 hours for best results.","💡 Eating from smaller plates naturally reduces portion sizes."];

// ── Smart Coach — pattern detection from real user data ──
const computeSmartCoach=({allHistory,recentDays,goal,profile,consumed,todayMeals})=>{
  const insights=[];
  const dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const now=new Date();
  const hour=now.getHours();
  const proteinTarget=Math.round(goal*0.3/4);// ~30% of calories from protein

  // Group history by YYYY-MM-DD (local)
  const byDate={};
  (allHistory||[]).forEach(m=>{
    const d=m.date||(m.timestamp?new Date(m.timestamp).toISOString().slice(0,10):null);
    if(!d)return;
    if(!byDate[d])byDate[d]={cal:0,protein:0,meals:[]};
    byDate[d].cal+=Number(m.totalCalories)||0;
    byDate[d].protein+=Number(m.protein)||0;
    byDate[d].meals.push(m);
  });

  const dates=Object.keys(byDate).sort();
  const last14=dates.slice(-14).map(d=>byDate[d]);
  const totalDays=dates.length;

  // 1. Day-of-week overage pattern — needs 14+ days
  if(totalDays>=14){
    const byWeekday=[0,1,2,3,4,5,6].map(wd=>{
      const days=dates.filter(d=>new Date(d).getDay()===wd).map(d=>byDate[d].cal);
      return{wd,avg:days.length?days.reduce((a,b)=>a+b,0)/days.length:0,count:days.length};
    }).filter(x=>x.count>=2);
    if(byWeekday.length>=4){
      const overall=byWeekday.reduce((s,x)=>s+x.avg,0)/byWeekday.length;
      const worst=byWeekday.reduce((a,b)=>b.avg>a.avg?b:a);
      const diff=worst.avg-overall;
      if(diff>overall*0.2&&worst.avg>goal){
        insights.push({priority:8,icon:"📅",color:"#ff6b35",msg:`You tend to go over on ${dayNames[worst.wd]}s (+${Math.round(worst.avg-goal)} kcal avg). Plan ahead for this week?`});
      }
    }
  }

  // 2. Low protein streak — 3+ consecutive days below 70% of target
  const recent=last14.slice(-5);
  if(recent.length>=3&&proteinTarget>0){
    const below=recent.filter(d=>d.protein<proteinTarget*0.7).length;
    if(below>=3){
      insights.push({priority:9,icon:"💪",color:"#4facfe",msg:`Your protein has been low for ${below} days. Try Greek yogurt, eggs, or chicken to hit your ${proteinTarget}g target.`});
    }
  }

  // 3. Days under goal streak (positive reinforcement)
  let underStreak=0;
  for(let i=last14.length-1;i>=0;i--){
    if(last14[i].cal>0&&last14[i].cal<=goal)underStreak++;
    else break;
  }
  if(underStreak>=3){
    insights.push({priority:7,icon:"🎯",color:"#00e5a0",msg:`${underStreak} days under goal in a row — you're building a real habit. Keep it up!`});
  }

  // 4. Weekend vs weekday difference
  if(totalDays>=14){
    const weekends=dates.filter(d=>{const dn=new Date(d).getDay();return dn===0||dn===6;}).map(d=>byDate[d].cal).filter(c=>c>0);
    const weekdays=dates.filter(d=>{const dn=new Date(d).getDay();return dn>=1&&dn<=5;}).map(d=>byDate[d].cal).filter(c=>c>0);
    if(weekends.length>=2&&weekdays.length>=3){
      const weAvg=weekends.reduce((a,b)=>a+b,0)/weekends.length;
      const wkAvg=weekdays.reduce((a,b)=>a+b,0)/weekdays.length;
      if(weAvg-wkAvg>wkAvg*0.15){
        insights.push({priority:6,icon:"🍔",color:"#ff6b35",msg:`Weekends run ${Math.round(weAvg-wkAvg)} kcal higher than weekdays. Plan one mindful meal this weekend.`});
      }
    }
  }

  // 5. Late-day calorie opportunity — it's evening and they have lots left
  if(hour>=17&&consumed>0){
    const remaining=goal-consumed;
    if(remaining>400&&remaining<800){
      insights.push({priority:8,icon:"🍽️",color:"#00e5a0",msg:`You have ${remaining} kcal left. A balanced dinner (chicken + rice + veg) fits perfectly.`});
    }else if(remaining>800){
      insights.push({priority:7,icon:"⚠️",color:"#ff6b35",msg:`${remaining} kcal left — don't skip dinner. Undereating slows progress.`});
    }
  }

  // 6. No breakfast by 10am
  if(hour>=10&&hour<14&&consumed===0){
    insights.push({priority:9,icon:"☀️",color:"#ff6b35",msg:`No meals logged yet today. Even a small breakfast now stabilizes energy and curbs cravings later.`});
  }

  // 7. Late-night eater pattern
  const lateMeals=(allHistory||[]).filter(m=>{if(!m.timestamp)return false;const h=new Date(m.timestamp).getHours();return h>=21;}).length;
  if(totalDays>=7&&lateMeals/Math.max(totalDays,1)>0.4){
    insights.push({priority:5,icon:"🌙",color:"#a78bfa",msg:`You often eat after 9pm. Try to finish meals 2-3 hours before sleep for better rest.`});
  }

  // 8. Health score average (last 7 days)
  const recentScores=last14.slice(-7).flatMap(d=>d.meals.map(m=>m.healthScore||5));
  if(recentScores.length>=5){
    const avg=recentScores.reduce((a,b)=>a+b,0)/recentScores.length;
    if(avg>=7.5){
      insights.push({priority:6,icon:"✨",color:"#00e5a0",msg:`Your meals have averaged ${avg.toFixed(1)}/10 health score this week — premium quality eating.`});
    }else if(avg<4.5){
      insights.push({priority:7,icon:"🥗",color:"#ff6b35",msg:`Your recent meals average ${avg.toFixed(1)}/10. Try adding more vegetables or swapping one processed meal.`});
    }
  }

  // 9. Approaching goal (in-day)
  if(consumed>0&&goal>0){
    const pct=consumed/goal;
    if(pct>=0.9&&pct<=1.0&&hour<20){
      insights.push({priority:9,icon:"🎯",color:"#00e5a0",msg:`${goal-consumed} kcal left — plenty of room for a light snack if you're hungry later.`});
    }else if(pct>1.1&&hour<20){
      insights.push({priority:9,icon:"⚠️",color:"#ff4757",msg:`You're ${consumed-goal} kcal over. Skip or lighten your next meal to get back on track.`});
    }
  }

  // Sort by priority descending, return top 3
  return insights.sort((a,b)=>b.priority-a.priority).slice(0,3);
};
const BADGES=[{id:"first_meal",icon:"🍽️",name:"First Bite",desc:"Log your first meal",check:(s)=>s.totalMeals>=1},{id:"hydrated",icon:"💧",name:"Hydration Hero",desc:"Hit water goal",check:(s)=>s.waterGoalHits>=1},{id:"streak3",icon:"🔥",name:"3-Day Streak",desc:"Log meals 3 days in a row",check:(s)=>s.streak>=3},{id:"streak7",icon:"⚡",name:"Week Warrior",desc:"7-day logging streak",check:(s)=>s.streak>=7},{id:"meals10",icon:"🏅",name:"10 Meals Logged",desc:"Track 10 meals total",check:(s)=>s.totalMeals>=10},{id:"undergoal",icon:"🎯",name:"On Target",desc:"Stay under calorie goal",check:(s)=>s.daysUnderGoal>=1},{id:"earlybird",icon:"🌅",name:"Early Bird",desc:"Log breakfast before 9am",check:(s)=>s.earlyBreakfast>=1},{id:"coach",icon:"🧠",name:"Coach's Pet",desc:"Open app 5 days running",check:(s)=>s.streak>=5}];

const saveProfile=async(uid,profile)=>{
  try{localStorage.setItem("profile_"+uid,JSON.stringify(profile));}catch(e){}
  try{await setDoc(doc(db,"users",uid,"data","profile"),profile,{merge:true});}catch(e){console.log("Firestore save error:",e);}
};
const loadProfile=async(uid)=>{
  // Try localStorage first (instant)
  let local=null;
  try{const raw=localStorage.getItem("profile_"+uid);if(raw)local=JSON.parse(raw);}catch(e){}
  // Retry Firestore up to 2 times with longer timeout for new browsers
  const attempts=local?1:3;
  const timeoutMs=local?5000:10000;
  for(let i=0;i<attempts;i++){
    try{
      const snap=await Promise.race([getDoc(doc(db,"users",uid,"data","profile")),new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),timeoutMs))]);
      if(snap&&typeof snap.exists==="function"&&snap.exists()){const data=snap.data();try{localStorage.setItem("profile_"+uid,JSON.stringify(data));}catch(e){}console.log("[loadProfile] Success from Firestore");return data;}
      if(snap&&typeof snap.exists==="function"&&!snap.exists()){console.log("[loadProfile] Firestore has no profile — new account");return null;}
    }catch(e){console.log(`[loadProfile] Attempt ${i+1}/${attempts} failed:`,e.message);}
  }
  if(local)console.log("[loadProfile] Using localStorage fallback");
  return local;
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
  const def={streak:0,totalMeals:0,waterGoalHits:0,daysUnderGoal:0,earlyBreakfast:0};
  try{const snap=await Promise.race([getDoc(doc(db,"users",uid,"data","stats")),new Promise((_,r)=>setTimeout(()=>r(),5000))]);if(snap.exists()){LS.set(`stats_${uid}`,snap.data());return snap.data();}}catch(e){}
  return LS.get(`stats_${uid}`)||def;
};
const addMealToHistory=async(uid,meal)=>{
  const hist=LS.get(`history_${uid}`)||[];hist.push(meal);LS.set(`history_${uid}`,hist);
  try{await setDoc(doc(db,"users",uid,"data","history"),{meals:arrayUnion(meal)},{merge:true});}catch(e){}
};
const loadHistory=async(uid)=>{
  const local=LS.get(`history_${uid}`);
  const hasLocal=Array.isArray(local)&&local.length>0;
  // If no local data, this is likely a new browser for a returning user — retry harder
  const attempts=hasLocal?1:3;
  const timeoutMs=hasLocal?5000:10000;
  for(let i=0;i<attempts;i++){
    try{
      const snap=await Promise.race([getDoc(doc(db,"users",uid,"data","history")),new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),timeoutMs))]);
      if(snap&&typeof snap.exists==="function"&&snap.exists()){
        const m=snap.data().meals||[];
        LS.set(`history_${uid}`,m);
        console.log(`[loadHistory] Loaded ${m.length} meals from Firestore`);
        return m;
      }
      if(snap&&typeof snap.exists==="function"&&!snap.exists()){console.log("[loadHistory] No history in Firestore");return local||[];}
    }catch(e){console.log(`[loadHistory] Attempt ${i+1}/${attempts} failed:`,e.message);}
  }
  return local||[];
};

const loadRecentDaysLocal=(uid,n=14)=>{
  const days={};const today=new Date();
  for(let i=0;i<n;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const key=d.toISOString().split("T")[0];
    const local=LS.get(`day_${uid}_${key}`);
    if(local)days[key]=local;
  }
  return days;
};
const loadRecentDays=async(uid,n=14)=>{
  // Fire all reads in parallel with a single 4s timeout for the whole batch
  const keys=[];const today=new Date();
  for(let i=0;i<n;i++){const d=new Date(today);d.setDate(d.getDate()-i);keys.push(d.toISOString().split("T")[0]);}
  const results=await Promise.all(keys.map(async key=>{
    try{
      const snap=await Promise.race([getDoc(doc(db,"users",uid,"days",key)),new Promise((_,r)=>setTimeout(()=>r(),4000))]);
      if(snap&&snap.exists()){const data=snap.data();LS.set(`day_${uid}_${key}`,data);return[key,data];}
    }catch(e){}
    const local=LS.get(`day_${uid}_${key}`);
    return local?[key,local]:null;
  }));
  const days={};results.forEach(r=>{if(r)days[r[0]]=r[1];});
  return days;
};

// Calculate real streak from day data
// Local YMD helper — uses local timezone, matches meal.date format
const ymdLocal=(d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

// Streak derived from allHistory directly — no race conditions, no timezone issues
const calcStreakFromHistory=(allHistory)=>{
  if(!Array.isArray(allHistory)||allHistory.length===0)return 0;
  const activeDates=new Set();
  allHistory.forEach(m=>{
    const d=m.date||(m.timestamp?ymdLocal(new Date(m.timestamp)):null);
    if(d)activeDates.add(d);
  });
  let streak=0;
  const today=new Date();
  for(let i=0;i<365;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const key=ymdLocal(d);
    if(activeDates.has(key)){streak++;}
    else if(i===0){continue;}// grace period for today
    else{break;}
  }
  return streak;
};

// Legacy wrapper — kept for backward compat with day-docs-based callers
const calcStreak=(daysMap)=>{
  if(!daysMap)return 0;
  let streak=0;
  const today=new Date();
  for(let i=0;i<365;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const key=d.toISOString().split("T")[0];
    const day=daysMap[key];
    const hasData=day&&((day.meals&&day.meals.length>0)||(day.consumed&&day.consumed>0));
    if(hasData)streak++;
    else if(i===0)continue;
    else break;
  }
  return streak;
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
const Card=({children,style={}})=>(<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"18px 20px",marginBottom:14,boxShadow:T.cardShadow||`0 4px 16px ${T.bg}15`,backdropFilter:"blur(10px)",...style}}>{children}</div>);
const CardTitle=({icon,children})=>(<p style={{fontSize:13,fontWeight:800,marginBottom:14,display:"flex",alignItems:"center",gap:8,color:T.text,letterSpacing:"-0.01em"}}><span style={{fontSize:16,display:"inline-flex",alignItems:"center"}}>{icon}</span>{children}</p>);
function MacroBar({label,val,max,color}){const pct=Math.min((val/max)*100,100);return(<div style={{marginBottom:11}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{color:T.muted,fontWeight:500}}>{label}</span><span style={{fontWeight:700,color}}>{val}g</span></div><div style={{height:8,borderRadius:99,background:T.barBg,overflow:"hidden",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.3)"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${color},${color}aa)`,borderRadius:99,transition:"width 1s cubic-bezier(0.16,1,0.3,1)",boxShadow:`0 0 12px ${color}40`}}/></div></div>);}
function ProgressDots({total,current}){return(<div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:26}}>{Array.from({length:total}).map((_,i)=>(<div key={i} style={{width:i===current?22:7,height:7,borderRadius:99,background:i<=current?T.accent:T.border,transition:"all .3s ease"}}/>))}</div>);}
function NumInput({label,value,onChange,unit,placeholder}){return(<div style={{marginBottom:15}}><p style={{fontSize:11,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>{label}</p><div style={{display:"flex",alignItems:"center",background:T.inputBg,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}><input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{flex:1,padding:"13px 16px",background:"transparent",border:"none",color:T.text,fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit"}}/>{unit&&<span style={{padding:"0 16px",color:T.muted,fontSize:13,fontWeight:600}}>{unit}</span>}</div></div>);}
function TextInput({label,value,onChange,placeholder,type="text"}){return(<div style={{marginBottom:15}}><p style={{fontSize:11,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>{label}</p><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"13px 16px",background:T.inputBg,border:`1.5px solid ${T.border}`,borderRadius:12,color:T.text,fontSize:15,outline:"none",fontFamily:"inherit",fontWeight:500}}/></div>);}

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
      <circle cx="26" cy="26" r={r} fill="none" stroke={T.barBg} strokeWidth="4"/>
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
  return(<div className="fadeIn" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"calc(40px + env(safe-area-inset-top)) 22px 40px",background:T.bg,backgroundImage:`radial-gradient(ellipse at 50% 28%, #00e5a012 0%, transparent 62%)`}}><div className="pop" style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:22,boxShadow:`0 0 52px ${T.accentGlow}`,color:"#000"}}><UtensilsCrossed size={40}/></div><h1 style={{fontSize:30,fontWeight:900,marginBottom:6,color:T.text}}>Welcome to <span style={{color:T.accent}}>Bitelyze</span></h1><p style={{color:T.muted,fontSize:13,marginBottom:32}}>{mode==="login"?"Sign in to continue your journey":"Create your free account"}</p><div style={{width:"100%",maxWidth:360}}><button onClick={handleGoogle} className="ripple" style={{width:"100%",padding:"13px",borderRadius:13,border:`1.5px solid ${T.border}`,background:T.inputBg,color:T.text,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>Continue with Google</button><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{flex:1,height:1,background:T.border}}/><span style={{fontSize:11,color:T.muted}}>or</span><div style={{flex:1,height:1,background:T.border}}/></div>{mode==="signup"&&<TextInput label="Your Name" value={name} onChange={setName} placeholder="Enter your name"/>}<TextInput label="Email" value={email} onChange={setEmail} placeholder="Enter your email" type="email"/><TextInput label="Password" value={pass} onChange={setPass} placeholder="Enter your password" type="password"/>{mode==="login"&&<p onClick={handleForgotPassword} style={{textAlign:"right",fontSize:12,color:T.accent,cursor:"pointer",marginBottom:12,fontWeight:600}}>Forgot password?</p>}{resetSent&&<div style={{background:T.accentDim,border:`1px solid ${T.accent}40`,borderRadius:10,padding:"10px 14px",marginBottom:14,color:T.accent,fontSize:12,display:"flex",alignItems:"center",gap:8}}><Check size={14}/> Password reset email sent! Check your inbox.</div>}{error&&<div style={{background:`${T.danger}08`,border:`1px solid ${T.danger}40`,borderRadius:10,padding:"10px 14px",marginBottom:14,color:T.danger,fontSize:12,display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={14}/> {error}</div>}<Btn onClick={handleEmail} disabled={loading}>{loading?"Please wait…":mode==="login"?<span style={{display:"inline-flex",alignItems:"center",gap:6}}>Sign In <ArrowRight size={14}/></span>:<span style={{display:"inline-flex",alignItems:"center",gap:6}}>Create Account <ArrowRight size={14}/></span>}</Btn><p style={{textAlign:"center",marginTop:18,fontSize:13,color:T.muted}}>{mode==="login"?"Don't have an account? ":"Already have an account? "}<span onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");}} style={{color:T.accent,cursor:"pointer",fontWeight:700}}>{mode==="login"?"Sign Up":"Sign In"}</span></p></div></div>);
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

function Welcome({onNext,onExistingProfileFound,uid}){
  const[checking,setChecking]=useState(false);
  const[checkResult,setCheckResult]=useState(null);
  const checkCloud=async()=>{
    if(!uid)return;
    setChecking(true);setCheckResult(null);
    try{
      const snap=await Promise.race([getDoc(doc(db,"users",uid,"data","profile")),new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),20000))]);
      if(snap&&snap.exists()){
        const data=snap.data();
        try{localStorage.setItem("profile_"+uid,JSON.stringify(data));localStorage.setItem(`setup_complete_${uid}`,"1");}catch(e){}
        setCheckResult({ok:true,data});
        setTimeout(()=>{if(onExistingProfileFound)onExistingProfileFound(data);},800);
      }else{
        setCheckResult({ok:false,msg:"No saved profile found for this account"});
      }
    }catch(e){
      setCheckResult({ok:false,msg:"Couldn't reach cloud. Try again or continue setup."});
    }
    setChecking(false);
  };
  return(<div className="fadeIn" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"calc(40px + env(safe-area-inset-top)) 22px 40px",textAlign:"center",background:T.bg,backgroundImage:`radial-gradient(ellipse at 50% 28%, #00e5a012 0%, transparent 62%)`}}>
    <div className="pop" style={{width:92,height:92,borderRadius:26,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,marginBottom:26,boxShadow:`0 0 52px ${T.accentGlow}`,color:"#000"}}><UtensilsCrossed size={46}/></div>
    <h1 style={{fontSize:34,fontWeight:900,letterSpacing:"-1px",marginBottom:10,lineHeight:1.15,color:T.text}}>Meet <span style={{color:T.accent}}>Bitelyze</span></h1>
    <p style={{color:T.muted,fontSize:14,lineHeight:1.75,maxWidth:290,marginBottom:24}}>Your personal nutrition coach. Snap meals, track calories, build healthy habits — one bite at a time.</p>

    {/* Existing user banner */}
    <div style={{width:"100%",maxWidth:330,marginBottom:16,padding:"12px 14px",background:`${T.accent}0a`,border:`1px solid ${T.accent}30`,borderRadius:12}}>
      <p style={{fontSize:12,color:T.text,marginBottom:8,lineHeight:1.5}}>Already used Bitelyze before? Pull your profile from the cloud.</p>
      <button onClick={checkCloud} disabled={checking} style={{width:"100%",padding:"9px",borderRadius:10,border:`1px solid ${T.accent}50`,background:T.accentDim,color:T.accent,fontSize:12,fontWeight:700,cursor:checking?"wait":"pointer",fontFamily:"inherit",opacity:checking?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        {checking?<><div style={{width:12,height:12,border:`2px solid ${T.accent}40`,borderTop:`2px solid ${T.accent}`,borderRadius:"50%"}} className="spin"/> Checking cloud...</>:<><Download size={13}/> Check for existing profile</>}
      </button>
      {checkResult&&!checkResult.ok&&<p style={{fontSize:11,color:T.muted,marginTop:8,lineHeight:1.4}}>{checkResult.msg}</p>}
      {checkResult&&checkResult.ok&&<p style={{fontSize:11,color:T.accent,marginTop:8,lineHeight:1.4,fontWeight:600}}>✓ Profile found! Loading dashboard...</p>}
    </div>

    <div style={{width:"100%",maxWidth:330}}>
      {[[<Camera size={19} color={T.accent}/>,"Snap food → instant calorie breakdown"],[<Brain size={19} color={T.accent}/>,"Smart coaching tips personalised to you"],[<Trophy size={19} color={T.accent}/>,"Streaks, badges & weekly progress"],[<Droplets size={19} color={T.accent}/>,"Hydration tracking & meal reminders"]].map(([icon,text])=>(<div key={text} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 15px",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:9,textAlign:"left"}}><span style={{fontSize:19,display:"inline-flex",alignItems:"center"}}>{icon}</span><span style={{fontSize:13,color:T.muted,fontWeight:500}}>{text}</span></div>))}
      <Btn onClick={onNext} style={{marginTop:14,fontSize:16,padding:"15px"}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Let's Go <ArrowRight size={14}/></span></Btn>
    </div>
  </div>);
}

function StepBasic({p,setP,onNext,onBack}){const ok=p.name.trim()&&p.age&&parseInt(p.age)>0&&p.gender;return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`}}><button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button><ProgressDots total={4} current={0}/><h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Let's get to know you</h2><p style={{color:T.muted,fontSize:13}}>Step 1 of 4 — Basic information</p></div><div style={{padding:"24px 22px 40px",maxWidth:480,margin:"0 auto"}}><TextInput label="Your Name" value={p.name} onChange={v=>setP(x=>({...x,name:v}))} placeholder="Enter your name"/><NumInput label="Age" value={p.age} onChange={v=>setP(x=>({...x,age:v}))} unit="yrs" placeholder="Enter your age"/><p style={{fontSize:11,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>Gender</p><div style={{display:"flex",gap:10,marginBottom:26}}>{[["Male",<User size={20}/>],["Female",<User size={20}/>]].map(([g,icon])=>(<button key={g} onClick={()=>setP(x=>({...x,gender:g}))} style={{flex:1,padding:"13px",borderRadius:12,border:`1.5px solid ${p.gender===g?T.accent:T.border}`,background:p.gender===g?T.accentDim:T.inputBg,color:p.gender===g?T.accent:T.text,fontWeight:700,fontSize:14,cursor:"pointer",transition:"all .18s",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{fontSize:20,display:"inline-flex",alignItems:"center"}}>{icon}</span>{g}</button>))}</div><Btn onClick={onNext} disabled={!ok}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn></div></div>);}

function MeasureHelp({type,onClose}){const tips={height:{title:"How to Measure Your Height",Icon:Ruler,steps:["Stand barefoot on a flat floor against a wall.","Keep your heels, back, and head touching the wall.","Look straight ahead (chin parallel to the floor).","Place a flat object (book/ruler) on top of your head, pressing against the wall.","Mark the wall where the bottom of the object meets it.","Measure from the floor to the mark with a tape measure.","That's your height in cm."],alt:{title:"No tape measure?",tips:["Use a door frame — most standard doors are 203 cm (6'8\"). Mark your height on it and estimate.","Use a string/yarn to mark your height, then measure the string against a known object (e.g. A4 paper = 29.7 cm).","Most smartphone apps can measure height using your camera (search \"height measure\" in your app store)."]}},weight:{title:"How to Measure Your Weight",Icon:Scale,steps:["Weigh yourself first thing in the morning, after using the bathroom.","Wear minimal or no clothing for accuracy.","Place the scale on a hard, flat surface (not carpet).","Stand still with weight evenly on both feet.","Wait for the number to stabilize before reading.","Record the number in kg."],alt:{title:"No scale at home?",tips:["Visit a pharmacy — most have free-to-use digital scales.","Your gym or local health center will have one.","If you only know your weight in lbs, divide by 2.205 to get kg (e.g. 154 lbs ÷ 2.205 = 69.8 kg)."]}}};const d=tips[type];const Icon=d.Icon;return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"20px 20px 0 0",padding:"24px 22px 32px",maxWidth:480,width:"100%",maxHeight:"80vh",overflowY:"auto",animation:"slideUp .3s ease"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:20,fontWeight:800,color:T.text,display:"inline-flex",alignItems:"center",gap:8}}><Icon size={20} color={T.accent}/> {d.title}</span><button onClick={onClose} style={{background:"none",border:"none",color:T.muted,fontSize:20,cursor:"pointer",display:"inline-flex",alignItems:"center"}}><X size={20}/></button></div><ol style={{paddingLeft:20,marginBottom:20}}>{d.steps.map((s,i)=>(<li key={i} style={{color:T.text,fontSize:13,lineHeight:1.7,marginBottom:6}}>{s}</li>))}</ol><div style={{background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:12,padding:"14px 16px"}}><p style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:8}}>{d.alt.title}</p>{d.alt.tips.map((t,i)=>(<p key={i} style={{fontSize:12,color:T.muted,lineHeight:1.6,marginBottom:i<d.alt.tips.length-1?6:0}}>• {t}</p>))}</div></div></div>);}
function StepBody({p,setP,onNext,onBack}){const[helpType,setHelpType]=useState(null);const ok=p.height&&p.weight&&parseFloat(p.height)>0&&parseFloat(p.weight)>0;return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`}}><button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button><ProgressDots total={4} current={1}/><h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Body Measurements</h2><p style={{color:T.muted,fontSize:13}}>Step 2 of 4 — Used to calculate your BMR</p></div><div style={{padding:"22px 20px 40px",maxWidth:480,margin:"0 auto"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>Height</p><button onClick={()=>setHelpType("height")} style={{background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:8,padding:"3px 10px",fontSize:11,color:T.accent,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4}}><Ruler size={12}/> How to measure</button></div><div style={{display:"flex",alignItems:"center",background:T.inputBg,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:15}}><input type="number" value={p.height} onChange={e=>setP(x=>({...x,height:e.target.value}))} placeholder="Enter your height" style={{flex:1,padding:"13px 16px",background:"transparent",border:"none",color:T.text,fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit"}}/><span style={{padding:"0 16px",color:T.muted,fontSize:13,fontWeight:600}}>cm</span></div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>Current Weight</p><button onClick={()=>setHelpType("weight")} style={{background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:8,padding:"3px 10px",fontSize:11,color:T.accent,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4}}><Scale size={12}/> How to measure</button></div><div style={{display:"flex",alignItems:"center",background:T.inputBg,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:15}}><input type="number" value={p.weight} onChange={e=>setP(x=>({...x,weight:e.target.value}))} placeholder="Enter your weight" style={{flex:1,padding:"13px 16px",background:"transparent",border:"none",color:T.text,fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit"}}/><span style={{padding:"0 16px",color:T.muted,fontSize:13,fontWeight:600}}>kg</span></div><NumInput label="Target Weight (optional)" value={p.targetWeight} onChange={v=>setP(x=>({...x,targetWeight:v}))} unit="kg" placeholder="Enter target weight"/><Btn onClick={onNext} disabled={!ok}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn></div>{helpType&&<MeasureHelp type={helpType} onClose={()=>setHelpType(null)}/>}</div>);}

function StepActivity({p,setP,onNext,onBack}){const opts=[{k:"sedentary",l:"Sedentary",d:"Desk job, little or no exercise",Icon:Sofa},{k:"light",l:"Lightly Active",d:"Walk sometimes, light exercise 1–3x/week",Icon:Footprints},{k:"moderate",l:"Moderately Active",d:"Exercise 3–5x per week",Icon:Activity},{k:"active",l:"Very Active",d:"Hard training 6–7x/week",Icon:Dumbbell},{k:"very_active",l:"Extremely Active",d:"Physical job + daily training",Icon:Zap}];return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`}}><button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button><ProgressDots total={4} current={2}/><h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Activity Level</h2><p style={{color:T.muted,fontSize:13}}>Step 3 of 4 — How active are you?</p></div><div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>{opts.map(o=>{const Icon=o.Icon;return(<div key={o.k} onClick={()=>setP(x=>({...x,activity:o.k}))} style={{display:"flex",alignItems:"center",gap:13,padding:"13px 15px",marginBottom:9,background:p.activity===o.k?T.accentDim:T.inputBg,border:`1.5px solid ${p.activity===o.k?T.accent:T.border}`,borderRadius:14,cursor:"pointer",transition:"all .18s"}}><span style={{fontSize:24,display:"inline-flex",alignItems:"center"}}><Icon size={24} color={p.activity===o.k?T.accent:T.muted}/></span><div style={{flex:1}}><p style={{fontSize:14,fontWeight:700,color:p.activity===o.k?T.accent:T.text,marginBottom:2}}>{o.l}</p><p style={{fontSize:12,color:T.muted}}>{o.d}</p></div>{p.activity===o.k&&<span style={{color:T.accent,display:"inline-flex",alignItems:"center"}}><Check size={18}/></span>}</div>);})}<Btn onClick={onNext} disabled={!p.activity} style={{marginTop:8}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn></div></div>);}

function StepGoal({p,setP,onNext,onBack}){const goals=[{k:"lose_fast",l:"Lose Weight Fast",Icon:Flame},{k:"lose",l:"Lose Weight",Icon:TrendingDown,best:true},{k:"lose_slow",l:"Lose Gradually",Icon:Sprout},{k:"maintain",l:"Maintain Weight",Icon:Scale},{k:"gain",l:"Build Muscle",Icon:Dumbbell}];return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`}}><button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button><ProgressDots total={9} current={3}/><h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Your Goal</h2><p style={{color:T.muted,fontSize:13}}>Step 4 of 9 — What are you here to do?</p></div><div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>{goals.map(g=>{const Icon=g.Icon;return(<div key={g.k} onClick={()=>setP(x=>({...x,goal:g.k}))} style={{display:"flex",alignItems:"center",gap:13,padding:"15px 15px",marginBottom:9,background:p.goal===g.k?T.accentDim:T.inputBg,border:`1.5px solid ${p.goal===g.k?T.accent:T.border}`,borderRadius:14,cursor:"pointer",transition:"all .18s"}}><span style={{fontSize:24,display:"inline-flex",alignItems:"center"}}><Icon size={24} color={p.goal===g.k?T.accent:T.muted}/></span><div style={{flex:1}}><p style={{fontSize:14,fontWeight:700,color:p.goal===g.k?T.accent:T.text}}>{g.l}{g.best&&<span style={{fontSize:9,background:T.accent,color:"#000",borderRadius:5,padding:"2px 6px",marginLeft:7,fontWeight:800}}>BEST</span>}</p></div>{p.goal===g.k&&<span style={{color:T.accent,display:"inline-flex",alignItems:"center"}}><Check size={18}/></span>}</div>);})}<Btn onClick={onNext} disabled={!p.goal} style={{marginTop:8}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn></div></div>);}

function MotivationalSlide({Icon,headline,subheadline,onContinue,autoMs=3000,showButton=true,showDots=false}){
  useEffect(()=>{if(!autoMs)return;const t=setTimeout(()=>{onContinue&&onContinue();},autoMs);return()=>clearTimeout(t);},[autoMs,onContinue]);
  return(<div className="fadeIn" style={{minHeight:"100vh",background:"#090912",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"calc(40px + env(safe-area-inset-top)) 22px 40px",textAlign:"center"}}>
    <div className="bounce-pop" style={{width:112,height:112,borderRadius:"50%",background:`${T.accent}15`,border:`1px solid ${T.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:30,animation:"bouncePop .5s ease forwards, pulseGlow 2.4s ease-in-out infinite"}}>
      <Icon size={64} color={T.accent}/>
    </div>
    <h1 style={{fontSize:32,fontWeight:900,letterSpacing:"-0.5px",color:"#ffffff",marginBottom:14,lineHeight:1.2}}>{headline}</h1>
    <p style={{color:"#9999a8",fontSize:14,lineHeight:1.7,maxWidth:320}}>{subheadline}</p>
    {showDots&&<div style={{display:"flex",gap:8,marginTop:22}}>{[0,0.2,0.4].map((d,i)=>(<div key={i} style={{width:9,height:9,borderRadius:"50%",background:T.accent,animation:`pulse 1.2s ease-in-out infinite`,animationDelay:`${d}s`}}/>))}</div>}
    {showButton&&<button onClick={onContinue} style={{marginTop:38,padding:"10px 26px",borderRadius:99,border:`1px solid ${T.accent}50`,background:"transparent",color:T.accent,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={13}/></button>}
  </div>);
}

function Motivational1({onContinue}){return(<MotivationalSlide Icon={Trophy} headline="You've got this." subheadline="People who log consistently lose 2x more weight than those who don't. Let's build a plan that works for you." onContinue={onContinue} autoMs={3000}/>);}

function Motivational2({onContinue}){return(<MotivationalSlide Icon={Lightbulb} headline="Great choice!" subheadline="We're almost done building your personalized plan. A few more questions to make it perfect for you." onContinue={onContinue} autoMs={3000}/>);}

function Motivational3({onContinue}){return(<MotivationalSlide Icon={Heart} headline="Thank you for trusting us." subheadline="Now let's build your personalized plan..." onContinue={onContinue} autoMs={2500} showButton={false} showDots={true}/>);}

function StepGoalSpeed({p,setP,onNext,onBack}){
  const cw=parseFloat(p.weight)||0;
  const tw=parseFloat(p.targetWeight)||cw;
  const weightDelta=Math.abs(cw-tw)||0;
  const speed=parseFloat(p.goalSpeed)||0.5;
  const isGain=p.goal==="gain";
  const acts={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};
  const a=parseFloat(p.age)||0,h=parseFloat(p.height)||0;
  const bmr=cw&&h&&a?Math.round(p.gender==="Male"?10*cw+6.25*h-5*a+5:10*cw+6.25*h-5*a-161):0;
  const tdee=Math.round(bmr*(acts[p.activity]||1.375));
  const dailyDelta=Math.round(speed*7700/7);
  const dailyGoal=isGain?tdee+dailyDelta:tdee-dailyDelta;
  const weeks=weightDelta>0?Math.ceil(weightDelta/speed):0;
  const timeLabel=weeks<=0?"—":weeks>8?`${Math.round(weeks/4.345)} months`:`${weeks} weeks`;
  const copy={0.25:"A sustainable pace. Easy to maintain long-term.",0.5:"The most balanced pace, motivating and ideal for most users.",0.75:"Above average pace — requires more discipline.",1:"Ambitious but requires discipline. Results will be visible quickly."};
  const fillPct=((speed-0.25)/(1-0.25))*100;
  return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}>
    <div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button>
      <ProgressDots total={9} current={4}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>How fast do you want to reach your goal?</h2>
      <p style={{color:T.muted,fontSize:13}}>Step 5 of 9 — Choose your pace</p>
    </div>
    <div style={{padding:"24px 22px 40px",maxWidth:480,margin:"0 auto"}}>
      <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700,marginBottom:10,textAlign:"center"}}>Weight {isGain?"gain":"loss"} speed per week</p>
      <p style={{fontSize:48,fontWeight:900,color:T.accent,textAlign:"center",lineHeight:1,marginBottom:4}}>{speed} kg</p>
      <p style={{fontSize:12,color:T.muted,textAlign:"center",marginBottom:22}}>per week</p>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.muted,marginBottom:10,padding:"0 4px"}}>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:18}}>🦥</span> Slow</span>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:18}}>🐰</span> Recommended</span>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:18}}>🐆</span> Fast</span>
      </div>
      <div style={{position:"relative",marginBottom:22}}>
        <div style={{height:8,borderRadius:99,background:T.barBg,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${fillPct}%`,background:`linear-gradient(90deg,${T.accent},#00b87a)`,borderRadius:99,transition:"width .25s ease"}}/>
        </div>
        <input type="range" min={0.25} max={1} step={0.25} value={speed} onChange={e=>setP(x=>({...x,goalSpeed:parseFloat(e.target.value)}))} style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer"}}/>
        <div style={{position:"absolute",top:"50%",left:`${fillPct}%`,transform:"translate(-50%,-50%)",width:22,height:22,borderRadius:"50%",background:"#ffffff",boxShadow:`0 0 0 3px ${T.accent}, 0 2px 6px rgba(0,0,0,0.2)`,pointerEvents:"none"}}/>
      </div>
      <div style={{background:`${T.accent}12`,border:`1px solid ${T.accent}30`,borderRadius:14,padding:"16px 16px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
          <Target size={18} color={T.accent} style={{flexShrink:0,marginTop:2}}/>
          <p style={{fontSize:14,fontWeight:700,color:T.text,lineHeight:1.5}}>You'll reach your goal in ~{timeLabel}</p>
        </div>
        <p style={{fontSize:12,color:T.muted,lineHeight:1.55,marginBottom:10}}>{copy[speed]||copy[0.5]}</p>
        <div style={{height:1,background:`${T.accent}20`,marginBottom:10}}/>
        <p style={{fontSize:12,color:T.text,lineHeight:1.5}}>Your daily calorie goal will be <span style={{color:T.accent,fontWeight:800}}>{dailyGoal} kcal</span></p>
      </div>
      <Btn onClick={onNext}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn>
    </div>
  </div>);
}

// Small skip link shown top-right on optional steps
const SkipLink=({onClick})=>(<button onClick={onClick} style={{position:"absolute",top:"calc(20px + env(safe-area-inset-top))",right:20,background:"none",border:"none",color:"#a0a0c0",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",padding:"4px 2px",textDecoration:"underline"}}>Skip for now</button>);

// Bottom sheet shown when user first taps skip on step 6
const SkipAllSheet=({onSkipAll,onKeepGoing})=>(<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .25s ease"}} onClick={onKeepGoing}>
  <div onClick={e=>e.stopPropagation()} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"24px 24px 0 0",padding:"28px 22px calc(28px + env(safe-area-inset-bottom))",width:"100%",maxWidth:480,animation:"slideUp .35s cubic-bezier(0.34,1.56,0.64,1)"}}>
    <div style={{width:60,height:60,borderRadius:18,background:`${T.accent}15`,border:`1px solid ${T.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Zap size={28} color={T.accent}/></div>
    <h2 style={{fontSize:20,fontWeight:900,color:T.text,textAlign:"center",marginBottom:8}}>Want the quick path?</h2>
    <p style={{fontSize:13,color:T.muted,textAlign:"center",lineHeight:1.6,marginBottom:20}}>You can skip the remaining questions and go straight to your plan. You'll get less personalized coaching but can come back anytime to answer them in Settings → Profile.</p>
    <button onClick={onSkipAll} style={{width:"100%",padding:"13px",borderRadius:12,border:`1.5px solid ${T.border}`,background:"transparent",color:T.text,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>Skip All Remaining</button>
    <button onClick={onKeepGoing} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:T.accent,color:"#000",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Keep Going</button>
  </div>
</div>);

function StepBlockers({p,setP,onNext,onBack,onSkipAll}){
  const opts=[{id:"consistency",icon:"📊",label:"Lack of consistency"},{id:"habits",icon:"🍔",label:"Unhealthy eating habits"},{id:"support",icon:"🤝",label:"Lack of support"},{id:"schedule",icon:"📅",label:"Busy schedule"},{id:"inspiration",icon:"🍳",label:"Lack of meal inspiration"},{id:"stress",icon:"😰",label:"Stress and emotional eating"},{id:"cost",icon:"💸",label:"Healthy food feels expensive"},{id:"start",icon:"🤷",label:"I don't know where to start"}];
  const[showSheet,setShowSheet]=useState(false);
  const[err,setErr]=useState("");
  const selected=p.blockers||[];
  const toggle=(id)=>{
    const has=selected.includes(id);
    if(has){setP(x=>({...x,blockers:(x.blockers||[]).filter(b=>b!==id)}));setErr("");}
    else{
      if(selected.length>=3){setErr("You can select up to 3.");setTimeout(()=>setErr(""),2200);return;}
      setP(x=>({...x,blockers:[...(x.blockers||[]),id]}));setErr("");
    }
  };
  return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg,position:"relative"}}>
    <div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`,position:"relative"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button>
      <SkipLink onClick={()=>setShowSheet(true)}/>
      <ProgressDots total={9} current={5}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>What's stopping you from reaching your goals?</h2>
      <p style={{color:T.muted,fontSize:13}}>Step 6 of 9 — Select all that apply</p>
    </div>
    <div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>
      <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700,marginBottom:12}}>Select up to 3</p>
      {opts.map(o=>{const on=selected.includes(o.id);return(<div key={o.id} onClick={()=>toggle(o.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 15px",marginBottom:9,background:on?`${T.accent}15`:T.inputBg,border:`1.5px solid ${on?T.accent:T.border}`,borderRadius:14,cursor:"pointer",transition:"all .18s"}}>
        <span style={{fontSize:22,display:"inline-flex",alignItems:"center"}}>{o.icon}</span>
        <span style={{flex:1,fontSize:14,fontWeight:700,color:on?T.accent:T.text}}>{o.label}</span>
        {on&&<Check size={18} color={T.accent}/>}
      </div>);})}
      {err&&<p style={{fontSize:12,color:T.orange,marginBottom:10,textAlign:"center"}}>{err}</p>}
      <Btn onClick={onNext} disabled={selected.length===0} style={{marginTop:8}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn>
    </div>
    {showSheet&&<SkipAllSheet onKeepGoing={()=>setShowSheet(false)} onSkipAll={()=>{setP(x=>({...x,blockers:null,habits:null,planningHabit:null,motivation:null}));setShowSheet(false);if(onSkipAll)onSkipAll();}}/>}
  </div>);
}

function StepHabits({p,setP,onNext,onBack,onSkip}){
  const rec=[["track_macros","Track macros"],["track_calories","Track calories"],["plan_meals","Plan more meals"]];
  const more=[["track_nutrients","Track nutrients"],["meal_prep","Meal prep and cook"],["eat_mindfully","Eat mindfully"],["balanced","Eat a balanced diet"],["whole_foods","Eat whole foods"],["more_protein","Eat more protein"],["more_fiber","Eat more fiber"],["more_vegs","Eat more vegetables"],["more_fruit","Eat more fruit"],["more_water","Drink more water"],["sleep","Prioritize sleep"],["move_more","Move more"],["workout","Workout more"]];
  useEffect(()=>{if((p.habits||[]).length===0&&p.goal){setP(x=>({...x,habits:["track_calories"]}));}},[]);
  const[err,setErr]=useState("");
  const selected=p.habits||[];
  const toggle=(id)=>{
    const has=selected.includes(id);
    if(has){setP(x=>({...x,habits:(x.habits||[]).filter(h=>h!==id)}));setErr("");}
    else{
      if(selected.length>=3){setErr("You can select up to 3.");setTimeout(()=>setErr(""),2200);return;}
      setP(x=>({...x,habits:[...(x.habits||[]),id]}));setErr("");
    }
  };
  const Chip=({id,label})=>{const on=selected.includes(id);return(<button onClick={()=>toggle(id)} style={{padding:"9px 14px",borderRadius:99,border:`1px solid ${on?T.accent:T.border}`,background:on?T.accent:T.inputBg,color:on?"#000":T.muted,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6,transition:"all .18s"}}>{on&&<Check size={12}/>}{label}</button>);};
  return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}>
    <div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`,position:"relative"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button>
      <SkipLink onClick={()=>{setP(x=>({...x,habits:null}));if(onSkip)onSkip();}}/>
      <ProgressDots total={9} current={6}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Which healthy habits matter most to you?</h2>
      <p style={{color:T.muted,fontSize:13}}>Step 7 of 9 — Select up to 3</p>
    </div>
    <div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>
      <p style={{fontSize:12,color:T.accent,fontWeight:700,marginBottom:14,textAlign:"center"}}>{selected.length} of 3 selected</p>
      <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700,marginBottom:10}}>Recommended for you</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>{rec.map(([id,label])=><Chip key={id} id={id} label={label}/>)}</div>
      <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700,marginBottom:10}}>More healthy habits</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>{more.map(([id,label])=><Chip key={id} id={id} label={label}/>)}</div>
      {err&&<p style={{fontSize:12,color:T.orange,marginBottom:10,textAlign:"center"}}>{err}</p>}
      <Btn onClick={onNext} disabled={selected.length===0}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn>
    </div>
  </div>);
}

function StepMealPlanning({p,setP,onNext,onBack,onSkip}){
  const opts=[{id:"never",label:"Never"},{id:"rarely",label:"Rarely"},{id:"occasionally",label:"Occasionally"},{id:"frequently",label:"Frequently"},{id:"always",label:"Always"}];
  return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}>
    <div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`,position:"relative"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button>
      <SkipLink onClick={()=>{setP(x=>({...x,planningHabit:null}));if(onSkip)onSkip();}}/>
      <ProgressDots total={9} current={7}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>How often do you plan your meals in advance?</h2>
      <p style={{color:T.muted,fontSize:13}}>Step 8 of 9 — One answer</p>
    </div>
    <div style={{padding:"22px 20px 40px",maxWidth:480,margin:"0 auto"}}>
      {opts.map(o=>{const on=p.planningHabit===o.id;return(<div key={o.id} onClick={()=>setP(x=>({...x,planningHabit:o.id}))} style={{display:"flex",alignItems:"center",gap:12,padding:"15px 16px",marginBottom:10,background:on?`${T.accent}10`:T.inputBg,border:`1.5px solid ${on?T.accent:T.border}`,borderRadius:12,cursor:"pointer",transition:"all .18s"}}>
        <span style={{flex:1,fontSize:15,fontWeight:700,color:on?T.accent:T.text}}>{o.label}</span>
        <span style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${on?T.accent:T.muted}`,background:on?T.accent:"transparent",display:"inline-flex",alignItems:"center",justifyContent:"center",transition:"all .18s"}}>{on&&<span style={{width:8,height:8,borderRadius:"50%",background:"#000"}}/>}</span>
      </div>);})}
      <Btn onClick={onNext} disabled={!p.planningHabit} style={{marginTop:8}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn>
    </div>
  </div>);
}

function StepMotivation({p,setP,onNext,onBack,onSkip}){
  const opts=[{id:"confidence",icon:"🌟",label:"Feel more confident in myself"},{id:"energy",icon:"⚡",label:"Have more energy and better mood"},{id:"clothes",icon:"👕",label:"Fit into clothes I love"},{id:"health",icon:"🏃",label:"Improve my physical health"},{id:"loved_ones",icon:"👨‍👩‍👧",label:"Be more present for loved ones"}];
  return(<div className="slideIn" style={{minHeight:"100vh",background:T.bg}}>
    <div style={{padding:"calc(20px + env(safe-area-inset-top)) 22px 16px",background:T.stepBg,borderBottom:`1px solid ${T.border}`,position:"relative"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14,display:"inline-flex",alignItems:"center"}}><ArrowLeft size={20}/></button>
      <SkipLink onClick={()=>{setP(x=>({...x,motivation:null}));if(onSkip)onSkip();}}/>
      <ProgressDots total={9} current={8}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>What would achieving your goal mean to you?</h2>
      <p style={{color:T.muted,fontSize:13}}>Step 9 of 9 — Select your top reason</p>
    </div>
    <div style={{padding:"22px 20px 40px",maxWidth:480,margin:"0 auto"}}>
      {opts.map(o=>{const on=p.motivation===o.id;return(<div key={o.id} onClick={()=>setP(x=>({...x,motivation:o.id}))} style={{display:"flex",alignItems:"center",gap:12,padding:"15px 16px",marginBottom:10,background:on?`${T.accent}15`:T.inputBg,border:`1.5px solid ${on?T.accent:T.border}`,borderRadius:14,cursor:"pointer",transition:"all .18s"}}>
        <span style={{fontSize:24,display:"inline-flex",alignItems:"center"}}>{o.icon}</span>
        <span style={{flex:1,fontSize:14,fontWeight:700,color:on?T.accent:T.text,lineHeight:1.35}}>{o.label}</span>
        {on&&<Check size={18} color={T.accent}/>}
      </div>);})}
      <Btn onClick={onNext} disabled={!p.motivation} style={{marginTop:8}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={14}/></span></Btn>
    </div>
  </div>);
}

function ComparisonSlide({onContinue}){
  const[animate,setAnimate]=useState(false);
  const[leftNum,setLeftNum]=useState(0);
  const[rightNum,setRightNum]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setAnimate(true),120);
    const dur=1100;const start=Date.now();
    const tick=()=>{const e=Math.min(1,(Date.now()-start)/dur);const ease=1-Math.pow(1-e,3);setLeftNum(Math.round(20*ease));setRightNum(parseFloat((2*ease).toFixed(1)));if(e<1)raf=requestAnimationFrame(tick);};
    let raf=requestAnimationFrame(tick);
    const t2=setTimeout(()=>{onContinue&&onContinue();},4000);
    return()=>{clearTimeout(t1);clearTimeout(t2);cancelAnimationFrame(raf);};
  },[onContinue]);
  return(<div className="fadeIn" style={{minHeight:"100vh",background:"#090912",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"calc(40px + env(safe-area-inset-top)) 22px 40px",textAlign:"center"}}>
    <h1 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.3px",color:"#ffffff",marginBottom:30,lineHeight:1.3,maxWidth:340}}>Lose 2x more weight with Bitelyze than without.</h1>
    <div style={{background:`${T.accent}08`,border:`1px solid ${T.accent}25`,borderRadius:20,padding:"28px 30px 22px",width:"100%",maxWidth:320,marginBottom:18}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:36,height:180,marginBottom:14}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,height:"100%",justifyContent:"flex-end"}}>
          <div style={{width:54,height:animate?36:0,background:"#3a3a4a",borderRadius:"8px 8px 0 0",transition:"height 1.1s cubic-bezier(0.16,1,0.3,1)"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,height:"100%",justifyContent:"flex-end"}}>
          <div style={{width:54,height:animate?180:0,background:`linear-gradient(180deg,${T.accent},#00b87a)`,borderRadius:"8px 8px 0 0",transition:"height 1.1s cubic-bezier(0.16,1,0.3,1)",boxShadow:`0 0 24px ${T.accent}60`}}/>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:36}}>
        <div style={{width:54,textAlign:"center"}}>
          <p style={{fontSize:20,fontWeight:900,color:"#9999a8",marginBottom:2}}>{leftNum}%</p>
          <p style={{fontSize:10,color:"#8888a0",lineHeight:1.3}}>Without Bitelyze</p>
        </div>
        <div style={{width:54,textAlign:"center"}}>
          <p style={{fontSize:20,fontWeight:900,color:T.accent,marginBottom:2}}>{rightNum}X</p>
          <p style={{fontSize:10,color:T.accent,lineHeight:1.3,fontWeight:700}}>With Bitelyze</p>
        </div>
      </div>
    </div>
    <p style={{color:"#9999a8",fontSize:13,lineHeight:1.6,maxWidth:320,marginBottom:14}}>Bitelyze keeps you accountable, honest with yourself and consistent. That's what actually drives results.</p>
    <p style={{color:"#55556a",fontSize:9,marginBottom:28}}>Based on average user outcomes over 12 weeks.</p>
    <button onClick={onContinue} style={{padding:"10px 26px",borderRadius:99,border:`1px solid ${T.accent}50`,background:"transparent",color:T.accent,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6}}>Continue <ArrowRight size={13}/></button>
  </div>);
}

function PlanReady({profile,goal,onStart,t,isEditing}){const p=profile||{};const[starting,setStarting]=useState(false);const handleStart=()=>{if(starting)return;setStarting(true);try{onStart();}catch(e){console.error("[start tracking]",e);setStarting(false);}};const tr=t||((k)=>({"plan.startTracking":"Start Tracking","plan.settingUp":"Setting up your dashboard…","plan.saveChanges":"Save Changes","plan.saving":"Saving changes…"})[k]||k);const w=parseFloat(p.weight)||0,h=parseFloat(p.height)||0,a=parseFloat(p.age)||0;const acts={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};const bmr=w&&h&&a?Math.round(p.gender==="Male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161):0;const tdee=Math.round(bmr*(acts[p.activity]||1.375));const bmi=h>0?(w/((h/100)**2)).toFixed(1):0;const bi=bmi<18.5?["Underweight",T.blue]:bmi<25?["Healthy",T.accent]:bmi<30?["Overweight",T.orange]:["Obese",T.danger];
  const goalLabels={lose_fast:"weight loss",lose:"weight loss",lose_slow:"weight loss",maintain:"weight maintenance",gain:"muscle gain"};
  const motivationLabels={confidence:"Feel more confident in myself",energy:"Have more energy and better mood",clothes:"Fit into clothes I love",health:"Improve my physical health",loved_ones:"Be more present for loved ones"};
  const gLabel=goalLabels[p.goal]||"your goals";
  const showSpeed=p.goal&&p.goal!=="maintain"&&p.goalSpeed;
  return(<div className="fadeIn" style={{minHeight:"100vh",background:T.bg,backgroundImage:`radial-gradient(ellipse at 50% 10%, #00e5a010 0%, transparent 58%)`,paddingBottom:48}}>
    <div style={{padding:"28px 22px 12px",display:"flex",justifyContent:"center"}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${T.accent}10`,border:`1px solid ${T.accent}30`,borderRadius:99,padding:"6px 12px"}}>
        <Target size={12} color={T.accent}/>
        <span style={{fontSize:11,color:T.accent,fontWeight:700}}>Built for {gLabel}{showSpeed?` at ${p.goalSpeed} kg/week`:""}</span>
      </div>
    </div>
    <div style={{padding:"10px 22px 22px",textAlign:"center"}}><div className="pop" style={{width:76,height:76,borderRadius:22,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 18px",boxShadow:`0 0 40px ${T.accentGlow}`,color:"#000"}}><Target size={38}/></div><h2 style={{fontSize:26,fontWeight:900,marginBottom:7,color:T.text}}>Your Plan is Ready,<br/><span style={{color:T.accent}}>{p.name}!</span></h2><p style={{color:T.muted,fontSize:13}}>Here are your personalised targets</p></div>
    <div style={{padding:"0 18px",maxWidth:480,margin:"0 auto"}}><div style={{background:`${T.accent}08`,border:`1.5px solid ${T.accent}45`,borderRadius:20,padding:"26px 20px",marginBottom:13,textAlign:"center"}}><p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:9}}>Daily Calorie Goal</p><p style={{fontSize:64,fontWeight:900,color:T.accent,lineHeight:1}}>{goal}</p><p style={{fontSize:13,color:T.muted,marginTop:5}}>kcal per day</p></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:13}}>{[["BMR",`${bmr} kcal`,"Calories at rest",T.blue],["TDEE",`${tdee} kcal`,"Maintenance",T.orange],["BMI",bi[0],`${bmi} kg/m²`,bi[1]],["Target",p.targetWeight?`${p.targetWeight} kg`:"—","Goal weight",T.accent]].map(([l,v,s,c])=>(<div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"13px 15px"}}><p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".6px",marginBottom:5}}>{l}</p><p style={{fontSize:16,fontWeight:800,color:c,marginBottom:3}}>{v}</p><p style={{fontSize:11,color:T.muted}}>{s}</p></div>))}</div>
    <Card><CardTitle icon={<FlaskConical size={16} color={T.accent}/>}>Recommended Daily Macros</CardTitle><MacroBar label={`Protein — ${Math.round(goal*.3/4)}g`} val={Math.round(goal*.3/4)} max={200} color={T.blue}/><MacroBar label={`Carbs — ${Math.round(goal*.45/4)}g`} val={Math.round(goal*.45/4)} max={350} color={T.orange}/><MacroBar label={`Fat — ${Math.round(goal*.25/9)}g`} val={Math.round(goal*.25/9)} max={100} color="#ff6b9d"/></Card>
    {p.motivation&&motivationLabels[p.motivation]&&<div style={{background:`linear-gradient(135deg, ${T.accent}12, ${T.bg})`,border:`1px solid ${T.accent}30`,borderRadius:14,padding:"15px 16px",marginBottom:14}}>
      <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"1.2px",fontWeight:700,marginBottom:6}}>Your Reason</p>
      <p style={{fontSize:14,fontWeight:800,color:T.accent,lineHeight:1.4}}>{motivationLabels[p.motivation]}</p>
    </div>}
    <Btn onClick={handleStart} disabled={starting} style={{fontSize:16,padding:"15px"}}><span style={{display:"inline-flex",alignItems:"center",gap:8}}>{starting?<><div style={{width:14,height:14,border:"2px solid currentColor",borderTopColor:"transparent",borderRadius:"50%",opacity:0.8}} className="spin"/> {isEditing?tr("plan.saving"):tr("plan.settingUp")}</>:<>{isEditing?<Check size={16}/>:<Rocket size={16}/>} {isEditing?tr("plan.saveChanges"):tr("plan.startTracking")}</>}</span></Btn></div></div>);}

function DashboardTour({name,onDone}){
  const[step,setStep]=useState(0);
  const steps=[
    {icon:<UtensilsCrossed size={32} color={T.accent}/>,title:`Welcome${name?`, ${name}`:""}!`,desc:"Here's a quick 30-second tour of Bitelyze. Let's get you started."},
    {icon:<Camera size={32} color={T.accent}/>,title:"Analyze any meal",desc:"Snap a photo or type your food. We'll give you instant calories, macros and a health score in under 3 seconds."},
    {icon:<ClipboardList size={32} color={T.accent}/>,title:"Log your day",desc:"Every meal is saved with a timestamp. Switch dates in the Log tab to view or add meals from any day."},
    {icon:<BarChart3 size={32} color={T.accent}/>,title:"See your progress",desc:"The Progress tab shows streaks, trends, macros and patterns across any time range you pick."},
    {icon:<Sparkles size={32} color={T.accent}/>,title:"You're all set",desc:"Tap Analyze below to log your first meal. You can revisit this from the Me tab anytime."}
  ];
  const current=steps[step];
  const last=step===steps.length-1;
  return(<div style={{position:"fixed",inset:0,zIndex:10000,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"22px",animation:"fadeIn .3s ease"}}>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:22,padding:"28px 24px 22px",maxWidth:360,width:"100%",textAlign:"center",boxShadow:`0 20px 60px rgba(0,0,0,0.4), 0 0 80px ${T.accent}12`,animation:"pop .4s ease"}}>
      <div style={{width:72,height:72,borderRadius:20,background:`${T.accent}15`,border:`1px solid ${T.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:`0 0 40px ${T.accent}20`}}>{current.icon}</div>
      <h2 style={{fontSize:22,fontWeight:900,color:T.text,marginBottom:10,letterSpacing:"-0.01em"}}>{current.title}</h2>
      <p style={{fontSize:14,color:T.muted,lineHeight:1.6,marginBottom:22}}>{current.desc}</p>
      {/* Dots */}
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20}}>
        {steps.map((_,i)=>(<div key={i} style={{width:i===step?22:7,height:7,borderRadius:99,background:i===step?T.accent:T.border,transition:"all .3s"}}/>))}
      </div>
      {/* Buttons */}
      <div style={{display:"flex",gap:10}}>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Back</button>}
        {!last&&step===0&&<button onClick={onDone} style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Skip</button>}
        <button onClick={()=>last?onDone():setStep(s=>s+1)} style={{flex:step===0?1.5:1,padding:"12px",borderRadius:12,border:"none",background:T.accent,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6}}>{last?"Got it!":"Next"} {!last&&<ArrowRight size={14}/>}</button>
      </div>
    </div>
  </div>);
}

function CoachChat({open,onClose,profile,goal,consumed,todayMeals,allHistory,uid,lang,t}){
  const[sessions,setSessions]=useState(()=>{
    try{
      const raw=localStorage.getItem(`bitelyze_coach_sessions_${uid}`);
      if(raw){const arr=JSON.parse(raw);if(Array.isArray(arr))return arr;}
      // Migrate old single-chat format
      const old=localStorage.getItem(`bitelyze_coach_${uid}`);
      if(old){
        const oldMsgs=JSON.parse(old);
        if(Array.isArray(oldMsgs)&&oldMsgs.filter(m=>m.role==="user").length>0){
          const migrated=[{id:Date.now()+"-m",startedAt:oldMsgs[0]?.ts||Date.now(),messages:oldMsgs}];
          try{localStorage.setItem(`bitelyze_coach_sessions_${uid}`,JSON.stringify(migrated));}catch(e){}
          try{localStorage.removeItem(`bitelyze_coach_${uid}`);}catch(e){}
          return migrated;
        }
        try{localStorage.removeItem(`bitelyze_coach_${uid}`);}catch(e){}
      }
      return[];
    }catch(e){return[];}
  });
  const[messages,setMessages]=useState([]);
  const[input,setInput]=useState("");
  const[sending,setSending]=useState(false);
  const[err,setErr]=useState(null);
  const[view,setView]=useState("chat"); // "chat" | "history" | "session"
  const[viewingIdx,setViewingIdx]=useState(null);
  const scrollRef=useRef(null);
  const inputRef=useRef(null);

  // Persist sessions list
  useEffect(()=>{
    try{localStorage.setItem(`bitelyze_coach_sessions_${uid}`,JSON.stringify(sessions));}catch(e){}
  },[sessions,uid]);

  // Auto-scroll on new messages or view change
  useEffect(()=>{
    if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;
  },[messages,view]);

  // Fresh greeting on open (when chat is empty)
  useEffect(()=>{
    if(open&&view==="chat"&&messages.length===0){
      const greeting=profile.name?`Hey ${profile.name} 👋 I'm your Bitelyze coach. Ask me anything — food suggestions, "can I have this?", stress eating, meal plans, or just vent. I know your goals and recent meals.`:`Hey! I'm your Bitelyze coach. Ask me anything — food suggestions, whether something fits your goal, or just chat. I know your profile and recent meals.`;
      setMessages([{role:"assistant",content:greeting,ts:Date.now()}]);
    }
  },[open,view]);

  // Lock body scroll when coach is open so keyboard doesn't push layout
  useEffect(()=>{
    if(open){
      const prev=document.body.style.overflow;
      document.body.style.overflow="hidden";
      return()=>{document.body.style.overflow=prev;};
    }
  },[open]);

  // Build recent summary for context (last 7 days)
  const recentSummary=useMemo(()=>{
    if(!allHistory||allHistory.length===0)return null;
    const byDate={};
    const now=new Date();
    const sevenAgo=new Date(now);sevenAgo.setDate(sevenAgo.getDate()-7);
    allHistory.forEach(m=>{
      const d=m.date||(m.timestamp?new Date(m.timestamp).toISOString().slice(0,10):null);
      if(!d)return;
      const dt=new Date(d);
      if(dt<sevenAgo||dt>now)return;
      if(!byDate[d])byDate[d]={cal:0,protein:0,meals:[]};
      byDate[d].cal+=Number(m.totalCalories)||0;
      byDate[d].protein+=Number(m.protein)||0;
      byDate[d].meals.push(m.foodName);
    });
    const days=Object.entries(byDate).map(([d,v])=>`${d}: ${v.cal} kcal, ${Math.round(v.protein)}g protein (${v.meals.slice(0,3).join(", ")})`);
    return days.length>0?days.join("\n"):null;
  },[allHistory]);

  const send=async()=>{
    const text=input.trim();
    if(!text||sending)return;
    const userMsg={role:"user",content:text,ts:Date.now()};
    const newMessages=[...messages,userMsg];
    setMessages(newMessages);
    setInput("");
    setSending(true);
    setErr(null);
    try{
      const userContext={
        name:profile.name,goal:profile.goal,goalSpeed:profile.goalSpeed,height:profile.height,weight:profile.weight,targetWeight:profile.targetWeight,
        dailyGoal:goal,consumed,todayMeals:todayMeals?.slice(-5),recentSummary,motivation:profile.motivation,blockers:profile.blockers,habits:profile.habits
      };
      const res=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:newMessages.map(m=>({role:m.role,content:m.content})),userContext,userEmail:auth.currentUser?.email||null,lang:lang||"en"})});
      if(!res.ok){
        const e=await res.json().catch(()=>({}));
        setErr(e.error?.message||e.error||"Coach is offline. Try again.");
        setSending(false);return;
      }
      const data=await res.json();
      setMessages(m=>[...m,{role:"assistant",content:data.reply||"Sorry, I didn't catch that. Try again?",ts:Date.now()}]);
    }catch(e){
      setErr("Network error. Try again.");
    }
    setSending(false);
  };

  const handleClose=()=>{
    const userMsgCount=messages.filter(m=>m.role==="user").length;
    if(userMsgCount>0){
      const session={
        id:Date.now()+"-"+Math.random().toString(36).slice(2,8),
        startedAt:messages[0]?.ts||Date.now(),
        messages:messages
      };
      setSessions(prev=>[session,...prev].slice(0,50));
    }
    setMessages([]);
    setInput("");
    setView("chat");
    setViewingIdx(null);
    onClose();
  };

  const deleteSession=(idx)=>{
    setSessions(prev=>prev.filter((_,i)=>i!==idx));
  };

  const formatSessionDate=(ts)=>{
    const d=new Date(ts);
    const now=new Date();
    const diffH=(now-d)/(1000*60*60);
    if(diffH<24)return`Today, ${d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}`;
    if(diffH<48)return`Yesterday, ${d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}`;
    if(diffH<7*24)return d.toLocaleDateString([],{weekday:'long',hour:'numeric',minute:'2-digit'});
    return d.toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'});
  };

  const getPreview=(s)=>{
    const firstUser=s.messages.find(m=>m.role==="user");
    return firstUser?firstUser.content.slice(0,100):"(no messages)";
  };

  if(!open)return null;
  const shownMessages=view==="session"&&viewingIdx!==null?(sessions[viewingIdx]?.messages||[]):messages;

  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,height:"100dvh",zIndex:2000,background:T.bg,display:"flex",flexDirection:"column",animation:"fadeIn .25s ease"}}>
    {/* Header — chat view */}
    {view==="chat"&&<div style={{padding:"calc(14px + env(safe-area-inset-top)) 18px 14px",background:T.headerBg,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10,backdropFilter:"blur(20px)"}}>
      <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px ${T.accentGlow}`}}><Brain size={20} color="#000"/></div>
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontSize:15,fontWeight:800,color:T.text,lineHeight:1.1}}>Bitelyze Coach</p>
        <p style={{fontSize:11,color:T.accent,fontWeight:600,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:T.accent,display:"inline-block",boxShadow:`0 0 6px ${T.accent}`}}/>{t?t("coach.online"):"Online"}</p>
      </div>
      <button onClick={()=>setView("history")} title={t?t("coach.history"):"Chat history"} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.muted,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><Clock size={18}/></button>
      <button onClick={handleClose} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.muted,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><X size={18}/></button>
    </div>}

    {/* Header — history & session views */}
    {(view==="history"||view==="session")&&<div style={{padding:"calc(14px + env(safe-area-inset-top)) 18px 14px",background:T.headerBg,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10,backdropFilter:"blur(20px)"}}>
      <button onClick={()=>{if(view==="session"){setView("history");setViewingIdx(null);}else{setView("chat");}}} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.muted,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><ArrowLeft size={18}/></button>
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontSize:15,fontWeight:800,color:T.text,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{view==="history"?(t?t("coach.history"):"Chat History"):(viewingIdx!==null&&sessions[viewingIdx]?formatSessionDate(sessions[viewingIdx].startedAt):"Session")}</p>
        {view==="history"&&<p style={{fontSize:11,color:T.muted,fontWeight:500,marginTop:2}}>{sessions.length} past chat{sessions.length===1?"":"s"}</p>}
      </div>
      <button onClick={handleClose} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.muted,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><X size={18}/></button>
    </div>}

    {/* Body — chat or session messages */}
    {(view==="chat"||view==="session")&&<div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
      {shownMessages.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeIn .3s ease"}}>
        <div style={{maxWidth:"80%",padding:"11px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?T.accent:T.card,border:m.role==="user"?"none":`1px solid ${T.border}`,color:m.role==="user"?"#000":T.text,fontSize:13.5,lineHeight:1.55,fontWeight:m.role==="user"?600:500,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{m.content}</div>
      </div>))}
      {sending&&view==="chat"&&<div style={{display:"flex",justifyContent:"flex-start"}}>
        <div style={{padding:"12px 16px",borderRadius:"16px 16px 16px 4px",background:T.card,border:`1px solid ${T.border}`,display:"flex",gap:4,alignItems:"center"}}>
          {[0,1,2].map(i=>(<span key={i} style={{width:6,height:6,borderRadius:"50%",background:T.accent,display:"inline-block",animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>))}
        </div>
      </div>}
      {err&&view==="chat"&&<p style={{textAlign:"center",fontSize:12,color:T.danger,padding:"10px"}}>{err}</p>}
    </div>}

    {/* Body — history list */}
    {view==="history"&&<div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
      {sessions.length===0?<div style={{textAlign:"center",padding:"60px 20px",color:T.muted}}>
        <div style={{display:"inline-flex",marginBottom:14,opacity:0.4}}><Clock size={36}/></div>
        <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>No past chats yet</p>
        <p style={{fontSize:12,lineHeight:1.5,maxWidth:260,margin:"0 auto"}}>Your conversations will be saved here when you close the coach.</p>
      </div>:sessions.map((s,i)=>(<div key={s.id} onClick={()=>{setViewingIdx(i);setView("session");}} className="ripple" style={{padding:"14px 16px",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,cursor:"pointer",transition:"all .15s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,gap:8}}>
          <p style={{fontSize:11,color:T.muted,fontWeight:600}}>{formatSessionDate(s.startedAt)}</p>
          <button onClick={e=>{e.stopPropagation();deleteSession(i);}} title="Delete chat" style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4,display:"flex",borderRadius:6}}><Trash2 size={14}/></button>
        </div>
        <p style={{fontSize:13,color:T.text,fontWeight:500,lineHeight:1.45,marginBottom:5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{getPreview(s)}</p>
        <p style={{fontSize:11,color:T.muted}}>{s.messages.length} message{s.messages.length===1?"":"s"}</p>
      </div>))}
    </div>}

    {/* Quick action chips — only in chat view */}
    {view==="chat"&&input.trim()===""&&messages.filter(m=>m.role==="user").length<2&&<div style={{padding:"4px 14px 0",background:T.card,display:"flex",gap:7,overflowX:"auto",scrollbarWidth:"none",flexShrink:0}}>
      {["What should I eat?","Can I have pizza tonight?","How am I doing this week?","I need motivation"].map(q=>(
        <button key={q} onClick={()=>setInput(q)} style={{padding:"7px 12px",borderRadius:99,border:`1px solid ${T.border}`,background:T.inputBg,color:T.muted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{q}</button>
      ))}
    </div>}

    {/* Input — only in chat view */}
    {view==="chat"&&<div style={{padding:"12px 14px calc(12px + env(safe-area-inset-bottom))",borderTop:`1px solid ${T.border}`,background:T.card,display:"flex",gap:8,alignItems:"flex-end",flexShrink:0}}>
      <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder={t?t("coach.placeholder"):"Ask your coach anything..."} rows={1} style={{flex:1,padding:"11px 14px",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:14,color:T.text,fontSize:16,outline:"none",fontFamily:"inherit",resize:"none",maxHeight:100,lineHeight:1.4}}/>
      <button onClick={send} disabled={!input.trim()||sending} style={{width:44,height:44,borderRadius:12,border:"none",background:input.trim()&&!sending?T.accent:T.inputBg,color:input.trim()&&!sending?"#000":T.muted,cursor:input.trim()&&!sending?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",flexShrink:0}}><Send size={18}/></button>
    </div>}
  </div>);
}

function TrackerApp({profile,goal,uid,onEditProfile,onSignOut,theme,toggleTheme,lang,setLang,t}){
  const[tab,setTab]=useState("analyze");
  const[coachOpen,setCoachOpen]=useState(false);
  const[moreView,setMoreView]=useState(null);// null=menu, "profile"|"appearance"|"homescreen"|"weeklywrap"|"notifications"|"language"
  const[notifOpen,setNotifOpen]=useState(false);
  const[showTour,setShowTour]=useState(()=>{try{return!localStorage.getItem(`bitelyze_tour_v1_${uid}`);}catch(e){return false;}});
  const[condensedStepIdx,setCondensedStepIdx]=useState(null);// null=closed, 0..N=current question, "done"=success
  const[reminderDismissed,setReminderDismissed]=useState(()=>{
    try{
      const raw=localStorage.getItem(`bitelyze_skip_reminder_${uid}`);
      if(!raw)return false;
      const d=JSON.parse(raw);
      if(d.count>=3)return true;
      if(d.lastDismissed&&(Date.now()-d.lastDismissed)<7*24*60*60*1000)return true;
      return false;
    }catch(e){return false;}
  });
  const[image,setImage]=useState(null);
  const[imgB64,setImgB64]=useState(null);
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const[error,setError]=useState(null);
  const[textFood,setTextFood]=useState("");
  const[isRecording,setIsRecording]=useState(false);
  const[voiceSupported]=useState(()=>typeof window!=="undefined"&&!!(window.SpeechRecognition||window.webkitSpeechRecognition));
  const[voiceHintShown,setVoiceHintShown]=useState(()=>{try{return!!localStorage.getItem("bitelyze_voice_hint_shown");}catch(e){return false;}});
  const recognitionRef=useRef(null);
  const[showShareCard,setShowShareCard]=useState(false);
  const[notifBannerDismissed,setNotifBannerDismissed]=useState(()=>{try{return!!localStorage.getItem(`bitelyze_notif_banner_dismissed_${uid}`);}catch(e){return false;}});
  const[notifPermission,setNotifPermission]=useState(()=>typeof Notification!=="undefined"?Notification.permission:"default");
  const[allHistory,setAllHistory]=useState([]);
  const[remaining,setRemaining]=useState(()=>getRemainingAnalyses(uid));
  const[waterByDate,setWaterByDate]=useState({});
  const[selectedLogDate,setSelectedLogDate]=useState(()=>todayYMD());
  const[pendingLogDate,setPendingLogDate]=useState(null);
  const[showDatePicker,setShowDatePicker]=useState(false);
  const[calendarMonth,setCalendarMonth]=useState(()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1);});
  const[progressRange,setProgressRange]=useState("7d");
  const[rangeDropdownOpen,setRangeDropdownOpen]=useState(false);
  const[chartTooltipIdx,setChartTooltipIdx]=useState(null);
  const[showMealDetail,setShowMealDetail]=useState(null);// name string
  const[animKey,setAnimKey]=useState(0);
  const[stats,setStats]=useState({streak:0,totalMeals:0,waterGoalHits:0,daysUnderGoal:0,earlyBreakfast:0});
  // water = today's water (derived). For backward compat — rest of code reads/writes today's entry.
  const today=todayYMD();
  const water=waterByDate[today]||0;
  const setWater=(v)=>{setWaterByDate(prev=>{const newVal=typeof v==="function"?v(prev[today]||0):v;return{...prev,[today]:newVal};});};
  // Derive consumed and mealLog from allHistory (filtered to today) — single source of truth
  const mealLog=useMemo(()=>{
    return allHistory.filter(m=>{
      const d=m.date||(m.timestamp?new Date(m.timestamp).toISOString().slice(0,10):today);
      return d===today;
    }).sort((a,b)=>{
      const ta=a.timestamp?new Date(a.timestamp).getTime():0;
      const tb=b.timestamp?new Date(b.timestamp).getTime():0;
      return ta-tb;
    });
  },[allHistory,today]);
  const consumed=useMemo(()=>mealLog.reduce((s,m)=>s+(Number(m.totalCalories)||0),0),[mealLog]);
  const[saving,setSaving]=useState(false);
  const[recentDays,setRecentDays]=useState({});
  const recentDaysRef=useRef({});
  useEffect(()=>{
    recentDaysRef.current=recentDays;
  },[recentDays]);

  // Streak derived from allHistory — single source of truth, runs on every history change
  useEffect(()=>{
    const realStreak=calcStreakFromHistory(allHistory);
    setStats(s=>s.streak!==realStreak?{...s,streak:realStreak}:s);
  },[allHistory]);
  const[toast,setToast]=useState(null);
  const[tipCardIdx,setTipCardIdx]=useState(0);
  const[placeholderIdx,setPlaceholderIdx]=useState(0);
  const[showClarifier,setShowClarifier]=useState(false);
  const[clarifyFood,setClarifyFood]=useState('');
  const[selectedPortion,setSelectedPortion]=useState(null);
  const[customPortion,setCustomPortion]=useState('');
  const[clarifiedFoods,setClarifiedFoods]=useState(new Set());
  const[parseError,setParseError]=useState(false);
  const[portionFlow,setPortionFlow]=useState("initial");// "initial"|"more"|"less"|"custom"|"confirmed"
  const[portionConfirmed,setPortionConfirmed]=useState(false);
  const[showConfirmMsg,setShowConfirmMsg]=useState(false);
  const[customPct,setCustomPct]=useState(25);
  const fileRef=useRef();
  const textInputRef=useRef();
  const portionSectionRef=useRef();
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

  // ── Voice logging (Web Speech API) ──
  const startVoice=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setToast("Voice not supported in this browser");return;}
    try{
      const recognition=new SR();
      recognition.continuous=true;
      recognition.interimResults=true;
      recognition.lang='en-US';
      let baseText=textFood?textFood.trim()+' ':'';
      recognition.onresult=(e)=>{
        const transcript=Array.from(e.results).map(r=>r[0].transcript).join('');
        setTextFood(baseText+transcript);
      };
      recognition.onerror=(e)=>{
        setIsRecording(false);
        if(e.error==='not-allowed'||e.error==='service-not-allowed')setToast("Mic permission denied");
        else if(e.error==='no-speech')setToast("No speech detected");
        else if(e.error!=='aborted')setToast("Voice error — try again");
      };
      recognition.onend=()=>{setIsRecording(false);};
      recognitionRef.current=recognition;
      recognition.start();
      setIsRecording(true);
      if(!voiceHintShown){
        setToast("Hold to record your meal");
        try{localStorage.setItem("bitelyze_voice_hint_shown","1");}catch(e){}
        setVoiceHintShown(true);
      }
    }catch(err){setIsRecording(false);setToast("Voice unavailable");}
  };
  const stopVoice=()=>{
    try{recognitionRef.current&&recognitionRef.current.stop();}catch(e){}
    setIsRecording(false);
  };

  // ── Service worker registration (once on mount) ──
  useEffect(()=>{
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').catch(()=>{});
    }
  },[]);

  // ── Weekly Wrap-Up: auto-open on Sunday once per week ──
  useEffect(()=>{
    if(!uid)return;
    const now=new Date();
    if(now.getDay()!==0)return;// 0 = Sunday
    const sundayKey=ymdLocal(now);
    const lastShownKey=`bitelyze_last_wrap_shown_${uid}`;
    try{
      const lastShown=localStorage.getItem(lastShownKey);
      if(lastShown===sundayKey)return;
      // Only auto-show if user has at least a few days of data
      if(!allHistory||allHistory.length<3)return;
      setTab("me");
      setMoreView("weeklywrap");
      localStorage.setItem(lastShownKey,sundayKey);
    }catch(e){}
  },[uid,allHistory.length]);

  // ── Client-side notification scheduler: checks on app open ──
  useEffect(()=>{
    if(typeof Notification==="undefined")return;
    if(Notification.permission!=='granted')return;
    if(localStorage.getItem('bitelyze_notif_enabled')!=='1')return;
    try{
      const now=new Date();
      const hour=now.getHours();
      const todayStr=ymdLocal(now);
      const reminderKey=`bitelyze_last_reminder_${todayStr}`;
      const lastReminder=localStorage.getItem(reminderKey);
      const icon='/logo.svg';
      // Morning nudge (8-10am) if no meals today
      if(hour>=8&&hour<11&&consumed===0&&lastReminder!=='morning'){
        new Notification('Good morning!',{body:'Start your day right — log your breakfast',icon});
        localStorage.setItem(reminderKey,'morning');
      }
      // Dinner nudge (6-9pm) if no dinner logged
      else if(hour>=18&&hour<21&&lastReminder!=='dinner'){
        const hasDinner=mealLog.some(m=>m.time&&parseInt(m.time)>=17);
        if(!hasDinner){
          const left=Math.max(0,goal-consumed);
          new Notification('Dinner logged?',{body:`${left} kcal left for today`,icon});
          localStorage.setItem(reminderKey,'dinner');
        }
      }
      // Streak rescue (9-11pm) if streak > 0 and no meals today
      else if(hour>=21&&hour<23&&stats.streak>0&&consumed===0&&lastReminder!=='streak'){
        new Notification(`Don't break your ${stats.streak}-day streak`,{body:'Log anything from today to keep the flame alive',icon});
        localStorage.setItem(reminderKey,'streak');
      }
    }catch(e){}
    // Runs once on mount — reminders are idempotent per (day, slot)
  },[]);

  // ── Request notification permission ──
  const requestNotifPermission=async()=>{
    if(typeof Notification==="undefined"){setToast("Notifications not supported");return;}
    try{
      const result=await Notification.requestPermission();
      setNotifPermission(result);
      if(result==='granted'){
        try{localStorage.setItem('bitelyze_notif_enabled','1');}catch(e){}
        setToast("Notifications enabled");
        try{new Notification('Bitelyze',{body:"You're all set — we'll send gentle reminders",icon:'/logo.svg'});}catch(e){}
      }else if(result==='denied'){
        setToast("Blocked — enable in browser settings");
      }
    }catch(e){setToast("Could not enable notifications");}
  };
  const dismissNotifBanner=()=>{
    try{localStorage.setItem(`bitelyze_notif_banner_dismissed_${uid}`,"1");}catch(e){}
    setNotifBannerDismissed(true);
  };
  const toggleNotifEnabled=()=>{
    const enabled=localStorage.getItem('bitelyze_notif_enabled')==='1';
    if(enabled){
      try{localStorage.setItem('bitelyze_notif_enabled','0');}catch(e){}
      setToast("Reminders paused");
    }else{
      if(notifPermission==='granted'){
        try{localStorage.setItem('bitelyze_notif_enabled','1');}catch(e){}
        setToast("Reminders resumed");
      }else{
        requestNotifPermission();
      }
    }
    // Force re-render
    setNotifPermission(p=>p);
  };

  // ── Weekly wrap computation (last 7 days from allHistory) ──
  const weeklyWrap=useMemo(()=>{
    const now=new Date();
    const endYmd=ymdLocal(now);
    const startDate=new Date();startDate.setDate(startDate.getDate()-6);
    const startYmd=ymdLocal(startDate);
    const weekMeals=(allHistory||[]).filter(m=>{
      const d=m.date||(m.timestamp?ymdLocal(new Date(m.timestamp)):null);
      return d&&d>=startYmd&&d<=endYmd;
    });
    // Group by date
    const byDate={};
    for(let i=0;i<7;i++){
      const d=new Date();d.setDate(d.getDate()-6+i);
      byDate[ymdLocal(d)]={cal:0,protein:0,carbs:0,fat:0,fiber:0,meals:[],healthScores:[]};
    }
    weekMeals.forEach(m=>{
      const d=m.date||(m.timestamp?ymdLocal(new Date(m.timestamp)):null);
      if(!byDate[d])return;
      byDate[d].cal+=Number(m.totalCalories)||0;
      byDate[d].protein+=Number(m.protein)||0;
      byDate[d].carbs+=Number(m.carbs)||0;
      byDate[d].fat+=Number(m.fat)||0;
      byDate[d].fiber+=Number(m.fiber)||0;
      byDate[d].meals.push(m);
      if(m.healthScore)byDate[d].healthScores.push(m.healthScore);
    });
    const days=Object.entries(byDate).map(([date,v])=>({date,...v,avgScore:v.healthScores.length?v.healthScores.reduce((a,b)=>a+b,0)/v.healthScores.length:0}));
    const daysWithData=days.filter(d=>d.cal>0);
    const avgCal=daysWithData.length?Math.round(daysWithData.reduce((s,d)=>s+d.cal,0)/daysWithData.length):0;
    const onTarget=days.filter(d=>d.cal>0&&d.cal>=goal*0.8&&d.cal<=goal*1.1).length;
    // Best day — closest to goal with highest avg health score
    const bestDay=daysWithData.slice().sort((a,b)=>{
      const aScore=(a.avgScore||0)*10-Math.abs(a.cal-goal)/100;
      const bScore=(b.avgScore||0)*10-Math.abs(b.cal-goal)/100;
      return bScore-aScore;
    })[0]||null;
    // Top meals
    const counts={};
    weekMeals.forEach(m=>{const k=m.foodName||"Unknown";if(!counts[k])counts[k]={count:0,total:0};counts[k].count++;counts[k].total+=(m.totalCalories||0);});
    const topMeals=Object.entries(counts).map(([name,v])=>({name,count:v.count,avg:Math.round(v.total/v.count)})).sort((a,b)=>b.count-a.count).slice(0,3);
    const allScores=weekMeals.map(m=>m.healthScore||0).filter(s=>s>0);
    const avgHealthScore=allScores.length?(allScores.reduce((a,b)=>a+b,0)/allScores.length).toFixed(1):"—";
    // Range label
    const rangeLabel=`${startDate.toLocaleDateString("en",{month:"short",day:"numeric"})} - ${now.toLocaleDateString("en",{month:"short",day:"numeric"})}`;
    return{startDate,endDate:now,rangeLabel,weekMeals,days,daysWithData,avgCal,onTarget,bestDay,topMeals,avgHealthScore,totalProtein:Math.round(weekMeals.reduce((s,m)=>s+(m.protein||0),0)),totalCarbs:Math.round(weekMeals.reduce((s,m)=>s+(m.carbs||0),0)),totalFat:Math.round(weekMeals.reduce((s,m)=>s+(m.fat||0),0)),totalFiber:Math.round(weekMeals.reduce((s,m)=>s+(m.fiber||0),0))};
  },[allHistory,goal]);

  // ── Share weekly summary ──
  const shareWeek=async()=>{
    const w=weeklyWrap;
    const text=`🎯 My week with Bitelyze:\n🔥 ${stats.streak} day streak\n📊 ${w.avgCal} kcal avg/day\n⭐ ${w.avgHealthScore}/10 avg health score\n✅ ${w.onTarget}/7 days on target\n\nTrack yours at bitelyze.com`;
    if(navigator.share){
      try{await navigator.share({title:"My week with Bitelyze",text,url:"https://bitelyze.com"});return;}catch(e){if(e.name==="AbortError")return;}
    }
    try{await navigator.clipboard.writeText(text);setToast("Copied to clipboard — paste anywhere");}
    catch(e){setToast("Copy failed");}
  };

  useEffect(()=>{if(!uid)return;
    // Phase 1 — INSTANT load from localStorage (sync, no network wait)
    const fallbackDate=todayYMD();
    const localHistory=LS.get(`history_${uid}`)||[];
    const localTodayData=LS.get(`day_${uid}_${fallbackDate}`);
    const localStats=LS.get(`stats_${uid}`);
    const localDays=loadRecentDaysLocal(uid,14);
    const waterMap={};
    if(localTodayData)waterMap[fallbackDate]=localTodayData.water||0;
    Object.entries(localDays).forEach(([k,v])=>{if(v&&typeof v.water==="number")waterMap[k]=v.water;});
    setWaterByDate(waterMap);
    let migrationHappened=false;
    const migratedLocal=localHistory.map(m=>{
      if(!m.date){migrationHappened=true;return{...m,date:m.timestamp?ymd(new Date(m.timestamp)):fallbackDate};}
      return m;
    });
    setAllHistory(migratedLocal);
    setRecentDays(localDays);
    if(localStats)setStats({...localStats,streak:calcStreak(localDays)});
    else setStats(s=>({...s,streak:calcStreak(localDays)}));

    // Phase 2 — BACKGROUND refresh from Firestore (won't block UI)
    (async()=>{
      try{
        const[todayData,history,savedStats,days]=await Promise.all([loadTodayData(uid),loadHistory(uid),loadStats(uid),loadRecentDays(uid,14)]);
        const wm={};
        if(todayData)wm[fallbackDate]=todayData.water||0;
        if(days)Object.entries(days).forEach(([k,v])=>{if(v&&typeof v.water==="number")wm[k]=v.water;});
        setWaterByDate(wm);
        const migrated=(history||[]).map(m=>{
          if(!m.date){migrationHappened=true;return{...m,date:m.timestamp?ymd(new Date(m.timestamp)):fallbackDate};}
          return m;
        });
        setAllHistory(migrated);
        if(migrationHappened&&!localStorage.getItem('bitelyze_migration_v1')){
          setToast("Some older meals had missing dates and were assumed to be today");
          try{localStorage.setItem('bitelyze_migration_v1','1');}catch(e){}
        }
        setRecentDays(days);
        const realStreak=calcStreak(days);
        if(savedStats)setStats({...savedStats,streak:realStreak});
        else setStats(s=>({...s,streak:realStreak}));
      }catch(e){}
    })();
  },[uid]);

  useEffect(()=>{if(!uid)return;const t=setTimeout(async()=>{setSaving(true);await saveTodayData(uid,{consumed,meals:mealLog,water});
    // Use ref to get latest recentDays (state might be stale in setTimeout closure)
    const todayKey=new Date().toISOString().split("T")[0];
    const updatedDays={...recentDaysRef.current,[todayKey]:{consumed,meals:mealLog,water}};
    setRecentDays(updatedDays);
    const realStreak=calcStreak(updatedDays);
    const newStats={...stats,streak:realStreak,totalMeals:allHistory.length,waterGoalHits:water>=8?Math.max(stats.waterGoalHits,1):stats.waterGoalHits,daysUnderGoal:consumed>0&&consumed<=goal?Math.max(stats.daysUnderGoal,1):stats.daysUnderGoal,earlyBreakfast:mealLog.some(m=>parseInt(m.time)<9)?Math.max(stats.earlyBreakfast,1):stats.earlyBreakfast};
    await saveStats(uid,newStats);setStats(newStats);setSaving(false);
  },1500);return()=>clearTimeout(t);},[consumed,mealLog,water]);

  // Build real 7-day chart — inject today's live consumed value
  const weekData=(()=>{const wd=buildWeekData(recentDays);const todayKey=new Date().toISOString().split("T")[0];return wd.map(d=>d.isToday?{...d,cal:consumed}:d);})();
  const rem=goal-consumed;
  const hc=result?(result.healthScore>=7?T.accent:result.healthScore>=4?T.orange:T.danger):T.accent;

  // Delete a logged meal (by id from allHistory). Also updates today's consumed/mealLog if applicable.
  const deleteMeal=async(entry)=>{
    if(!entry)return;
    setAllHistory(h=>h.filter(m=>m.id!==entry.id));
    // Persist history to Firestore: rewrite the whole array
    if(uid){
      try{
        const newHist=(await loadHistory(uid)).filter(m=>m.id!==entry.id);
        LS.set(`history_${uid}`,newHist);
        await setDoc(doc(db,"users",uid,"data","history"),{meals:newHist},{merge:false});
      }catch(e){}
    }
    setToast("Meal removed");
  };

  // ── Progress analytics (memoized) ──
  const{start:rangeStart,end:rangeEnd}=useMemo(()=>getRange(progressRange),[progressRange]);
  const rangeMeals=useMemo(()=>allHistory.filter(m=>{try{const d=new Date(m.timestamp||(m.date+"T12:00:00"));return d>=rangeStart&&d<=rangeEnd;}catch(e){return false;}}),[allHistory,rangeStart,rangeEnd]);
  // Group by date (YYYY-MM-DD → { cal, protein, carbs, fat, fiber, meals: [] })
  const byDate={};
  rangeMeals.forEach(m=>{const k=mealDate(m);if(!byDate[k])byDate[k]={cal:0,protein:0,carbs:0,fat:0,fiber:0,meals:[],healthScore:0};byDate[k].cal+=m.totalCalories||0;byDate[k].protein+=m.protein||0;byDate[k].carbs+=m.carbs||0;byDate[k].fat+=m.fat||0;byDate[k].fiber+=m.fiber||0;byDate[k].meals.push(m);});
  // Build full daily array for range (fills missing days with 0)
  const dailyArr=(()=>{
    const arr=[];
    const s=new Date(rangeStart);s.setHours(0,0,0,0);
    const e=new Date(rangeEnd);e.setHours(0,0,0,0);
    for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){
      const k=ymd(d);
      const bd=byDate[k];
      arr.push({date:k,calories:bd?bd.cal:0,hasData:!!bd,weekday:d.getDay()});
    }
    return arr;
  })();
  const daysWithData=dailyArr.filter(d=>d.hasData).length;
  // Previous period comparison
  const prevCalories=(()=>{
    if(progressRange==="lifetime")return null;
    const spanMs=rangeEnd.getTime()-rangeStart.getTime();
    const prevEnd=new Date(rangeStart.getTime()-1);
    const prevStart=new Date(rangeStart.getTime()-spanMs-1);
    const prev=allHistory.filter(m=>{try{const d=new Date(m.timestamp||(m.date+"T12:00:00"));return d>=prevStart&&d<=prevEnd;}catch(e){return false;}});
    return prev.reduce((s,m)=>s+(m.totalCalories||0),0);
  })();
  const totalCal=dailyArr.reduce((s,d)=>s+d.calories,0);
  const avgCal=daysWithData>0?Math.round(totalCal/daysWithData):0;
  const highestDay=dailyArr.filter(d=>d.hasData).reduce((a,b)=>b.calories>(a?.calories||0)?b:a,null);
  const lowestDay=dailyArr.filter(d=>d.hasData).reduce((a,b)=>(a===null||b.calories<a.calories)?b:a,null);
  const pctChange=(prevCalories!==null&&prevCalories>0)?Math.round(((totalCal-prevCalories)/prevCalories)*100):null;
  // Aggregate totals
  const totalProtein=rangeMeals.reduce((s,m)=>s+(m.protein||0),0);
  const totalCarbs=rangeMeals.reduce((s,m)=>s+(m.carbs||0),0);
  const totalFat=rangeMeals.reduce((s,m)=>s+(m.fat||0),0);
  const totalFiber=rangeMeals.reduce((s,m)=>s+(m.fiber||0),0);
  // Decide bar granularity
  const barMode=(()=>{
    if(progressRange==="7d"||progressRange==="30d")return"daily";
    if(progressRange==="thisMonth"||progressRange==="lastMonth"||progressRange==="3m"||progressRange==="6m"){
      return dailyArr.length>30?"weekly":"daily";
    }
    return"monthly";
  })();
  const aggregatedBars=(()=>{
    if(barMode==="daily")return dailyArr.map(d=>({label:(()=>{const dt=parseYMD(d.date);return dt.toLocaleDateString("en",{month:"short",day:"numeric"});})(),shortLabel:(()=>{const dt=parseYMD(d.date);return String(dt.getDate());})(),value:d.calories,hasData:d.hasData,date:d.date}));
    if(barMode==="weekly"){
      const weeks=[];let current=null;
      dailyArr.forEach((d,idx)=>{
        if(!current||idx%7===0){if(current)weeks.push(current);current={total:0,count:0,hasData:false,startDate:d.date,endDate:d.date};}
        current.total+=d.calories;
        if(d.hasData){current.count++;current.hasData=true;}
        current.endDate=d.date;
      });
      if(current)weeks.push(current);
      return weeks.map(w=>({label:(()=>{const dt=parseYMD(w.startDate);return dt.toLocaleDateString("en",{month:"short",day:"numeric"});})(),shortLabel:(()=>{const dt=parseYMD(w.startDate);return dt.toLocaleDateString("en",{month:"short",day:"numeric"});})(),value:w.count>0?Math.round(w.total/w.count):0,hasData:w.hasData,date:w.startDate}));
    }
    // monthly
    const months={};
    dailyArr.forEach(d=>{const k=d.date.slice(0,7);if(!months[k])months[k]={total:0,count:0,hasData:false};months[k].total+=d.calories;if(d.hasData){months[k].count++;months[k].hasData=true;}});
    return Object.entries(months).map(([k,v])=>{const[y,m]=k.split('-').map(Number);const dt=new Date(y,m-1,1);return{label:dt.toLocaleDateString("en",{month:"short",year:"2-digit"}),shortLabel:dt.toLocaleDateString("en",{month:"short"}),value:v.count>0?Math.round(v.total/v.count):0,hasData:v.hasData,date:k+"-01"};});
  })();
  // Most logged meals (top 5)
  const mealFreq=(()=>{
    const counts={};
    rangeMeals.forEach(m=>{const k=m.foodName||"Unknown";if(!counts[k])counts[k]={count:0,total:0,meals:[]};counts[k].count++;counts[k].total+=(m.totalCalories||0);counts[k].meals.push(m);});
    return Object.entries(counts).map(([name,v])=>({name,count:v.count,avgKcal:Math.round(v.total/v.count),meals:v.meals})).sort((a,b)=>b.count-a.count).slice(0,5);
  })();
  // Weekday patterns (only if range >= 14 days)
  const weekdayAvg=(()=>{
    if(dailyArr.length<14)return null;
    const buckets=[[],[],[],[],[],[],[]];// Sun-Sat
    dailyArr.forEach(d=>{if(d.hasData)buckets[d.weekday].push(d.calories);});
    return buckets.map((vals,i)=>({idx:i,label:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][i],avg:vals.length>0?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0,hasData:vals.length>0}));
  })();
  // Insights
  const insights=(()=>{
    const out=[];
    if(highestDay){const dt=parseYMD(highestDay.date);out.push({icon:<TrendingUp size={16} color={T.accent}/>,text:`Your highest day was ${dt.toLocaleDateString("en",{weekday:"long"})} (${highestDay.calories} kcal)`});}
    const underCount=dailyArr.filter(d=>d.hasData&&d.calories<=goal).length;
    if(daysWithData>0)out.push({icon:<Target size={16} color={T.orange}/>,text:`You stayed under goal ${underCount} out of ${daysWithData} days`});
    if(daysWithData>0){
      const proteinTarget=Math.round(goal*0.3/4);// per day
      const avgProtein=Math.round(totalProtein/daysWithData);
      const pct=proteinTarget>0?Math.round((avgProtein/proteinTarget)*100):100;
      if(pct<85)out.push({icon:<Dumbbell size={16} color={T.blue}/>,text:`Your protein is ${100-pct}% below your target`});
    }
    if(weekdayAvg){
      const wk=weekdayAvg.filter(d=>d.hasData&&d.idx>=1&&d.idx<=5).map(d=>d.avg);
      const we=weekdayAvg.filter(d=>d.hasData&&(d.idx===0||d.idx===6)).map(d=>d.avg);
      if(wk.length>0&&we.length>0){
        const wkAvg=wk.reduce((a,b)=>a+b,0)/wk.length;
        const weAvg=we.reduce((a,b)=>a+b,0)/we.length;
        const diff=Math.round(weAvg-wkAvg);
        if(Math.abs(diff)>wkAvg*0.1)out.push({icon:<Calendar size={16} color={T.purple}/>,text:`Weekends average ${Math.abs(diff)} kcal ${diff>0?"higher":"lower"} than weekdays`});
      }
    }
    if(stats.streak>=7)out.push({icon:<Flame size={16} color={T.orange}/>,text:`You've logged consistently for ${stats.streak} days straight`});
    if(daysWithData>0){
      const scores=rangeMeals.map(m=>m.healthScore||5);
      const avgScore=(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1);
      out.push({icon:<Sparkles size={16} color={T.accent}/>,text:`Your average health score is ${avgScore}/10`});
    }
    return out.slice(0,4);
  })();

  // Recompute daily-bar animation key when range changes
  useEffect(()=>{setAnimKey(k=>k+1);setChartTooltipIdx(null);},[progressRange]);

  // CSV export
  const exportCSV=()=>{
    const rows=[["date","time","foodName","totalCalories","protein","carbs","fat","fiber"]];
    rangeMeals.slice().sort((a,b)=>(a.timestamp||"").localeCompare(b.timestamp||"")).forEach(m=>{
      rows.push([mealDate(m),m.time||"",`"${(m.foodName||"").replace(/"/g,'""')}"`,m.totalCalories||0,m.protein||0,m.carbs||0,m.fat||0,m.fiber||0]);
    });
    const csv=rows.map(r=>r.join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`bitelyze-${progressRange}-${todayYMD()}.csv`;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),500);
    setToast("CSV exported");
  };
  const shareSummary=async()=>{
    const txt=`📊 Bitelyze · ${RANGE_LABELS[progressRange]}\n${totalCal} kcal total · avg ${avgCal}/day\n${daysWithData} days tracked · ${stats.streak}d streak`;
    if(navigator.share){try{await navigator.share({title:"My Bitelyze Progress",text:txt});}catch(e){}}
    else{try{await navigator.clipboard.writeText(txt);setToast("Summary copied to clipboard");}catch(e){setToast("Copy failed");}}
  };

  const compressImage=(file)=>new Promise((resolve)=>{const img=new Image();img.onload=()=>{const canvas=document.createElement("canvas");const MAX=1024;let w=img.width,h=img.height;if(w>MAX||h>MAX){if(w>h){h=Math.round(h*(MAX/w));w=MAX;}else{w=Math.round(w*(MAX/h));h=MAX;}}canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,w,h);const dataUrl=canvas.toDataURL("image/jpeg",0.7);resolve(dataUrl);};img.src=URL.createObjectURL(file);});
  const handleFile=async(file)=>{if(!file)return;setResult(null);setError(null);try{const dataUrl=await compressImage(file);setImage(dataUrl);setImgB64(dataUrl.split(",")[1]);}catch(e){setError("Error reading image: "+e.message);}};

  const analyze=async()=>{if(!imgB64&&!textFood)return;if(remaining<=0){setError("You've used all 5 analyses for today. Come back tomorrow for 5 more!");return;}
    if(!imgB64&&textFood&&isVagueInput(textFood)&&!clarifiedFoods.has(textFood.toLowerCase())){setClarifyFood(textFood);setSelectedPortion(null);setCustomPortion('');setShowClarifier(true);return;}
    setLoading(true);setError(null);setParseError(false);setPortionFlow("initial");setPortionConfirmed(false);setShowConfirmMsg(false);setCustomPct(25);try{
    const content=imgB64?[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgB64}},{type:"text",text:`Analyze this food image. Return ONLY valid JSON no markdown.`}]:`Analyze "${textFood}". Return ONLY valid JSON.`;
    const body={content,foodText:textFood||null,userEmail:auth.currentUser?.email||null,userProfile:{age:profile.age,gender:profile.gender,weight:profile.weight,consumed,goal}};
    const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(!res.ok){let msg="Server error ("+res.status+")";try{const err=await res.json();msg=err.error?.message||err.error||msg;}catch(e){}throw new Error(msg);}const data=await res.json();if(data.error)throw new Error(data.error.message||JSON.stringify(data.error));const txt=data.content.map(i=>i.text||"").join("");
    let parsed;try{parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());}catch(parseErr){setParseError(true);setLoading(false);incrementUsage(uid);setRemaining(getRemainingAnalyses(uid));return;}
    parsed._source=data._source||"claude";parsed.totalCalories=Math.round(Number(parsed.totalCalories)||Number(parsed.calories)||0);parsed.protein=Math.round((Number(parsed.protein)||0)*10)/10;parsed.carbs=Math.round((Number(parsed.carbs)||0)*10)/10;parsed.fat=Math.round((Number(parsed.fat)||0)*10)/10;parsed.fiber=Math.round((Number(parsed.fiber)||0)*10)/10;parsed.healthScore=Math.round(Number(parsed.healthScore)||Number(parsed.health_score)||5);parsed.foodName=parsed.foodName||parsed.food_name||parsed.name||"Unknown food";
    parsed.confidence=["high","medium","low"].includes(parsed.confidence)?parsed.confidence:"medium";
    parsed.confidenceNote=String(parsed.confidenceNote||"");
    parsed.items=Array.isArray(parsed.items)?parsed.items.map(it=>({...it,calories:Math.round(Number(it.calories)||0),protein:Math.round((Number(it.protein)||0)*10)/10,carbs:Math.round((Number(it.carbs)||0)*10)/10,fat:Math.round((Number(it.fat)||0)*10)/10})):[];
    parsed.suggestions=Array.isArray(parsed.suggestions)?parsed.suggestions:[];
    parsed.verdict=String(parsed.verdict||"");
    parsed.portionTip=String(parsed.portionTip||"");
    if(parsed.items.length===0&&parsed.totalCalories===0){setParseError(true);setLoading(false);incrementUsage(uid);setRemaining(getRemainingAnalyses(uid));return;}
    setResult(parsed);incrementUsage(uid);setRemaining(getRemainingAnalyses(uid));}catch(err){setError("Error: "+err.message);}setLoading(false);};

  const logMeal=async(meal)=>{
    const m=meal||result;if(!m)return;
    // Decide timestamp / date — honor pendingLogDate if set
    const now=new Date();
    let stampDate,dateStr,timeStr;
    if(pendingLogDate&&pendingLogDate!==todayYMD()){
      const past=new Date(pendingLogDate+"T12:00:00");
      stampDate=past;
      dateStr=pendingLogDate;
      timeStr=past.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    } else {
      stampDate=now;
      dateStr=todayYMD();
      timeStr=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    }
    const entry={
      ...m,
      id:`${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      timestamp:stampDate.toISOString(),
      date:dateStr,
      time:timeStr,
      foodName:m.foodName,
      totalCalories:m.totalCalories,
      protein:m.protein||0,
      carbs:m.carbs||0,
      fat:m.fat||0,
      fiber:m.fiber||0,
      healthScore:m.healthScore||5,
      items:m.items||[]
    };
    setAllHistory(h=>[...h,entry]);
    if(uid)await addMealToHistory(uid,entry);
    if(pendingLogDate&&pendingLogDate!==todayYMD()){
      setToast("🍽️ "+m.foodName+" logged for "+formatDateLabel(dateStr));
      setSelectedLogDate(dateStr);
      setTab("log");
    } else {
      setToast("🍽️ "+m.foodName+" logged!");
    }
    setPendingLogDate(null);
    if(!meal){setResult(null);setImage(null);setImgB64(null);setTextFood("");setPortionFlow("initial");setPortionConfirmed(false);setShowConfirmMsg(false);setParseError(false);}
  };

  const coachMsg=()=>{const pct=Math.round((consumed/goal)*100);if(consumed===0)return{msg:coachGreeting(profile.name),color:T.accent};if(pct<50)return{msg:`You've had ${consumed} kcal so far. ${goal-consumed} more to go today.`,color:T.blue};if(pct<90)return{msg:`Almost at your goal! Just ${goal-consumed} kcal left. Keep it up! 💪`,color:T.orange};if(pct<=105)return{msg:`Goal reached! Great discipline today, ${profile.name}. 🌙`,color:T.accent};return{msg:`You're ${consumed-goal} kcal over today. Go easy on the next meal.`,color:T.danger};};
  const cm=coachMsg();
  // Smart coach insights from actual data
  const smartInsights=useMemo(()=>computeSmartCoach({allHistory,recentDays,goal,profile,consumed,todayMeals:mealLog}),[allHistory,recentDays,goal,profile.name,consumed,mealLog]);
  // Notifications — generated from recent activity, achievements, patterns
  const notifications=useMemo(()=>{
    const list=[];
    const now=Date.now();
    // Streak milestones
    if(stats.streak>=7)list.push({id:"streak7",icon:<Flame size={18} color={T.orange}/>,title:"Week Warrior",msg:`You've logged ${stats.streak} days in a row. Incredible consistency!`,time:"Today"});
    else if(stats.streak>=3)list.push({id:"streak3",icon:<Flame size={18} color={T.orange}/>,title:"Building a habit",msg:`${stats.streak} days in a row — you're on your way!`,time:"Today"});
    // Badge unlocks (from live badge stats later — simplified here)
    if(allHistory.length===1)list.push({id:"first_meal",icon:<UtensilsCrossed size={18} color={T.accent}/>,title:"First Bite 🎉",msg:"You logged your first meal. Welcome aboard!",time:"Today"});
    else if(allHistory.length===10)list.push({id:"meals10",icon:<Trophy size={18} color={T.purple}/>,title:"10 Meals Logged",msg:"You've tracked 10 meals. Keep it up!",time:"Today"});
    // Today's progress
    if(consumed>0&&consumed>=goal*0.9&&consumed<=goal*1.05)list.push({id:"near_goal",icon:<Target size={18} color={T.accent}/>,title:"On target today",msg:`You've hit ${Math.round((consumed/goal)*100)}% of your goal. Nice pacing!`,time:"Today"});
    // Coach tip of the day
    if(consumed===0&&new Date().getHours()>=10)list.push({id:"log_nudge",icon:<Lightbulb size={18} color={T.accent}/>,title:"Log your first meal",msg:"Even a small breakfast now sets the tone for the whole day.",time:"Today"});
    return list;
  },[stats.streak,allHistory.length,consumed,goal]);

  // Live badge stats — derived from real data so badges unlock immediately
  const liveBadgeStats=useMemo(()=>{
    const daysUnderGoal=Object.values(recentDays||{}).filter(d=>d&&d.consumed>0&&d.consumed<=goal).length;
    const waterGoalHits=Object.values(waterByDate).filter(w=>w>=8).length;
    const earlyBreakfast=allHistory.filter(m=>{
      if(!m.timestamp)return false;
      const h=new Date(m.timestamp).getHours();
      return h<9;
    }).length;
    return {
      totalMeals:allHistory.length,
      streak:stats.streak||0,
      waterGoalHits:Math.max(waterGoalHits,stats.waterGoalHits||0),
      daysUnderGoal:Math.max(daysUnderGoal,stats.daysUnderGoal||0),
      earlyBreakfast:Math.max(earlyBreakfast,stats.earlyBreakfast||0)
    };
  },[allHistory,waterByDate,recentDays,goal,stats]);
  const earned=BADGES.filter(b=>b.check(liveBadgeStats));
  const locked=BADGES.filter(b=>!b.check(liveBadgeStats));

  const pct=Math.round(Math.min((consumed/goal)*100,100));
  const ringR=70;const ringC=2*Math.PI*ringR;
  const ringColor=pct<75?T.accent:pct<100?T.orange:T.danger;

  // Active tab indicator position
  const tabKeys=["analyze","log","progress","me"];
  const activeTabIdx=tabKeys.indexOf(tab);

  // Result card helpers
  const verdictText=result?(result.verdict||(result.totalCalories>600?"This is a calorie-dense meal. Consider pairing with lighter meals for the rest of the day.":result.healthScore>=7?"A well-balanced meal with good nutritional value. Keep it up!":"A decent choice. Try adding more vegetables or protein to boost nutrition.")):null;
  const remainingAfter=result?(goal-consumed-result.totalCalories):0;

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",color:T.text,transition:"background .3s ease, color .3s ease"}}>
    {/* ── Product Tour (shown only once) ── */}
    {showTour&&<DashboardTour name={profile.name} onDone={()=>{try{localStorage.setItem(`bitelyze_tour_v1_${uid}`,"1");}catch(e){}setShowTour(false);}}/>}

    {/* ── Condensed Profile Completion Flow ── */}
    {condensedStepIdx!==null&&(()=>{
      const skipped=["blockers","habits","planningHabit","motivation"].filter(k=>profile[k]===null);
      if(skipped.length===0||condensedStepIdx==="done")return(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"22px"}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:22,padding:"32px 26px",maxWidth:360,width:"100%",textAlign:"center",animation:"pop .4s ease"}}>
            <div style={{fontSize:48,marginBottom:14}}>🎉</div>
            <h2 style={{fontSize:22,fontWeight:900,color:T.text,marginBottom:10}}>Profile complete!</h2>
            <p style={{fontSize:14,color:T.muted,lineHeight:1.6,marginBottom:22}}>Your coach just got smarter.</p>
            <button onClick={()=>setCondensedStepIdx(null)} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:T.accent,color:"#000",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6}}>Done <ArrowRight size={14}/></button>
          </div>
        </div>);
      const key=skipped[condensedStepIdx];
      const onNext=()=>{
        const newSkipped=["blockers","habits","planningHabit","motivation"].filter(k=>k!==key&&profile[k]===null);
        if(newSkipped.length===0||condensedStepIdx>=skipped.length-1){setCondensedStepIdx("done");if(uid)saveProfile(uid,profile);}
        else setCondensedStepIdx(i=>i+1);
      };
      const common={p:profile,setP:setProfile,onNext,onBack:()=>{if(condensedStepIdx>0)setCondensedStepIdx(i=>i-1);else setCondensedStepIdx(null);}};
      return(<div style={{position:"fixed",inset:0,zIndex:150,background:T.bg,overflowY:"auto"}}>
        {key==="blockers"&&<StepBlockers {...common}/>}
        {key==="habits"&&<StepHabits {...common}/>}
        {key==="planningHabit"&&<StepMealPlanning {...common}/>}
        {key==="motivation"&&<StepMotivation {...common}/>}
      </div>);
    })()}

    {/* ── Notifications Panel ── */}
    {notifOpen&&<div onClick={()=>setNotifOpen(false)} style={{position:"fixed",inset:0,zIndex:1500,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",display:"flex",justifyContent:"center",alignItems:"flex-start",paddingTop:"calc(72px + env(safe-area-inset-top))",animation:"fadeIn .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"calc(100% - 24px)",maxWidth:440,maxHeight:"70vh",background:T.card,border:`1px solid ${T.border}`,borderRadius:18,overflow:"hidden",boxShadow:`0 20px 60px rgba(0,0,0,0.4)`,animation:"slideUp .25s ease",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <p style={{fontSize:16,fontWeight:800,color:T.text,display:"flex",alignItems:"center",gap:8}}><Bell size={16} color={T.accent}/> Notifications</p>
          <button onClick={()=>setNotifOpen(false)} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",padding:0}}><X size={18}/></button>
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          {notifications.length===0?(<div style={{padding:"36px 20px",textAlign:"center"}}>
            <BellOff size={32} color={T.muted} style={{marginBottom:10,opacity:0.5}}/>
            <p style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:4}}>No new notifications</p>
            <p style={{fontSize:12,color:T.muted,lineHeight:1.5}}>Keep logging — achievements, milestones and coach nudges will show up here.</p>
          </div>):notifications.map((n,i)=>(<div key={n.id} style={{padding:"14px 18px",borderBottom:i<notifications.length-1?`1px solid ${T.border}`:"none",display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{width:36,height:36,borderRadius:12,background:`${T.accent}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3,gap:8}}>
                <p style={{fontSize:14,fontWeight:700,color:T.text}}>{n.title}</p>
                <p style={{fontSize:10,color:T.muted,flexShrink:0}}>{n.time}</p>
              </div>
              <p style={{fontSize:12.5,color:T.muted,lineHeight:1.5}}>{n.msg}</p>
            </div>
          </div>))}
        </div>
      </div>
    </div>}

    {/* ── Coach Chat ── */}
    <CoachChat open={coachOpen} onClose={()=>setCoachOpen(false)} profile={profile} goal={goal} consumed={consumed} todayMeals={mealLog} allHistory={allHistory} uid={uid} lang={lang} t={t}/>

    {/* ── Toast Notification ── */}
    {toast&&(<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${T.accent},#00b87a)`,color:"#000",padding:"12px 24px",borderRadius:16,fontSize:14,fontWeight:700,zIndex:9999,animation:"slideUp .3s ease forwards",boxShadow:`0 8px 32px ${T.accentGlow}`,maxWidth:"90%",textAlign:"center"}}>{toast}</div>)}

    {/* ── Shareable Week Card Modal ── */}
    {showShareCard&&(<>
      <div onClick={()=>setShowShareCard(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:5000,animation:"fadeIn .2s ease",backdropFilter:"blur(6px)"}}/>
      <div style={{position:"fixed",inset:0,zIndex:5001,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",pointerEvents:"none"}}>
        <div style={{maxWidth:400,width:"100%",pointerEvents:"auto",animation:"slideUp .35s cubic-bezier(0.34,1.56,0.64,1)"}}>
          {/* The shareable card */}
          <div style={{background:"linear-gradient(160deg,#0a0f1c 0%,#0f1829 50%,#0a1a1f 100%)",borderRadius:24,padding:"28px 24px",position:"relative",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,160,0.2)",aspectRatio:"9/16",display:"flex",flexDirection:"column"}}>
            {/* Mint gradient accent blob */}
            <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,229,160,0.3) 0%,transparent 70%)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",bottom:-60,left:-40,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,229,160,0.15) 0%,transparent 70%)",pointerEvents:"none"}}/>

            {/* Close button */}
            <button onClick={()=>setShowShareCard(false)} style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:"50%",width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3,fontFamily:"inherit"}}><X size={16}/></button>

            {/* Top: Logo + tagline */}
            <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <div style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#00e5a0,#00b87a)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,229,160,0.35)"}}><UtensilsCrossed size={18} color="#000"/></div>
              <span style={{fontSize:15,fontWeight:800,color:"#fff",letterSpacing:"-0.01em"}}>Bitelyze</span>
            </div>
            <p style={{position:"relative",zIndex:2,fontSize:13,color:"#9aa3b4",fontWeight:500,marginBottom:20}}>My week with Bitelyze</p>

            {/* Center big number: streak */}
            <div style={{position:"relative",zIndex:2,flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,107,53,0.15)",border:"1px solid rgba(255,107,53,0.4)",borderRadius:99,padding:"6px 14px",marginBottom:16}}>
                <Flame size={14} color="#ff6b35"/>
                <span style={{fontSize:12,fontWeight:700,color:"#ff6b35"}}>{stats.streak}-day streak</span>
              </div>
              <p style={{fontSize:64,fontWeight:900,color:"#00e5a0",letterSpacing:"-0.03em",lineHeight:1,marginBottom:8,textShadow:"0 0 40px rgba(0,229,160,0.5)"}}>{weeklyWrap.weekMeals.length}</p>
              <p style={{fontSize:15,color:"#fff",fontWeight:700,marginBottom:2}}>meals logged</p>
              <p style={{fontSize:12,color:"#9aa3b4"}}>this week</p>

              {/* Stats grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:24,width:"100%"}}>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px",textAlign:"center"}}>
                  <p style={{fontSize:18,fontWeight:900,color:"#fff",lineHeight:1}}>{weeklyWrap.avgCal.toLocaleString()}</p>
                  <p style={{fontSize:10,color:"#9aa3b4",marginTop:4,fontWeight:500}}>avg kcal/day</p>
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px",textAlign:"center"}}>
                  <p style={{fontSize:18,fontWeight:900,color:"#00e5a0",lineHeight:1}}>{weeklyWrap.avgHealthScore}<span style={{fontSize:11,color:"#9aa3b4"}}>/10</span></p>
                  <p style={{fontSize:10,color:"#9aa3b4",marginTop:4,fontWeight:500}}>health score</p>
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px",textAlign:"center",gridColumn:"1 / span 2"}}>
                  <p style={{fontSize:18,fontWeight:900,color:"#fff",lineHeight:1}}>{weeklyWrap.onTarget}<span style={{color:"#9aa3b4",fontSize:13}}>/7</span></p>
                  <p style={{fontSize:10,color:"#9aa3b4",marginTop:4,fontWeight:500}}>days on target</p>
                </div>
              </div>
            </div>

            {/* Bottom tagline */}
            <p style={{position:"relative",zIndex:2,fontSize:11,color:"#6b7384",textAlign:"center",marginTop:16,fontWeight:500}}>Track yours at bitelyze.com</p>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button onClick={shareWeek} style={{flex:1,padding:"14px",borderRadius:14,border:"none",background:T.accent,color:"#000",fontWeight:800,cursor:"pointer",fontFamily:"inherit",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 16px ${T.accentGlow}`}}><Share2 size={16}/> Share</button>
            <button onClick={async()=>{
              const w=weeklyWrap;
              const text=`🎯 My week with Bitelyze:\n🔥 ${stats.streak} day streak\n📊 ${w.avgCal} kcal avg/day\n⭐ ${w.avgHealthScore}/10 avg health score\n✅ ${w.onTarget}/7 days on target\n\nTrack yours at bitelyze.com`;
              try{await navigator.clipboard.writeText(text);setToast("Copied to clipboard");}catch(e){setToast("Copy failed");}
            }} style={{padding:"14px 18px",borderRadius:14,border:`1.5px solid ${T.border}`,background:T.card,color:T.text,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Copy size={16}/> Copy</button>
          </div>
        </div>
      </div>
    </>)}

    {/* ── Premium Frosted Header ── */}
    <div style={{padding:"calc(14px + env(safe-area-inset-top)) 18px 0",background:T.headerBg,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:10,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <div className="logo-pulse" style={{width:42,height:42,borderRadius:14,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 16px ${T.accentGlow}`,flexShrink:0}}><UtensilsCrossed size={20}/></div>
        <span style={{fontSize:16,fontWeight:800,color:T.text,flex:1}}>Bitelyze</span>
        <div style={{display:"flex",alignItems:"center",gap:6,background:`${T.orange}10`,border:`1px solid ${T.orange}35`,borderRadius:24,padding:"5px 12px",boxShadow:`0 0 16px ${T.orange}15`,flexShrink:0}}><Flame size={14}/><span className="bounce-pop" style={{fontSize:13,fontWeight:900,color:T.orange}}>{stats.streak}d</span></div>
        <button onClick={()=>setNotifOpen(true)} aria-label="Notifications" style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.muted,borderRadius:10,padding:"7px 10px",cursor:"pointer",fontFamily:"inherit",transition:"all .3s",flexShrink:0,display:"flex",alignItems:"center",position:"relative"}}>
          <Bell size={16}/>
          {notifications.length>0&&<span style={{position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",background:T.accent,border:`2px solid ${T.bg}`}}/>}
        </button>
      </div>
      {/* Slim calorie progress bar */}
      <div style={{height:4,borderRadius:99,background:T.barBg,overflow:"hidden",marginBottom:0}}>
        <div style={{height:"100%",width:`${Math.min((consumed/goal)*100,100)}%`,background:pct<50?T.accent:pct<85?`linear-gradient(90deg,${T.accent},${T.orange})`:`linear-gradient(90deg,${T.orange},${T.danger})`,borderRadius:99,transition:"width .8s cubic-bezier(0.16,1,0.3,1)"}}/>
      </div>
    </div>

    {/* ── Calorie Ring Summary — only on Analyze tab ── */}
    {tab==="analyze"&&(<div style={{padding:"24px 18px 18px",background:T.bg}}>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        <div style={{position:"relative",flexShrink:0}} className="ring-glow">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={ringColor}/>
                <stop offset="100%" stopColor={pct<75?"#00b87a":pct<100?"#e65c00":"#cc2936"}/>
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r={ringR} fill="none" stroke={T.barBg} strokeWidth="10"/>
            <circle cx="80" cy="80" r={ringR} fill="none" stroke="url(#rg)" strokeWidth="10" strokeDasharray={ringC} strokeDashoffset={ringC*(1-Math.min(consumed/goal,1))} strokeLinecap="round" transform="rotate(-90 80 80)" style={{transition:"stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)"}} className="shimmer-ring"/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:32,fontWeight:900,color:ringColor,lineHeight:1}}><CountUp target={consumed} duration={1000}/></span>
            <span style={{fontSize:11,color:T.muted,marginTop:3,fontWeight:500}}>of {goal} kcal</span>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
          {[["Eaten",consumed,T.accent,<UtensilsCrossed size={12}/>],["Remaining",Math.max(rem,0),T.blue,<Target size={12}/>],["Goal",goal,T.orange,<Zap size={12}/>]].map(([l,v,c,ic])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:8,background:`${c}08`,border:`1px solid ${l==="Goal"?T.orange+"40":c+"18"}`,borderRadius:12,padding:"7px 10px"}}>
            <span>{ic}</span>
            <div style={{flex:1}}>
              <span style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".4px",fontWeight:600,display:"block",lineHeight:1}}>{l}</span>
              <span style={{fontSize:20,fontWeight:900,color:c,display:"block",letterSpacing:"-0.02em",lineHeight:1.3}}>{v}</span>
            </div>
          </div>))}
        </div>
      </div>
      {/* saving indicator removed — saves silently */}
    </div>)}

    {/* ── Coach Card — only on Analyze tab ── */}
    {tab==="analyze"&&(<div style={{margin:"0 16px",padding:"16px 18px",background:`linear-gradient(145deg,${cm.color}0a,${cm.color}05)`,border:`1px solid ${cm.color}25`,borderRadius:18,marginTop:12,boxShadow:`0 4px 24px ${cm.color}08`}}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
        <div className="bob-float" style={{width:36,height:36,borderRadius:12,background:`${cm.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,border:`1px solid ${cm.color}25`}}><Brain size={18}/></div>
        <div><p style={{fontSize:10,fontWeight:700,color:cm.color,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>Your Coach</p><p style={{fontSize:13,color:T.text,lineHeight:1.6,fontWeight:500}}>{cm.msg}</p></div>
      </div>
      {(()=>{
        // Build tip/insight carousel — smart insights first, fallback to generic tips
        const items=smartInsights.length>0
          ?smartInsights.map(i=>({smart:true,icon:i.icon,color:i.color,text:i.msg}))
          :coachTips.map(t=>({smart:false,icon:"💡",color:T.orange,text:t.replace("💡 ","")}));
        const currentIdx=tipCardIdx%items.length;
        const current=items[currentIdx];
        return(<>
          <div onClick={()=>setTipCardIdx(i=>(i+1)%items.length)} style={{padding:"12px 14px",background:`${current.color}0a`,borderRadius:12,borderLeft:`3px solid ${current.color}`,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.02)",cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"flex-start",gap:10}}>
            <span style={{fontSize:16,flexShrink:0,lineHeight:1.4}}>{current.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              {current.smart&&<p style={{fontSize:9,fontWeight:800,color:current.color,textTransform:"uppercase",letterSpacing:"1px",marginBottom:3}}>Smart Insight</p>}
              <p style={{fontSize:12.5,color:T.text,lineHeight:1.55,fontWeight:500}}>{current.text}</p>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:8}}>
            {items.map((_,i)=>(<div key={i} style={{width:i===currentIdx?14:5,height:5,borderRadius:99,background:i===currentIdx?current.color:T.border,transition:"all .3s"}}/>))}
          </div>
        </>);
      })()}
    </div>)}

    <div style={{padding:"16px 16px 120px",maxWidth:480,margin:"0 auto"}}>
      {tab==="analyze"&&(<>
        {pendingLogDate&&pendingLogDate!==todayYMD()&&(<div style={{background:`${T.orange}0a`,border:`1px solid ${T.orange}35`,borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          <Calendar size={16} color={T.orange}/>
          <p style={{flex:1,fontSize:12,color:T.orange,fontWeight:700}}>Logging to {formatDateLabel(pendingLogDate)}</p>
          <button onClick={()=>setPendingLogDate(null)} style={{background:"none",border:"none",color:T.orange,cursor:"pointer",padding:4,display:"flex",fontFamily:"inherit"}}><X size={14}/></button>
        </div>)}
        {!image?(<div className="upload breathe" onClick={()=>fileRef.current.click()} style={{border:`2px dashed ${T.border}`,borderRadius:20,padding:"32px 20px",textAlign:"center",cursor:"pointer",background:T.card,marginBottom:12,transition:"all .25s",boxShadow:"0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)"}}>
          <div style={{width:56,height:56,borderRadius:18,background:`${T.accent}12`,border:`1px solid ${T.accent}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}><Camera size={28}/></div>
          <p style={{fontWeight:800,fontSize:15,marginBottom:4,letterSpacing:"-0.01em"}}>Snap or upload your meal</p>
          <p style={{fontSize:12,color:T.muted}}>JPG or PNG • or type food name below</p>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
        </div>):(<div style={{position:"relative",marginBottom:12}}>
          <img src={image} alt="food" style={{width:"100%",borderRadius:18,maxHeight:240,objectFit:"cover",border:`1px solid ${T.border}`,boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}/>
          <button onClick={()=>{setImage(null);setImgB64(null);setResult(null);}} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",border:`1px solid ${T.border}`,color:"#fff",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600,display:"inline-flex",alignItems:"center"}}><X size={14}/></button>
        </div>)}
        {!image&&(<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <input ref={textInputRef} style={{flex:1,padding:"14px 16px",background:T.inputBg,border:`1.5px solid ${T.border}`,borderRadius:14,color:T.text,fontSize:14,outline:"none",fontFamily:"inherit",transition:"border-color .2s",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.2)"}} placeholder={isRecording?"Listening...":placeholders[placeholderIdx]} value={textFood} onChange={e=>setTextFood(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()} onFocus={e=>e.target.style.borderColor=T.accent+"60"} onBlur={e=>e.target.style.borderColor=T.border}/>
          {voiceSupported&&(<button
            onMouseDown={(e)=>{e.preventDefault();startVoice();}}
            onMouseUp={()=>isRecording&&stopVoice()}
            onMouseLeave={()=>isRecording&&stopVoice()}
            onTouchStart={(e)=>{e.preventDefault();startVoice();}}
            onTouchEnd={(e)=>{e.preventDefault();stopVoice();}}
            title={isRecording?"Release to stop":"Hold to record"}
            style={{width:46,height:46,borderRadius:"50%",border:`1.5px solid ${isRecording?T.danger:T.border}`,background:isRecording?`${T.danger}15`:T.inputBg,color:isRecording?T.danger:T.accent,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s",boxShadow:isRecording?`0 0 0 4px ${T.danger}25, 0 0 16px ${T.danger}40`:"inset 0 2px 4px rgba(0,0,0,0.15)",animation:isRecording?"pulseGlow 1.2s ease-in-out infinite":"none"}}
          >{isRecording?<Mic size={18}/>:<Mic size={18}/>}</button>)}
        </div>)}
        {remaining<=0?(<div style={{background:`${T.orange}08`,border:`1px solid ${T.orange}30`,borderRadius:16,padding:"20px 18px",textAlign:"center",marginBottom:12}}>
          <p style={{fontSize:28,marginBottom:8}}>⏳</p>
          <p style={{fontSize:15,fontWeight:800,color:T.orange,marginBottom:6}}>Daily limit reached</p>
          <p style={{fontSize:13,color:T.muted,lineHeight:1.6}}>You've used all 5 free analyses for today.<br/>Come back tomorrow for 5 more!</p>
        </div>):(<>
          <Btn onClick={analyze} disabled={(!image&&!textFood)||loading}>{loading?"Analyzing...":<span style={{display:"inline-flex",alignItems:"center",gap:8}}><Search size={16}/> Analyze Calories</span>}</Btn>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:10}}>
            {[...Array(DAILY_LIMIT)].map((_,i)=>(<div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<remaining?T.accent:T.border,transition:"background .3s",boxShadow:i<remaining?`0 0 8px ${T.accentGlow}`:"none"}}/>))}
            <span style={{fontSize:11,color:remaining<=1?T.orange:T.muted,fontWeight:600,marginLeft:4}}>{remaining} of {DAILY_LIMIT} analyses left today</span>
          </div>
        </>)}
        {loading&&<AnalyzeLoader/>}
        {error&&<div style={{background:`${T.danger}08`,border:`1px solid ${T.danger}30`,borderRadius:14,padding:"13px 16px",marginTop:14,color:T.danger,fontSize:13,boxShadow:`0 4px 16px ${T.danger}10`,display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={16}/> {error}</div>}

        {showClarifier&&(<>
          <div onClick={()=>setShowClarifier(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:50,animation:"fadeIn .2s ease"}}/>
          <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.card,borderRadius:"24px 24px 0 0",padding:"28px 22px 36px",zIndex:51,animation:"slideUp .4s cubic-bezier(0.34,1.56,0.64,1)",border:`1px solid ${T.border}`,maxHeight:"70vh",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:28,animation:"bobFloat 2s ease-in-out infinite",display:"inline-flex",alignItems:"center"}}><HelpCircle size={28} color={T.accent}/></span>
              <div>
                <p style={{fontSize:16,fontWeight:800,color:T.text}}>Just to be accurate...</p>
                <p style={{fontSize:13,color:T.muted}}>How much <span style={{color:T.accent,fontWeight:700}}>{clarifyFood}</span> did you have?</p>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:18,marginBottom:16,flexWrap:"wrap"}}>
              {getPortionOptions(clarifyFood).map(([icon,label],i)=>(<button key={i} onClick={()=>{setSelectedPortion(label);setCustomPortion('');}} style={{flex:1,minWidth:90,padding:"14px 10px",borderRadius:14,border:`1.5px solid ${selectedPortion===label?T.accent:T.border}`,background:selectedPortion===label?T.accentDim:T.inputBg,color:selectedPortion===label?T.accent:T.text,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",textAlign:"center"}}><span style={{fontSize:20,display:"block",marginBottom:4}}>{icon}</span>{label}{selectedPortion===label&&" ✓"}</button>))}
            </div>
            <input value={customPortion} onChange={e=>{setCustomPortion(e.target.value);setSelectedPortion(null);}} placeholder="Enter your portion size" style={{width:"100%",padding:"12px 16px",background:T.inputBg,border:`1.5px solid ${T.border}`,borderRadius:12,color:T.text,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:16}}/>
            <Btn onClick={confirmClarify} disabled={!selectedPortion&&!customPortion}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Analyse This <ArrowRight size={14}/></span></Btn>
            <p style={{textAlign:"center",fontSize:11,color:T.muted,marginTop:8}}>This helps us give you accurate calorie data</p>
          </div>
        </>)}

        {/* ── PARSE ERROR RECOVERY CARD ── */}
        {parseError&&!loading&&(<div className="fadeUp" style={{marginTop:18,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px 18px",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><HelpCircle size={36} color={T.muted}/></div>
          <p style={{fontSize:16,fontWeight:800,color:T.text,marginBottom:6}}>We couldn't read that meal clearly</p>
          <p style={{fontSize:13,color:T.muted,marginBottom:16,lineHeight:1.6}}>Try a clearer photo or type what you ate instead</p>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setParseError(false);setImage(null);setImgB64(null);setResult(null);setTimeout(()=>fileRef.current&&fileRef.current.click(),50);}} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${T.accent}50`,background:"transparent",color:T.accent,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Try Again</button>
            <button onClick={()=>{setParseError(false);setImage(null);setImgB64(null);setResult(null);setTimeout(()=>textInputRef.current&&textInputRef.current.focus(),50);}} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${T.orange}50`,background:"transparent",color:T.orange,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Type Instead</button>
          </div>
        </div>)}

        {/* ── RESULT CARD ── */}
        {result&&!loading&&!parseError&&(<div className="fadeUp" style={{marginTop:18}}>

          {/* Section 1 — Meal Identity */}
          <div style={{background:`${T.accent}08`,border:`1.5px solid ${T.accent}30`,borderRadius:22,overflow:"hidden",marginBottom:14,boxShadow:`0 8px 40px ${T.accent}10, inset 0 1px 0 rgba(255,255,255,0.04)`,position:"relative"}}>
            {/* Colored verdict banner */}
            <div style={{padding:"8px 16px",background:result.healthScore>=7?"#00e5a018":result.healthScore>=4?"#ff6b3518":"#ff475718",borderBottom:`1px solid ${result.healthScore>=7?T.accent:result.healthScore>=4?T.orange:T.danger}20`,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <span style={{fontSize:12,fontWeight:700,color:result.healthScore>=7?T.accent:result.healthScore>=4?T.orange:T.danger,display:"inline-flex",alignItems:"center",gap:4}}>
                {result.healthScore>=7?<>Nutritious Choice <Check size={12}/></>:result.healthScore>=4?"Moderate — Balance Your Day":"High Calorie — Plan Accordingly"}
              </span>
            </div>
            <div style={{padding:"18px 20px",position:"relative"}}>
              <div style={{position:"absolute",top:"-30%",right:"-20%",width:180,height:180,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}08,transparent 70%)`,pointerEvents:"none"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
                <div style={{flex:1,paddingRight:16}}>
                  <p style={{fontSize:22,fontWeight:900,marginBottom:4,letterSpacing:"-0.02em",lineHeight:1.2,wordBreak:"break-word",overflowWrap:"break-word"}}>{result.foodName}</p>
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
            {/* Confidence + Adjusted badges */}
            <div style={{display:"flex",gap:6,alignItems:"center",justifyContent:"center",marginTop:8,flexWrap:"wrap",position:"relative"}}>
              {(()=>{const c=result.confidence||"medium";const cfg=c==="high"?{bg:"rgba(0,229,160,0.15)",bd:"#00e5a050",fg:"#00e5a0",label:"ACCURATE",pulse:true}:c==="low"?{bg:"rgba(255,71,87,0.15)",bd:"#ff475750",fg:"#ff4757",label:"ROUGH ESTIMATE",pulse:true}:{bg:"rgba(255,107,53,0.15)",bd:"#ff6b3550",fg:"#ff6b35",label:"ESTIMATED",pulse:false};return(<span style={{display:"inline-flex",alignItems:"center",gap:6,background:cfg.bg,border:`1px solid ${cfg.bd}`,color:cfg.fg,fontSize:11,fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase",padding:"4px 10px",borderRadius:99}}><span style={{width:6,height:6,borderRadius:"50%",background:cfg.fg,animation:cfg.pulse?"confPulse 1.6s ease-in-out infinite":"none",display:"inline-block"}}/>{cfg.label}</span>);})()}
              {result._adjustmentPct!=null&&result._adjustmentPct!==0&&(<button onClick={()=>{setResult(r=>{const o={...r};o.totalCalories=r._origTotalCalories??r.totalCalories;o.protein=r._origProtein??r.protein;o.carbs=r._origCarbs??r.carbs;o.fat=r._origFat??r.fat;o.fiber=r._origFiber??r.fiber;o.items=(r.items||[]).map(it=>({...it,calories:it._origCalories??it.calories,protein:it._origProtein??it.protein,carbs:it._origCarbs??it.carbs,fat:it._origFat??it.fat}));delete o._origTotalCalories;delete o._origProtein;delete o._origCarbs;delete o._origFat;delete o._origFiber;delete o._adjustmentPct;o.items=o.items.map(it=>{const x={...it};delete x._origCalories;delete x._origProtein;delete x._origCarbs;delete x._origFat;return x;});return o;});setPortionFlow("initial");setPortionConfirmed(false);}} title="Click to revert" style={{cursor:"pointer",background:"rgba(255,107,53,0.15)",border:"1px solid #ff6b3550",color:"#ff6b35",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,fontFamily:"inherit",letterSpacing:"0.3px"}}>ADJUSTED {result._adjustmentPct>0?"+":""}{result._adjustmentPct}%</button>)}
            </div>
            <div style={{margin:"14px 0 8px",height:8,borderRadius:99,background:T.barBg,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min((result.totalCalories/goal)*100,100)}%`,background:`linear-gradient(90deg,${T.accent},${T.orange})`,borderRadius:99,transition:"width 1s cubic-bezier(0.16,1,0.3,1)"}}/>
            </div>
            <p style={{fontSize:12,color:T.muted,fontWeight:500}}>{Math.round((result.totalCalories/goal)*100)}% of your daily goal</p>
          </Card>

          {/* LOW confidence action card */}
          {result.confidence==="low"&&(<div style={{background:"rgba(255,71,87,0.08)",border:"1px solid #ff475730",padding:"14px 16px",borderRadius:12,margin:"12px 0"}}>
            <p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4,display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={14} color={T.danger}/> Not confident in this result</p>
            <p style={{fontSize:12,color:T.muted,marginBottom:10,lineHeight:1.5}}>Try a clearer photo or adjust the result manually</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setImage(null);setImgB64(null);setResult(null);setTimeout(()=>fileRef.current&&fileRef.current.click(),50);}} style={{flex:1,padding:"8px 12px",borderRadius:10,border:`1.5px solid ${T.accent}50`,background:"transparent",color:T.accent,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6}}><Camera size={14}/> Retake Photo</button>
              <button onClick={()=>{if(portionSectionRef.current){portionSectionRef.current.scrollIntoView({behavior:"smooth",block:"center"});}setPortionFlow(f=>f==="initial"?"more":f);}} style={{flex:1,padding:"8px 12px",borderRadius:10,border:`1.5px solid ${T.orange}50`,background:"transparent",color:T.orange,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6}}><Pencil size={14}/> Adjust Manually</button>
            </div>
          </div>)}

          {/* Portion Adjustment Section */}
          {(()=>{const applyAdjustment=(pct)=>{const factor=1+(pct/100);setResult(r=>({...r,totalCalories:Math.round((r._origTotalCalories??r.totalCalories)*factor),protein:Math.round((r._origProtein??r.protein)*factor*10)/10,carbs:Math.round((r._origCarbs??r.carbs)*factor*10)/10,fat:Math.round((r._origFat??r.fat)*factor*10)/10,fiber:Math.round((r._origFiber??r.fiber)*factor*10)/10,items:(r.items||[]).map(item=>({...item,calories:Math.round((item._origCalories??item.calories)*factor),protein:Math.round((item._origProtein??item.protein)*factor*10)/10,carbs:Math.round((item._origCarbs??item.carbs)*factor*10)/10,fat:Math.round((item._origFat??item.fat)*factor*10)/10,_origCalories:item._origCalories??item.calories,_origProtein:item._origProtein??item.protein,_origCarbs:item._origCarbs??item.carbs,_origFat:item._origFat??item.fat})),_origTotalCalories:r._origTotalCalories??r.totalCalories,_origProtein:r._origProtein??r.protein,_origCarbs:r._origCarbs??r.carbs,_origFat:r._origFat??r.fat,_origFiber:r._origFiber??r.fiber,_adjustmentPct:pct}));setPortionFlow("initial");};
          if(portionConfirmed&&!showConfirmMsg)return null;
          return(<div ref={portionSectionRef} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",margin:"12px 0",transition:"all .3s ease"}}>
            {portionConfirmed?(<p style={{fontSize:12,color:T.accent,fontWeight:700,textAlign:"center",margin:0,animation:"fadeIn .3s ease",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%"}}><Check size={14}/> Great — accuracy confirmed</p>):(<>
              <p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Ruler size={14} color={T.accent}/> Is this portion accurate?</p>
              {portionFlow==="initial"&&(<div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setPortionConfirmed(true);setShowConfirmMsg(true);setTimeout(()=>{setShowConfirmMsg(false);},2000);}} style={{flex:1,height:36,borderRadius:10,border:`1.5px solid ${T.accent}50`,background:"transparent",color:T.accent,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"background .2s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:4}} onMouseDown={e=>e.currentTarget.style.background=`${T.accent}20`} onMouseUp={e=>e.currentTarget.style.background="transparent"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Looks right <Check size={12}/></button>
                <button onClick={()=>setPortionFlow("more")} style={{flex:1,height:36,borderRadius:10,border:`1.5px solid ${T.orange}50`,background:"transparent",color:T.orange,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"background .2s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:4}} onMouseDown={e=>e.currentTarget.style.background=`${T.orange}20`} onMouseUp={e=>e.currentTarget.style.background="transparent"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>It was more <ChevronUp size={14}/></button>
                <button onClick={()=>setPortionFlow("less")} style={{flex:1,height:36,borderRadius:10,border:`1.5px solid ${T.blue}50`,background:"transparent",color:T.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"background .2s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:4}} onMouseDown={e=>e.currentTarget.style.background=`${T.blue}20`} onMouseUp={e=>e.currentTarget.style.background="transparent"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>It was less <ChevronDown size={14}/></button>
              </div>)}
              {portionFlow==="more"&&(<div style={{animation:"fadeIn .25s ease"}}>
                <p style={{fontSize:12,color:T.muted,marginBottom:8}}>How much more?</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[25,50,75,100].map(p=>(<button key={p} onClick={()=>applyAdjustment(p)} style={{flex:"1 1 0",minWidth:60,height:32,borderRadius:8,border:`1.5px solid ${T.orange}50`,background:"transparent",color:T.orange,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+{p}%</button>))}
                  <button onClick={()=>{setCustomPct(25);setPortionFlow("custom-more");}} style={{flex:"1 1 0",minWidth:70,height:32,borderRadius:8,border:`1.5px solid ${T.orange}50`,background:"transparent",color:T.orange,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Custom %</button>
                </div>
                <button onClick={()=>setPortionFlow("initial")} style={{marginTop:8,background:"none",border:"none",color:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit",padding:0,display:"inline-flex",alignItems:"center",gap:4}}><ArrowLeft size={11}/> Back</button>
              </div>)}
              {portionFlow==="less"&&(<div style={{animation:"fadeIn .25s ease"}}>
                <p style={{fontSize:12,color:T.muted,marginBottom:8}}>How much less?</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[25,50,75].map(p=>(<button key={p} onClick={()=>applyAdjustment(-p)} style={{flex:"1 1 0",minWidth:60,height:32,borderRadius:8,border:`1.5px solid ${T.blue}50`,background:"transparent",color:T.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>−{p}%</button>))}
                  <button onClick={()=>{setCustomPct(-25);setPortionFlow("custom-less");}} style={{flex:"1 1 0",minWidth:70,height:32,borderRadius:8,border:`1.5px solid ${T.blue}50`,background:"transparent",color:T.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Custom %</button>
                </div>
                <button onClick={()=>setPortionFlow("initial")} style={{marginTop:8,background:"none",border:"none",color:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit",padding:0,display:"inline-flex",alignItems:"center",gap:4}}><ArrowLeft size={11}/> Back</button>
              </div>)}
              {(portionFlow==="custom-more"||portionFlow==="custom-less")&&(<div style={{animation:"fadeIn .25s ease"}}>
                <p style={{textAlign:"center",fontSize:16,fontWeight:800,color:customPct>=0?T.orange:T.blue,marginBottom:6}}>{customPct>0?"+":""}{customPct}%</p>
                <input type="range" min="-90" max="200" value={customPct} onChange={e=>setCustomPct(Number(e.target.value))} style={{width:"100%",accentColor:customPct>=0?T.orange:T.blue,marginBottom:10}}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setPortionFlow(portionFlow==="custom-more"?"more":"less")} style={{flex:1,height:34,borderRadius:10,border:`1px solid ${T.border}`,background:T.inputBg,color:T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                  <button onClick={()=>applyAdjustment(customPct)} style={{flex:1,height:34,borderRadius:10,border:"none",background:T.accent,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Apply</button>
                </div>
              </div>)}
            </>)}
          </div>);})()}

          {/* Section 3 — Macronutrients */}
          <Card>
            <CardTitle icon={<FlaskConical size={16} color={T.accent}/>}>Macronutrients</CardTitle>
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
              <p style={{fontSize:12,color:T.blue,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={14}/> Low protein — add a protein source to your next meal</p>
            </div>)}
          </Card>

          {/* Section 4 — Meal Verdict */}
          <Card style={{borderLeft:`3px solid ${hc}`,padding:"16px 18px"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{flexShrink:0,display:"flex",alignItems:"center"}}><Stethoscope size={20} color={hc}/></span>
              <div>
                <p style={{fontSize:11,fontWeight:700,color:hc,textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>Meal Verdict</p>
                <p style={{fontSize:14,color:T.text,lineHeight:1.6,fontWeight:500}}>{verdictText}</p>
              </div>
            </div>
          </Card>

          {/* Section 5 — Coach Suggestions */}
          {result.suggestions&&result.suggestions.length>0&&(<Card>
            <CardTitle icon={<Lightbulb size={16} color={T.accent}/>}>Bitelyze Tips</CardTitle>
            {result.suggestions.slice(0,4).map((s,i)=>(<div key={i} style={{display:"flex",gap:11,padding:"12px 0",borderBottom:i<Math.min(result.suggestions.length,4)-1?`1px solid ${T.border}`:"none",animation:`staggerIn .4s ease ${i*0.1}s both`}}>
              <span style={{fontSize:18,flexShrink:0,lineHeight:1.4}}>{s.icon}</span>
              <span style={{fontSize:14,lineHeight:1.55,color:T.text}}>{s.text}</span>
            </div>))}
          </Card>)}

          {/* Section 6 — Smarter Swaps (replaces Burn It Off) */}
          {result.smarterSwaps&&result.smarterSwaps.length>0&&(<Card>
            <CardTitle icon={<Repeat size={16} color={T.accent}/>}>Smarter Swaps</CardTitle>
            {result.smarterSwaps.map((sw,i)=>(<div key={i} style={{padding:"12px 0",borderBottom:i<result.smarterSwaps.length-1?`1px solid ${T.border}`:"none",animation:`staggerIn .4s ease ${i*0.12}s both`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{fontSize:14,fontWeight:700,color:T.danger,opacity:0.85,textDecoration:"line-through"}}>{sw.from}</span>
                <span style={{fontSize:14,color:T.muted}}>→</span>
                <span style={{fontSize:14,fontWeight:700,color:T.accent}}>{sw.to}</span>
              </div>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.55,paddingLeft:2}}>{sw.reason}</p>
            </div>))}
          </Card>)}

          {/* Section 7 — Remaining Today */}
          <Card style={{background:remainingAfter>goal*0.25?`${T.accent}08`:remainingAfter>=0?`${T.orange}08`:`${T.danger}08`,borderColor:remainingAfter>goal*0.25?`${T.accent}25`:remainingAfter>=0?`${T.orange}25`:`${T.danger}25`}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{display:"inline-flex",alignItems:"center"}}>{remainingAfter>goal*0.25?<Check size={24} color={T.accent}/>:remainingAfter>=0?<AlertTriangle size={24} color={T.orange}/>:<AlertTriangle size={24} color={T.danger}/>}</span>
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
          <button className="pulse-glow ripple" onClick={()=>logMeal()} style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${T.accent},#00b87a)`,color:"#000",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"inherit",marginBottom:6,transition:"all .2s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8}}><Check size={18}/> Log This Meal</button>
          <p style={{fontSize:11,color:T.muted,textAlign:"center",marginBottom:12}}>Logged meals are saved to today's diary</p>
          <button onClick={()=>{setResult(null);setImage(null);setImgB64(null);setTextFood("");setPortionFlow("initial");setPortionConfirmed(false);setShowConfirmMsg(false);setParseError(false);}} className="ripple" style={{width:"100%",padding:"13px",borderRadius:14,border:`1px solid ${T.border}`,background:T.inputBg,color:T.text,cursor:"pointer",fontSize:14,fontFamily:"inherit",fontWeight:600,transition:"all .2s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8}}><Camera size={14}/> Analyse Another</button>

        </div>)}

        {/* Recent meals quick-add */}
        {allHistory.length>0&&(<Card style={{marginTop:18}}><CardTitle icon={<Clock size={16} color={T.accent}/>}>Recent — Tap to Re-log</CardTitle>{allHistory.filter((m,i,a)=>a.findIndex(x=>x.foodName===m.foodName)===i).slice(0,5).map((m,i,arr)=>(<div key={i} onClick={()=>logMeal(m)} className="ripple" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",cursor:"pointer",transition:"all .15s"}}><div><p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:2}}>{m.foodName}</p><p style={{fontSize:11,color:T.muted}}>{m.servingSize}</p></div><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:13,fontWeight:800,color:T.accent}}>{m.totalCalories}</span><span style={{fontSize:11,color:T.accent,background:`${T.accent}12`,padding:"4px 10px",borderRadius:20,fontWeight:600,border:`1px solid ${T.accent}20`}}>+ Add</span></div></div>))}</Card>)}
      </>)}

      {tab==="log"&&(()=>{
        const isToday=selectedLogDate===todayYMD();
        const selectedMeals=allHistory.filter(m=>mealDate(m)===selectedLogDate).slice().sort((a,b)=>(a.timestamp||"").localeCompare(b.timestamp||""));
        const dayCal=selectedMeals.reduce((s,m)=>s+(m.totalCalories||0),0);
        const dayRem=goal-dayCal;
        const dayOver=dayCal-goal;
        const dayPct=Math.round(Math.min((dayCal/goal)*100,100));
        const dayRingColor=dayCal===0?T.muted:dayPct<75?T.accent:dayPct<100?T.orange:T.danger;
        const headerLabel=formatDateLabel(selectedLogDate);
        return(<>
          {/* Date Navigation Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"10px 14px",marginBottom:14}}>
            <button onClick={()=>{setSelectedLogDate(addDays(selectedLogDate,-1));}} className="ripple" style={{background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 10px",cursor:"pointer",color:T.text,display:"flex",alignItems:"center",fontFamily:"inherit"}}><ChevronLeft size={18}/></button>
            <div onClick={()=>{setCalendarMonth(()=>{const d=parseYMD(selectedLogDate);return new Date(d.getFullYear(),d.getMonth(),1);});setShowDatePicker(true);}} style={{cursor:"pointer",textAlign:"center",flex:1,padding:"0 10px"}}>
              <p style={{fontSize:15,fontWeight:800,color:T.text,lineHeight:1.2}}>{headerLabel}</p>
              <p style={{fontSize:10,color:T.muted,marginTop:2,fontWeight:500}}>Tap to pick a date</p>
            </div>
            <button disabled={isToday} onClick={()=>{if(!isToday)setSelectedLogDate(addDays(selectedLogDate,1));}} className={isToday?"":"ripple"} style={{background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 10px",cursor:isToday?"default":"pointer",color:T.text,opacity:isToday?0.3:1,display:"flex",alignItems:"center",fontFamily:"inherit"}}><ChevronRight size={18}/></button>
          </div>

          {/* Daily Summary Card */}
          <Card style={{textAlign:"center",background:T.card,padding:"24px 20px"}}>
            <p style={{fontSize:11,color:T.muted,marginBottom:14,textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>{isToday?"Today's Progress":headerLabel+"'s Summary"}</p>
            <div style={{position:"relative",display:"inline-block",marginBottom:16}} className={dayCal>0?"ring-glow":""}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={dayRingColor}/><stop offset="100%" stopColor={dayRingColor}/></linearGradient></defs>
                <circle cx="65" cy="65" r="54" fill="none" stroke={T.barBg} strokeWidth="10"/>
                <circle cx="65" cy="65" r="54" fill="none" stroke="url(#lg1)" strokeWidth="10" strokeDasharray={`${2*Math.PI*54}`} strokeDashoffset={`${2*Math.PI*54*(1-Math.min(dayCal/goal,1))}`} strokeLinecap="round" transform="rotate(-90 65 65)" style={{transition:"stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:26,fontWeight:900,color:dayRingColor,lineHeight:1}}>{dayCal}</span>
                <span style={{fontSize:9,color:T.muted,marginTop:3}}>kcal</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <div style={{background:`${T.accent}08`,borderRadius:12,padding:"10px 8px",border:`1px solid ${T.accent}15`}}><span style={{fontSize:17,fontWeight:900,color:T.accent,display:"block"}}>{dayCal}</span><span style={{fontSize:9,color:T.muted,textTransform:"uppercase",fontWeight:600}}>Eaten</span></div>
              {dayOver>0?(
                <div style={{background:`${T.danger}08`,borderRadius:12,padding:"10px 8px",border:`1px solid ${T.danger}20`}}><span style={{fontSize:17,fontWeight:900,color:T.danger,display:"block"}}>+{dayOver}</span><span style={{fontSize:9,color:T.muted,textTransform:"uppercase",fontWeight:600}}>Over</span></div>
              ):(
                <div style={{background:`${T.blue}08`,borderRadius:12,padding:"10px 8px",border:`1px solid ${T.blue}15`}}><span style={{fontSize:17,fontWeight:900,color:T.blue,display:"block"}}>{dayRem}</span><span style={{fontSize:9,color:T.muted,textTransform:"uppercase",fontWeight:600}}>Remaining</span></div>
              )}
              <div style={{background:`${T.orange}08`,borderRadius:12,padding:"10px 8px",border:`1px solid ${T.orange}15`}}><span style={{fontSize:17,fontWeight:900,color:T.orange,display:"block"}}>{goal}</span><span style={{fontSize:9,color:T.muted,textTransform:"uppercase",fontWeight:600}}>Goal</span></div>
            </div>
            {selectedMeals.length===0&&(<div style={{marginTop:18,padding:"16px 12px",background:T.inputBg,border:`1px dashed ${T.border}`,borderRadius:14}}>
              <p style={{fontSize:13,color:T.muted,marginBottom:12,fontWeight:500}}>No meals logged on this day</p>
              <button onClick={()=>{setPendingLogDate(selectedLogDate);setTab("analyze");}} className="ripple" style={{background:`linear-gradient(135deg,${T.accent},#00b87a)`,border:"none",color:"#000",borderRadius:12,padding:"10px 16px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6,boxShadow:`0 4px 12px ${T.accentGlow}`}}><Plus size={14}/> Add Meal Retroactively</button>
            </div>)}
          </Card>

          {/* Water Tracker — only shown for today (kept same as before) */}
          {isToday&&(<Card style={{background:`${T.blue}08`}}>
            <CardTitle icon={<Droplets size={16} color={T.blue}/>}>Water Intake</CardTitle>
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
              {Array.from({length:8}).map((_,i)=>(<div key={i} onClick={()=>setWater(i<water?i:i+1)} style={{width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",transition:"all .25s",background:i<water?`${T.blue}20`:T.barBg,boxShadow:i<water?`0 0 10px ${T.blue}30`:"none",border:`1px solid ${i<water?T.blue+"40":T.border}`}}><Droplets size={14} color={i<water?T.blue:T.muted}/></div>))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
              <div style={{position:"relative",width:76,height:76,flexShrink:0}} className="ring-glow">
                <svg width="76" height="76" viewBox="0 0 76 76">
                  <defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={T.blue}/><stop offset="100%" stopColor="#2a7fc8"/></linearGradient></defs>
                  <circle cx="38" cy="38" r="31" fill="none" stroke={T.barBg} strokeWidth="7"/>
                  <circle cx="38" cy="38" r="31" fill="none" stroke="url(#wg)" strokeWidth="7" strokeDasharray={`${2*Math.PI*31}`} strokeDashoffset={`${2*Math.PI*31*(1-Math.min(water/8,1))}`} strokeLinecap="round" transform="rotate(-90 38 38)" style={{transition:"stroke-dashoffset .8s cubic-bezier(0.16,1,0.3,1)"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:17,fontWeight:900,color:T.blue}}>{water}</span><span style={{fontSize:8,color:T.muted,fontWeight:600}}>/8</span></div>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{water} of 8 glasses</p>
                <p style={{fontSize:12,color:T.muted,marginBottom:12}}>{water===0?"Start hydrating!":water<4?"Keep going 💧":water<8?"Almost there!":"Goal crushed! 🎉"}</p>
                <div style={{display:"flex",gap:8}}>
                  <button className="ripple" onClick={()=>setWater(w=>Math.max(0,w-1))} style={{padding:"8px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.inputBg,color:T.muted,fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .15s",display:"inline-flex",alignItems:"center"}}><Minus size={16}/></button>
                  <button className="glow ripple" onClick={()=>setWater(w=>Math.min(12,w+1))} style={{flex:1,padding:"8px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${T.blue},#2a7fc8)`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 16px ${T.blue}30`,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6}}><Plus size={14}/> Add Glass</button>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:5}}>{Array.from({length:8}).map((_,i)=>(<div key={i} onClick={()=>setWater(i+1)} style={{flex:1,height:8,borderRadius:99,background:i<water?`linear-gradient(135deg,${T.blue},#2a7fc8)`:T.barBg,cursor:"pointer",transition:"all .25s",boxShadow:i<water?`0 0 8px ${T.blue}25`:"none"}}/>))}</div>
          </Card>)}

          {/* Meal List */}
          {selectedMeals.length>0&&(<Card><CardTitle icon={<UtensilsCrossed size={16} color={T.accent}/>}>{isToday?"Meals Today":"Meals on "+headerLabel}</CardTitle>{selectedMeals.map((m,i)=>{const mhc=m.healthScore>=7?T.accent:m.healthScore>=4?T.orange:T.danger;return(<div key={m.id||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",paddingLeft:12,borderBottom:i<selectedMeals.length-1?`1px solid ${T.border}`:"none",borderLeft:`3px solid ${mhc}`,marginLeft:-4}}>
            <div style={{flex:1,minWidth:0}}><p style={{fontSize:13,fontWeight:700,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.foodName}</p><p style={{fontSize:11,color:T.muted,fontWeight:500}}>{m.time}</p></div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <span style={{fontSize:13,fontWeight:800,color:T.accent,background:`${T.accent}10`,padding:"4px 10px",borderRadius:8}}>{m.totalCalories} kcal</span>
              <button onClick={()=>{if(confirm(`Delete ${m.foodName}?`))deleteMeal(m);}} style={{background:`${T.danger}08`,border:`1px solid ${T.danger}25`,borderRadius:8,color:T.danger,padding:"6px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",transition:"all .15s"}}><Trash2 size={14}/></button>
            </div>
          </div>);})}</Card>)}

          {/* Floating Add-Meal-to-Past action bar */}
          {!isToday&&(<button onClick={()=>{setPendingLogDate(selectedLogDate);setTab("analyze");}} className="ripple" style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${T.accent},#00b87a)`,color:"#000",border:"none",borderRadius:99,padding:"12px 20px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 28px ${T.accentGlow}`,display:"flex",alignItems:"center",gap:8,zIndex:20,maxWidth:"88%"}}><Plus size={16}/> Add meal to {headerLabel}</button>)}

          {/* Date Picker Sheet */}
          {showDatePicker&&(<>
            <div onClick={()=>setShowDatePicker(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:60,animation:"fadeIn .2s ease"}}/>
            <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.card,borderRadius:"24px 24px 0 0",padding:"20px 18px 28px",zIndex:61,animation:"slideUp .35s cubic-bezier(0.34,1.56,0.64,1)",border:`1px solid ${T.border}`,maxHeight:"80vh",overflowY:"auto"}}>
              <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 14px"}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <button onClick={()=>setCalendarMonth(d=>new Date(d.getFullYear(),d.getMonth()-1,1))} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,padding:"6px 10px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><ChevronLeft size={16}/></button>
                <p style={{fontSize:16,fontWeight:800,color:T.text}}>{calendarMonth.toLocaleDateString("en",{month:"long",year:"numeric"})}</p>
                <button onClick={()=>{const next=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);const today=new Date();if(next<=new Date(today.getFullYear(),today.getMonth(),1))setCalendarMonth(next);}} disabled={(()=>{const next=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);const today=new Date();return next>new Date(today.getFullYear(),today.getMonth(),1);})()} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,padding:"6px 10px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",opacity:(()=>{const next=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);const today=new Date();return next>new Date(today.getFullYear(),today.getMonth(),1)?0.3:1;})()}}><ChevronRight size={16}/></button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>{["S","M","T","W","T","F","S"].map((d,i)=>(<div key={i} style={{textAlign:"center",fontSize:10,color:T.muted,fontWeight:700,padding:"6px 0"}}>{d}</div>))}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
                {buildCalendarGrid(calendarMonth,allHistory).map((cell,i)=>{
                  if(!cell)return<div key={i}/>;
                  const selected=cell.dateStr===selectedLogDate;
                  return(<button key={i} disabled={cell.future} onClick={()=>{if(!cell.future){setSelectedLogDate(cell.dateStr);setShowDatePicker(false);}}} style={{position:"relative",aspectRatio:"1",borderRadius:10,border:selected?`1.5px solid ${T.accent}`:cell.isToday?`1px solid ${T.accent}50`:`1px solid ${T.border}`,background:selected?T.accentDim:cell.isToday?`${T.accent}06`:T.inputBg,color:cell.future?T.muted:selected?T.accent:T.text,cursor:cell.future?"default":"pointer",opacity:cell.future?0.3:1,fontSize:13,fontWeight:selected||cell.isToday?800:500,fontFamily:"inherit",transition:"all .15s"}}>
                    {cell.day}
                    {cell.hasData&&<span style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:selected?T.accent:T.accent}}/>}
                  </button>);
                })}
              </div>
              <button onClick={()=>{setSelectedLogDate(todayYMD());setCalendarMonth(()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1);});setShowDatePicker(false);}} style={{width:"100%",marginTop:16,padding:"12px",borderRadius:12,border:`1px solid ${T.accent}40`,background:T.accentDim,color:T.accent,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Today</button>
            </div>
          </>)}
        </>);
      })()}

      {tab==="progress"&&(()=>{
        const rangeLabel=RANGE_LABELS[progressRange];
        const maxBarVal=Math.max(goal*1.2,...aggregatedBars.map(b=>b.value||0),1);
        const isEmpty=rangeMeals.length===0;
        return(<>
          {/* Section 1: Sticky range dropdown */}
          <div style={{position:"sticky",top:0,zIndex:5,background:T.bg,margin:"-16px -16px 12px",padding:"10px 16px 10px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{position:"relative"}}>
              <button onClick={()=>setRangeDropdownOpen(o=>!o)} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1px solid ${T.border}`,background:T.card,color:T.text,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .2s"}}>
                <span style={{display:"flex",alignItems:"center",gap:8}}><Calendar size={14} color={T.accent}/>{RANGE_LABELS[progressRange]}</span>
                <ChevronDown size={16} style={{transform:rangeDropdownOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}/>
              </button>
              {rangeDropdownOpen&&(<>
                <div onClick={()=>setRangeDropdownOpen(false)} style={{position:"fixed",inset:0,zIndex:20}}/>
                <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:6,zIndex:21,boxShadow:`0 12px 32px ${T.bg}80`,maxHeight:360,overflowY:"auto"}}>
                  {RANGE_KEYS.map(key=>{const active=progressRange===key;return(
                    <button key={key} onClick={()=>{setProgressRange(key);setRangeDropdownOpen(false);}} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"none",background:active?`${T.accent}15`:"transparent",color:active?T.accent:T.text,fontSize:13,fontWeight:active?700:500,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"background .15s"}}>
                      <span>{RANGE_LABELS[key]}</span>
                      {active&&<Check size={14}/>}
                    </button>);})}
                </div>
              </>)}
            </div>
          </div>

          {/* Empty state / low-data banner */}
          {isEmpty?(<Card style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><BarChart3 size={40} color={T.muted}/></div>
            <p style={{fontSize:15,fontWeight:800,color:T.text,marginBottom:6}}>No data for {rangeLabel.toLowerCase()} yet</p>
            <p style={{fontSize:13,color:T.muted,marginBottom:18}}>Keep logging to see your trends</p>
            <Btn onClick={()=>setTab("analyze")} style={{maxWidth:220,margin:"0 auto"}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}>Start Logging <ArrowRight size={14}/></span></Btn>
          </Card>):(<>

          {daysWithData<3&&daysWithData>0&&(<div style={{background:`${T.blue}0a`,border:`1px solid ${T.blue}25`,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <Info size={16} color={T.blue}/>
            <p style={{fontSize:12,color:T.blue,fontWeight:600}}>More insights unlock with a week of logging</p>
          </div>)}

          {/* Section 2: Headline Stats Card */}
          <Card style={{padding:"20px 18px"}}>
            <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:8}}>Total Calories</p>
            <p style={{fontSize:48,fontWeight:900,color:T.accent,letterSpacing:"-0.02em",lineHeight:1,marginBottom:6}}><CountUp target={totalCal} duration={1000}/></p>
            <p style={{fontSize:12,color:T.muted,marginBottom:14,fontWeight:500}}>{rangeLabel} · {daysWithData} day{daysWithData===1?"":"s"} tracked</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:pctChange!==null?12:0}}>
              {[["AVG/DAY",avgCal,T.accent],["HIGHEST",highestDay?highestDay.calories:0,T.orange],["LOWEST",lowestDay?lowestDay.calories:0,T.blue]].map(([l,v,c])=>(<div key={l} style={{background:`${c}08`,border:`1px solid ${c}15`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                <p style={{fontSize:9,color:T.muted,fontWeight:700,letterSpacing:".5px",marginBottom:3}}>{l}</p>
                <p style={{fontSize:16,fontWeight:900,color:c}}>{v}</p>
              </div>))}
            </div>
            {pctChange!==null&&(<div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:T.muted,fontWeight:600}}>
              <span style={{color:pctChange<=0?T.accent:T.orange,fontWeight:800,display:"inline-flex",alignItems:"center",gap:3}}>{pctChange<=0?<TrendingDown size={12}/>:<TrendingUp size={12}/>}{Math.abs(pctChange)}%</span>
              <span>vs previous period</span>
            </div>)}
          </Card>

          {/* Section 3: Streak — preserved */}
          <Card style={{background:`${T.orange}08`,borderColor:`${T.orange}25`,position:"relative",overflow:"hidden",padding:"22px 20px"}}>
            <div style={{position:"absolute",top:"-40%",right:"-20%",width:160,height:160,borderRadius:"50%",background:`radial-gradient(circle,${T.orange}10,transparent 70%)`,pointerEvents:"none"}}/>
            <CardTitle icon={<Flame size={16} color={T.orange}/>}>Current Streak</CardTitle>
            <div style={{display:"flex",alignItems:"center",gap:20,position:"relative"}}>
              <div style={{textAlign:"center",background:`${T.orange}0a`,borderRadius:20,padding:"14px 18px",border:`1px solid ${T.orange}20`}}>
                <p className="bounce-pop" style={{fontSize:48,fontWeight:900,color:T.orange,lineHeight:1,textShadow:`0 0 30px ${T.orange}30`}}>{stats.streak}</p>
                <p style={{fontSize:10,color:T.muted,marginTop:4,fontWeight:600}}>day{stats.streak!==1?"s":""}</p>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>{stats.streak<3?"Start your streak today!":stats.streak>=7?"You're unstoppable! 🔥":`${stats.streak} day${stats.streak>1?"s":""} in a row!`}</p>
                <div style={{display:"flex",gap:5,marginTop:10}}>{Array.from({length:7}).map((_,i)=>(<div key={i} style={{flex:1,height:6,borderRadius:99,background:i<stats.streak%7?`linear-gradient(90deg,${T.orange},#ff8855)`:T.barBg,boxShadow:i<stats.streak%7?`0 0 8px ${T.orange}25`:"none",transition:"all .3s"}}/>))}</div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>{["M","T","W","T","F","S","S"].map((d,i)=>(<span key={i} style={{fontSize:8,color:i<stats.streak%7?T.orange:T.muted,fontWeight:600,flex:1,textAlign:"center"}}>{d}</span>))}</div>
              </div>
            </div>
          </Card>

          {/* Section 4: Calorie Trend Chart */}
          <Card style={{padding:"18px 16px"}}>
            <CardTitle icon={<BarChart3 size={16} color={T.accent}/>}>Calorie Trend · {rangeLabel}</CardTitle>
            <div style={{overflowX:aggregatedBars.length>15?"auto":"visible",paddingBottom:aggregatedBars.length>15?8:0}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:4,height:180,position:"relative",minWidth:aggregatedBars.length>15?`${aggregatedBars.length*16}px`:"auto",padding:"20px 4px 0"}}>
                {/* Goal line */}
                <div style={{position:"absolute",left:0,right:0,top:`${20+(1-goal/maxBarVal)*150}px`,height:1,borderTop:`1px dashed ${T.muted}`,opacity:0.5,pointerEvents:"none"}}/>
                <div style={{position:"absolute",right:0,top:`${20+(1-goal/maxBarVal)*150-8}px`,fontSize:9,color:T.muted,background:T.card,padding:"0 4px",fontWeight:600}}>Goal {goal}</div>
                {aggregatedBars.map((bar,i)=>{
                  const value=bar.value||0;
                  const h=value>0?Math.max((value/maxBarVal)*150,2):4;
                  const over=value>goal;
                  const barColor=!bar.hasData?T.border:over?T.orange:T.accent;
                  const showTip=chartTooltipIdx===i;
                  return(<div key={`${animKey}-${i}`} style={{flex:1,minWidth:Math.max(12,Math.floor(300/Math.max(aggregatedBars.length,1))-4),display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative",cursor:"pointer"}} onClick={()=>setChartTooltipIdx(showTip?null:i)}>
                    {showTip&&(<div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",background:T.card,border:`1px solid ${T.accent}40`,borderRadius:10,padding:"8px 12px",whiteSpace:"nowrap",zIndex:10,boxShadow:`0 4px 16px ${T.bg}40`,marginBottom:6}}>
                      <p style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:2}}>{bar.label}</p>
                      <p style={{fontSize:12,fontWeight:800,color:barColor,marginBottom:6}}>{value} kcal</p>
                      {barMode==="daily"&&bar.hasData&&(<button onClick={(e)=>{e.stopPropagation();setSelectedLogDate(bar.date);setTab("log");}} style={{background:T.accentDim,border:`1px solid ${T.accent}40`,color:T.accent,fontSize:10,fontWeight:700,padding:"4px 8px",borderRadius:6,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:4}}>View this day <ArrowRight size={10}/></button>)}
                    </div>)}
                    <div style={{width:"100%",height:150,display:"flex",alignItems:"flex-end"}}>
                      <div className="bar-grow" style={{"--bar-h":`${h}px`,width:"100%",height:`${h}px`,borderRadius:"6px 6px 2px 2px",background:!bar.hasData?T.border:over?`linear-gradient(180deg,${T.orange},${T.orange}88)`:`linear-gradient(180deg,${T.accent},${T.accent}88)`,opacity:!bar.hasData?0.4:1,boxShadow:bar.hasData?`0 0 10px ${barColor}20`:"none",animationDelay:`${i*0.04}s`,transition:"all .2s"}}/>
                    </div>
                    <span style={{fontSize:9,color:T.muted,fontWeight:500,whiteSpace:"nowrap"}}>{bar.shortLabel}</span>
                  </div>);
                })}
              </div>
            </div>
          </Card>

          {/* Section 5: Macro Breakdown */}
          {daysWithData>0&&(()=>{
            const pKcal=totalProtein*4,cKcal=totalCarbs*4,fKcal=totalFat*9,fiKcal=totalFiber*2;
            const totalMKcal=Math.max(1,pKcal+cKcal+fKcal+fiKcal);
            const pPct=(pKcal/totalMKcal)*100,cPct=(cKcal/totalMKcal)*100,fPct=(fKcal/totalMKcal)*100,fiPct=(fiKcal/totalMKcal)*100;
            return(<Card>
              <CardTitle icon={<FlaskConical size={16} color={T.accent}/>}>Macro Breakdown</CardTitle>
              <div style={{display:"flex",height:12,borderRadius:99,overflow:"hidden",marginBottom:16,boxShadow:"inset 0 1px 2px rgba(0,0,0,0.3)"}}>
                <div style={{width:`${pPct}%`,background:T.blue,transition:"width .8s cubic-bezier(0.16,1,0.3,1)"}}/>
                <div style={{width:`${cPct}%`,background:T.orange,transition:"width .8s cubic-bezier(0.16,1,0.3,1)"}}/>
                <div style={{width:`${fPct}%`,background:"#ff6b9d",transition:"width .8s cubic-bezier(0.16,1,0.3,1)"}}/>
                <div style={{width:`${fiPct}%`,background:T.accent,transition:"width .8s cubic-bezier(0.16,1,0.3,1)"}}/>
              </div>
              {[
                ["Protein",totalProtein,T.blue],
                ["Carbs",totalCarbs,T.orange],
                ["Fat",totalFat,"#ff6b9d"],
                ["Fiber",totalFiber,T.accent],
              ].map(([label,total,color],i)=>{
                const avgPerDay=Math.round(total/Math.max(daysWithData,1));
                return(<div key={label} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:color,flexShrink:0}}/>
                  <span style={{fontSize:13,fontWeight:700,color:T.text,flex:1}}>{label}</span>
                  <span style={{fontSize:12,color:T.muted,fontWeight:500}}>{Math.round(total)}g total</span>
                  <span style={{fontSize:11,color,fontWeight:700,minWidth:70,textAlign:"right"}}>{avgPerDay}g/day avg</span>
                </div>);
              })}
            </Card>);
          })()}

          {/* Section 6: Insights */}
          {insights.length>0&&(<Card>
            <CardTitle icon={<Lightbulb size={16} color={T.accent}/>}>Insights</CardTitle>
            {insights.map((ins,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<insights.length-1?`1px solid ${T.border}`:"none",animation:`staggerIn .4s ease ${i*0.08}s both`,alignItems:"center"}}>
              <span style={{flexShrink:0,display:"flex",alignItems:"center"}}>{ins.icon}</span>
              <span style={{fontSize:13,lineHeight:1.55,color:T.text,fontWeight:500}}>{ins.text}</span>
            </div>))}
          </Card>)}

          {/* Section 7: Most Logged Meals */}
          {mealFreq.length>0&&(<Card>
            <CardTitle icon={<UtensilsCrossed size={16} color={T.accent}/>}>Most Logged Meals</CardTitle>
            {mealFreq.map((m,i)=>(<div key={i} onClick={()=>setShowMealDetail(m.name)} className="ripple" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:i<mealFreq.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</p>
                <p style={{fontSize:11,color:T.muted,fontWeight:500}}>avg {m.avgKcal} kcal</p>
              </div>
              <span style={{fontSize:11,color:T.accent,background:`${T.accent}12`,border:`1px solid ${T.accent}20`,padding:"4px 10px",borderRadius:12,fontWeight:700}}>× {m.count}</span>
            </div>))}
          </Card>)}

          {/* Section 8: Day-of-Week Patterns */}
          {weekdayAvg&&weekdayAvg.some(d=>d.hasData)&&(<Card>
            <CardTitle icon={<Calendar size={16} color={T.accent}/>}>Day-of-Week Patterns</CardTitle>
            {(()=>{const orderedDays=[1,2,3,4,5,6,0];const max=Math.max(...weekdayAvg.map(d=>d.avg),goal);
            return orderedDays.map((dayIdx,i)=>{const d=weekdayAvg[dayIdx];const w=max>0?(d.avg/max)*100:0;const over=d.avg>goal;return(<div key={dayIdx} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<6?9:0}}>
              <span style={{fontSize:11,fontWeight:700,color:T.muted,width:32}}>{d.label}</span>
              <div style={{flex:1,height:14,borderRadius:99,background:T.barBg,overflow:"hidden",position:"relative"}}>
                {d.hasData&&<div style={{height:"100%",width:`${w}%`,background:over?`linear-gradient(90deg,${T.orange},${T.orange}aa)`:`linear-gradient(90deg,${T.accent},${T.accent}aa)`,borderRadius:99,transition:"width .8s cubic-bezier(0.16,1,0.3,1)"}}/>}
              </div>
              <span style={{fontSize:11,fontWeight:700,color:d.hasData?(over?T.orange:T.accent):T.muted,minWidth:50,textAlign:"right"}}>{d.hasData?`${d.avg} kcal`:"—"}</span>
            </div>);});})()}
          </Card>)}

          </>)}

          {/* Section 9: Badges — preserved */}
          {earned.length>0&&(<Card><CardTitle icon={<Trophy size={16} color={T.purple}/>}>Badges Earned ({earned.length}/{BADGES.length})</CardTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>{earned.map(b=>(<div key={b.id} className="pop" style={{textAlign:"center",padding:"12px 6px",background:`linear-gradient(145deg,${T.purple}12,${T.purple}06)`,border:`1px solid ${T.purple}30`,borderRadius:16,boxShadow:`0 4px 16px ${T.purple}10, 0 0 20px ${T.purple}08`}}><span style={{fontSize:28,display:"block",marginBottom:6}}>{b.icon}</span><p style={{fontSize:10,fontWeight:700,color:T.purple,lineHeight:1.3}}>{b.name}</p></div>))}</div></Card>)}
          <Card><CardTitle icon={<Lock size={16} color={T.muted}/>}>Locked Badges ({locked.length})</CardTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>{locked.map(b=>(<div key={b.id} style={{textAlign:"center",padding:"12px 6px",background:T.inputBg,borderRadius:16,border:`1px solid ${T.border}`}}><span style={{fontSize:28,display:"block",marginBottom:6,filter:"grayscale(1) blur(1px)",opacity:.3}}>{b.icon}</span><p style={{fontSize:9,color:T.muted,lineHeight:1.3}}>{b.desc}</p></div>))}</div></Card>

          {/* Export */}
          {!isEmpty&&(<Card>
            <CardTitle icon={<Share2 size={16} color={T.accent}/>}>Export your data</CardTitle>
            <div style={{display:"flex",gap:8}}>
              <button onClick={exportCSV} className="ripple" style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${T.accent}40`,background:T.accentDim,color:T.accent,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Download size={14}/> Export as CSV</button>
              <button onClick={shareSummary} className="ripple" style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${T.blue}40`,background:`${T.blue}10`,color:T.blue,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Share2 size={14}/> Share summary</button>
            </div>
          </Card>)}

          {/* Meal detail sheet */}
          {showMealDetail&&(()=>{const instances=rangeMeals.filter(m=>m.foodName===showMealDetail).sort((a,b)=>(b.timestamp||"").localeCompare(a.timestamp||""));return(<>
            <div onClick={()=>setShowMealDetail(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:60,animation:"fadeIn .2s ease"}}/>
            <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.card,borderRadius:"24px 24px 0 0",padding:"20px 18px 28px",zIndex:61,animation:"slideUp .35s cubic-bezier(0.34,1.56,0.64,1)",border:`1px solid ${T.border}`,maxHeight:"70vh",overflowY:"auto"}}>
              <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 14px"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <p style={{fontSize:16,fontWeight:800,color:T.text}}>{showMealDetail}</p>
                <button onClick={()=>setShowMealDetail(null)} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4,display:"flex"}}><X size={20}/></button>
              </div>
              <p style={{fontSize:12,color:T.muted,marginBottom:12,fontWeight:500}}>{instances.length} logged in {rangeLabel.toLowerCase()}</p>
              {instances.map((m,i)=>(<div key={m.id||i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<instances.length-1?`1px solid ${T.border}`:"none"}}>
                <div><p style={{fontSize:13,color:T.text,fontWeight:600}}>{formatDateLabel(mealDate(m))}</p><p style={{fontSize:11,color:T.muted,marginTop:2}}>{m.time}</p></div>
                <span style={{fontSize:13,fontWeight:700,color:T.accent}}>{m.totalCalories} kcal</span>
              </div>))}
            </div>
          </>);})()}
        </>);
      })()}

      {tab==="me"&&moreView===null&&(<>
        {/* ── MORE Menu — main list view ── */}
        {/* Compact profile summary at top */}
        <div style={{display:"flex",alignItems:"center",gap:14,padding:"10px 4px 20px",marginBottom:6}}>
          <div style={{width:56,height:56,borderRadius:18,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px ${T.accentGlow}`,flexShrink:0}}>
            <User size={26} color="#000"/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:18,fontWeight:900,color:T.text,letterSpacing:"-0.01em",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.name||"User"}</p>
            <p style={{fontSize:12,color:T.muted,fontWeight:500,display:"flex",alignItems:"center",gap:8}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:3,color:T.orange,fontWeight:700}}><Flame size={11}/>{stats.streak}d</span>
              <span>·</span>
              <span>{goal} kcal/day</span>
            </p>
          </div>
        </div>

        {/* Notification permission prompt — shows once user has 3+ meals and hasn't decided */}
        {typeof Notification!=="undefined"&&notifPermission==='default'&&!notifBannerDismissed&&allHistory.length>3&&(<div style={{background:`${T.accent}10`,border:`1.5px solid ${T.accent}35`,borderRadius:16,padding:"16px 18px",marginBottom:18,position:"relative",boxShadow:T.cardShadow||"none"}}>
          <button onClick={dismissNotifBanner} style={{position:"absolute",top:10,right:10,background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4,display:"flex",fontFamily:"inherit"}}><X size={14}/></button>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${T.accent}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bell size={20} color={T.accent}/></div>
            <div style={{flex:1,paddingRight:20}}>
              <p style={{fontSize:14,fontWeight:800,color:T.text,marginBottom:3}}>Never miss a meal</p>
              <p style={{fontSize:12,color:T.muted,lineHeight:1.45}}>Get gentle reminders to log meals and protect your streak.</p>
            </div>
          </div>
          <button onClick={requestNotifPermission} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"none",background:T.accent,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Bell size={14}/> Enable Notifications</button>
        </div>)}

        {/* Menu groups */}
        {[
          {title:"Community",items:[
            {icon:<Flame size={18} color={T.orange}/>,label:"Join the Insiders 🔥",detail:"WhatsApp",onClick:()=>window.open("https://chat.whatsapp.com/Hki0wdepcyh3Wn4QwNCVc3","_blank","noopener,noreferrer")},
          ]},
          {title:t("more.account"),items:[
            {icon:<User size={18} color={T.accent}/>,label:t("more.myProfile"),onClick:()=>setMoreView("profile")},
            {icon:<Target size={18} color={T.accent}/>,label:t("more.editGoals"),onClick:onEditProfile},
          ]},
          {title:t("more.features"),items:[
            {icon:<MessageCircle size={18} color={T.accent}/>,label:t("more.chatCoach"),onClick:()=>setCoachOpen(true)},
            {icon:<BarChart3 size={18} color={T.accent}/>,label:"Progress & Analytics",onClick:()=>setTab("progress")},
            {icon:<Calendar size={18} color={T.accent}/>,label:"Weekly Wrap-Up",onClick:()=>setMoreView("weeklywrap")},
            {icon:<HelpCircle size={18} color={T.accent}/>,label:"View Tour Again",onClick:()=>setShowTour(true)},
          ]},
          {title:"Data & Sync",items:[
            {icon:<RotateCcw size={18} color={T.accent}/>,label:"Sync from Cloud",onClick:async()=>{
              setToast("Syncing from cloud...");
              try{
                const[prof,hist,days]=await Promise.all([
                  getDoc(doc(db,"users",uid,"data","profile")).catch(()=>null),
                  getDoc(doc(db,"users",uid,"data","history")).catch(()=>null),
                  loadRecentDays(uid,14).catch(()=>null)
                ]);
                let count=0;
                if(prof&&prof.exists&&prof.exists()){const p=prof.data();LS.set(`profile_${uid}`,p);count++;}
                if(hist&&hist.exists&&hist.exists()){const m=hist.data().meals||[];LS.set(`history_${uid}`,m);setAllHistory(m);count++;}
                if(days){setRecentDays(days);count++;}
                setToast(count>0?`✓ Synced ${count} item${count>1?"s":""}`:"Already up to date");
              }catch(e){setToast("Sync failed — check connection");}
            }},
          ]},
          {title:t("more.app"),items:[
            {icon:<Palette size={18} color={T.accent}/>,label:t("more.appearance"),detail:theme==="dark"?"Dark":"Light",onClick:()=>setMoreView("appearance")},
            {icon:<Bell size={18} color={T.accent}/>,label:t("more.notifications"),detail:notifPermission==='granted'&&localStorage.getItem('bitelyze_notif_enabled')==='1'?"On":notifPermission==='denied'?"Blocked":"Off",onClick:()=>setMoreView("notifications")},
            {icon:<Globe size={18} color={T.accent}/>,label:t("more.language"),detail:(LANGUAGES.find(l=>l.code===lang)||LANGUAGES[0]).native,onClick:()=>setMoreView("language")},
            {icon:<Smartphone size={18} color={T.accent}/>,label:t("more.homeScreen"),onClick:()=>setMoreView("homescreen")},
          ]}
        ].map((group,gi)=>(<div key={gi} style={{marginBottom:18}}>
          <p style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".8px",marginBottom:8,paddingLeft:4}}>{group.title}</p>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:T.cardShadow||"none"}}>
            {group.items.map((item,ii)=>(<button key={ii} onClick={item.onClick} style={{width:"100%",padding:"14px 16px",background:"transparent",border:"none",borderBottom:ii<group.items.length-1?`1px solid ${T.border}`:"none",color:T.text,fontFamily:"inherit",fontSize:14,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left",transition:"background .15s"}}>
              <span style={{width:32,height:32,borderRadius:10,background:`${T.accent}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.detail&&<span style={{fontSize:12,color:T.muted,fontWeight:500}}>{item.detail}</span>}
              <ChevronRight size={16} color={T.muted}/>
            </button>))}
          </div>
        </div>))}

        {/* Sign Out — separate, visually distinct */}
        <button onClick={onSignOut} className="ripple" style={{width:"100%",padding:"14px",borderRadius:14,border:`1px solid ${T.danger}25`,background:`${T.danger}08`,color:T.danger,fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:14,marginTop:6,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><LogOut size={14}/> {t("common.signOut")}</button>
      </>)}

      {/* ── Appearance sub-view ── */}
      {tab==="me"&&moreView==="appearance"&&(<>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingTop:4}}>
          <button onClick={()=>setMoreView(null)} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text}}>Appearance</h2>
        </div>
        <p style={{fontSize:13,color:T.muted,marginBottom:18,paddingLeft:2}}>Choose how Bitelyze looks.</p>
        {[
          {id:"dark",label:"Dark",desc:"Classic dark theme",icon:<Moon size={20} color={T.accent}/>},
          {id:"light",label:"Light",desc:"Bright and clean",icon:<Sun size={20} color={T.accent}/>}
        ].map(opt=>{const on=theme===opt.id;return(<button key={opt.id} onClick={()=>{if(theme!==opt.id)toggleTheme();}} style={{width:"100%",padding:"16px",borderRadius:14,border:`1.5px solid ${on?T.accent:T.border}`,background:on?`${T.accent}10`:T.card,color:T.text,fontFamily:"inherit",cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
          <span style={{width:44,height:44,borderRadius:12,background:`${T.accent}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{opt.icon}</span>
          <div style={{flex:1}}>
            <p style={{fontSize:15,fontWeight:700,color:on?T.accent:T.text,marginBottom:2}}>{opt.label}</p>
            <p style={{fontSize:12,color:T.muted}}>{opt.desc}</p>
          </div>
          {on&&<Check size={20} color={T.accent}/>}
        </button>);})}
      </>)}

      {/* ── Language sub-view ── */}
      {tab==="me"&&moreView==="language"&&(<>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingTop:4}}>
          <button onClick={()=>setMoreView(null)} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text}}>{t("more.language")}</h2>
        </div>
        <p style={{fontSize:13,color:T.muted,marginBottom:18,paddingLeft:2,lineHeight:1.5}}>{t("more.languageDesc")}</p>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:T.cardShadow||"none"}}>
          {LANGUAGES.map((opt,i)=>{const on=lang===opt.code;return(<button key={opt.code} onClick={()=>setLang(opt.code)} style={{width:"100%",padding:"14px 16px",background:on?`${T.accent}10`:"transparent",border:"none",borderBottom:i<LANGUAGES.length-1?`1px solid ${T.border}`:"none",color:T.text,fontFamily:"inherit",fontSize:14,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left",transition:"background .15s"}}>
            <span style={{fontSize:22,width:32,textAlign:"center",flexShrink:0}}>{opt.flag}</span>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:14,fontWeight:700,color:on?T.accent:T.text,marginBottom:2}}>{opt.native}</p>
              <p style={{fontSize:11,color:T.muted}}>{opt.name}</p>
            </div>
            {on&&<Check size={18} color={T.accent}/>}
          </button>);})}
        </div>
      </>)}

      {/* ── Add to Home Screen guide sub-view ── */}
      {tab==="me"&&moreView==="homescreen"&&(<>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingTop:4}}>
          <button onClick={()=>setMoreView(null)} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text}}>Add to Home Screen</h2>
        </div>
        <p style={{fontSize:13,color:T.muted,marginBottom:20,paddingLeft:2,lineHeight:1.5}}>Install Bitelyze like a native app — launches fullscreen, with its own icon.</p>

        {/* iOS Guide */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px",marginBottom:12,boxShadow:T.cardShadow||"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <Apple size={22} color={T.accent}/>
            <p style={{fontSize:16,fontWeight:800,color:T.text}}>iPhone / iPad (Safari)</p>
          </div>
          {[
            "Open bitelyze.com in Safari (not Chrome — iOS only installs from Safari).",
            <span>Tap the <strong>Share</strong> button at the bottom of the screen <Share size={14} style={{display:"inline",verticalAlign:"middle"}}/></span>,
            <span>Scroll down and tap <strong>Add to Home Screen</strong></span>,
            <span>Tap <strong>Add</strong> in the top right</span>,
            "The Bitelyze icon will appear on your Home Screen — tap it to launch fullscreen!"
          ].map((step,i)=>(<div key={i} style={{display:"flex",gap:12,marginBottom:i<4?12:0,alignItems:"flex-start"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:`${T.accent}15`,border:`1px solid ${T.accent}40`,color:T.accent,fontSize:12,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
            <p style={{fontSize:13.5,color:T.text,lineHeight:1.55}}>{step}</p>
          </div>))}
        </div>

        {/* Android Guide */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px",marginBottom:12,boxShadow:T.cardShadow||"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <Smartphone size={22} color={T.accent}/>
            <p style={{fontSize:16,fontWeight:800,color:T.text}}>Android (Chrome)</p>
          </div>
          {[
            "Open bitelyze.com in Chrome.",
            <span>Tap the <strong>three dots menu</strong> (⋮) in the top right</span>,
            <span>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong></span>,
            <span>Tap <strong>Install</strong> to confirm</span>,
            "Bitelyze will appear on your home screen and app drawer!"
          ].map((step,i)=>(<div key={i} style={{display:"flex",gap:12,marginBottom:i<4?12:0,alignItems:"flex-start"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:`${T.accent}15`,border:`1px solid ${T.accent}40`,color:T.accent,fontSize:12,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
            <p style={{fontSize:13.5,color:T.text,lineHeight:1.55}}>{step}</p>
          </div>))}
        </div>

        <div style={{background:`${T.accent}08`,border:`1px solid ${T.accent}30`,borderRadius:12,padding:"12px 14px",marginTop:10,display:"flex",alignItems:"flex-start",gap:10}}>
          <Sparkles size={16} color={T.accent} style={{flexShrink:0,marginTop:2}}/>
          <p style={{fontSize:12,color:T.muted,lineHeight:1.55}}>Once installed, Bitelyze launches fullscreen without the browser bar — just like a native app.</p>
        </div>
      </>)}

      {/* ── Weekly Wrap-Up sub-view ── */}
      {tab==="me"&&moreView==="weeklywrap"&&(<>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingTop:4}}>
          <button onClick={()=>setMoreView(null)} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text}}>Your Week</h2>
        </div>
        <p style={{fontSize:13,color:T.muted,marginBottom:16,paddingLeft:2}}>{weeklyWrap.rangeLabel}</p>

        {weeklyWrap.weekMeals.length===0?(<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"40px 20px",textAlign:"center",boxShadow:T.cardShadow||"none"}}>
          <div style={{width:56,height:56,borderRadius:16,background:`${T.accent}10`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Calendar size={28} color={T.accent}/></div>
          <p style={{fontSize:15,fontWeight:800,marginBottom:6,color:T.text}}>No meals logged this week yet</p>
          <p style={{fontSize:13,color:T.muted,lineHeight:1.5}}>Log a few meals and check back — your weekly recap appears here.</p>
        </div>):(<>
          {/* Big stat card */}
          <div style={{background:`linear-gradient(135deg,${T.accent}15,${T.accent}05)`,border:`1px solid ${T.accent}30`,borderRadius:18,padding:"20px 18px",marginBottom:12,boxShadow:T.cardShadow||"none"}}>
            <p style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",marginBottom:6}}>Average per day</p>
            <p style={{fontSize:32,fontWeight:900,color:T.accent,letterSpacing:"-0.02em",lineHeight:1,marginBottom:6}}>{weeklyWrap.avgCal.toLocaleString()} <span style={{fontSize:14,color:T.muted,fontWeight:600}}>kcal</span></p>
            <p style={{fontSize:13,color:T.text,fontWeight:600}}><span style={{color:T.accent,fontWeight:800}}>{weeklyWrap.onTarget}/7</span> days on target</p>
          </div>

          {/* Streak card */}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:12,display:"flex",alignItems:"center",gap:14,boxShadow:T.cardShadow||"none"}}>
            <div style={{width:46,height:46,borderRadius:14,background:`${T.orange}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Flame size={22} color={T.orange}/></div>
            <div style={{flex:1}}>
              <p style={{fontSize:20,fontWeight:900,color:T.orange,lineHeight:1,letterSpacing:"-0.01em"}}>{stats.streak} day{stats.streak===1?"":"s"}</p>
              <p style={{fontSize:12,color:T.muted,marginTop:3}}>Current streak</p>
            </div>
          </div>

          {/* Best day */}
          {weeklyWrap.bestDay&&(<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:12,boxShadow:T.cardShadow||"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <Trophy size={16} color={T.accent}/>
              <p style={{fontSize:12,color:T.accent,fontWeight:800,textTransform:"uppercase",letterSpacing:".5px"}}>Your best day</p>
            </div>
            <p style={{fontSize:15,fontWeight:800,color:T.text,marginBottom:4}}>{(()=>{try{return parseYMD(weeklyWrap.bestDay.date).toLocaleDateString("en",{weekday:"long",month:"short",day:"numeric"});}catch(e){return weeklyWrap.bestDay.date;}})()}</p>
            <p style={{fontSize:13,color:T.muted,lineHeight:1.5}}>{weeklyWrap.bestDay.cal.toLocaleString()} kcal · {weeklyWrap.bestDay.meals.length} meal{weeklyWrap.bestDay.meals.length===1?"":"s"} · health score {weeklyWrap.bestDay.avgScore.toFixed(1)}/10</p>
          </div>)}

          {/* Health score + days tracked */}
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            <div style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",textAlign:"center",boxShadow:T.cardShadow||"none"}}>
              <Sparkles size={18} color={T.accent} style={{marginBottom:6}}/>
              <p style={{fontSize:20,fontWeight:900,color:T.accent,lineHeight:1}}>{weeklyWrap.avgHealthScore}<span style={{fontSize:12,color:T.muted}}>/10</span></p>
              <p style={{fontSize:11,color:T.muted,marginTop:4,fontWeight:500}}>Avg health score</p>
            </div>
            <div style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",textAlign:"center",boxShadow:T.cardShadow||"none"}}>
              <UtensilsCrossed size={18} color={T.blue} style={{marginBottom:6}}/>
              <p style={{fontSize:20,fontWeight:900,color:T.blue,lineHeight:1}}>{weeklyWrap.weekMeals.length}</p>
              <p style={{fontSize:11,color:T.muted,marginTop:4,fontWeight:500}}>Meals logged</p>
            </div>
          </div>

          {/* Top 3 meals */}
          {weeklyWrap.topMeals.length>0&&(<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:12,boxShadow:T.cardShadow||"none"}}>
            <p style={{fontSize:12,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",marginBottom:12}}>Top meals</p>
            {weeklyWrap.topMeals.map((m,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<weeklyWrap.topMeals.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{width:26,height:26,borderRadius:8,background:`${T.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:T.accent,flexShrink:0}}>{i+1}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13.5,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</p>
                <p style={{fontSize:11,color:T.muted}}>{m.count}× · ~{m.avg} kcal</p>
              </div>
            </div>))}
          </div>)}

          {/* Macros breakdown */}
          {(()=>{const p=weeklyWrap.totalProtein,c=weeklyWrap.totalCarbs,f=weeklyWrap.totalFat;const totalG=p+c+f;if(totalG===0)return null;const pPct=(p/totalG)*100,cPct=(c/totalG)*100,fPct=(f/totalG)*100;return(<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:14,boxShadow:T.cardShadow||"none"}}>
            <p style={{fontSize:12,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",marginBottom:12}}>Macros this week</p>
            <div style={{display:"flex",height:10,borderRadius:6,overflow:"hidden",marginBottom:12,background:T.inputBg}}>
              <div style={{width:`${pPct}%`,background:T.blue}}/>
              <div style={{width:`${cPct}%`,background:T.orange}}/>
              <div style={{width:`${fPct}%`,background:T.accent}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,fontSize:12}}>
              {[["Protein",p,"g",T.blue],["Carbs",c,"g",T.orange],["Fat",f,"g",T.accent],["Fiber",weeklyWrap.totalFiber,"g",T.purple||T.muted]].map(([l,v,u,col])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:2,background:col,flexShrink:0}}/>
                <span style={{color:T.muted,fontWeight:500}}>{l}</span>
                <span style={{marginLeft:"auto",fontWeight:700,color:T.text}}>{v}{u}</span>
              </div>))}
            </div>
          </div>);})()}

          {/* Share Week button */}
          <button onClick={()=>setShowShareCard(true)} className="ripple" style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:T.accent,color:"#000",fontWeight:800,cursor:"pointer",fontFamily:"inherit",fontSize:14,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 16px ${T.accentGlow}`}}><Share2 size={16}/> Share Week</button>
        </>)}
      </>)}

      {/* ── Notifications sub-view ── */}
      {tab==="me"&&moreView==="notifications"&&(<>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingTop:4}}>
          <button onClick={()=>setMoreView(null)} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text}}>Notifications</h2>
        </div>
        <p style={{fontSize:13,color:T.muted,marginBottom:18,paddingLeft:2,lineHeight:1.5}}>Gentle reminders to help you log meals and protect your streak.</p>

        {(()=>{
          const supported=typeof Notification!=="undefined";
          if(!supported)return(<div style={{background:`${T.orange}08`,border:`1px solid ${T.orange}30`,borderRadius:14,padding:"14px 16px",color:T.orange,fontSize:13,display:"flex",alignItems:"center",gap:10}}><AlertTriangle size={16}/> Notifications aren't supported in this browser.</div>);
          const enabled=notifPermission==='granted'&&localStorage.getItem('bitelyze_notif_enabled')==='1';
          const statusLabel=notifPermission==='denied'?"Blocked (change in browser settings)":notifPermission==='granted'?(enabled?"Enabled":"Paused"):"Not enabled";
          const statusColor=notifPermission==='denied'?T.danger:enabled?T.accent:T.muted;
          return(<>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:12,boxShadow:T.cardShadow||"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:40,height:40,borderRadius:12,background:`${T.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bell size={20} color={T.accent}/></div>
                <div style={{flex:1}}>
                  <p style={{fontSize:14,fontWeight:800,color:T.text}}>Meal reminders</p>
                  <p style={{fontSize:12,color:statusColor,fontWeight:600,marginTop:2}}>{statusLabel}</p>
                </div>
                {notifPermission!=='denied'&&(<button onClick={toggleNotifEnabled} style={{width:44,height:26,borderRadius:99,border:"none",background:enabled?T.accent:T.border,cursor:"pointer",position:"relative",transition:"background .2s",fontFamily:"inherit"}}>
                  <span style={{position:"absolute",top:2,left:enabled?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                </button>)}
              </div>
              {notifPermission==='default'&&(<button onClick={requestNotifPermission} style={{width:"100%",padding:"10px",borderRadius:10,border:"none",background:T.accent,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Enable Notifications</button>)}
            </div>

            <p style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",marginBottom:8,paddingLeft:4,marginTop:16}}>What you'll get</p>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:T.cardShadow||"none"}}>
              {[
                {icon:<Sun size={18} color={T.orange}/>,title:"Morning nudge",desc:"8–11am, if you haven't logged breakfast"},
                {icon:<UtensilsCrossed size={18} color={T.blue}/>,title:"Dinner check-in",desc:"6–9pm, with calories remaining today"},
                {icon:<Flame size={18} color={T.danger}/>,title:"Streak rescue",desc:"9–11pm, if your streak is at risk"}
              ].map((item,i,a)=>(<div key={i} style={{padding:"12px 16px",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:32,height:32,borderRadius:10,background:`${T.accent}08`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.icon}</div>
                <div style={{flex:1}}>
                  <p style={{fontSize:13.5,fontWeight:700,color:T.text}}>{item.title}</p>
                  <p style={{fontSize:11.5,color:T.muted,marginTop:2}}>{item.desc}</p>
                </div>
              </div>))}
            </div>

            {notifPermission==='denied'&&(<div style={{background:`${T.orange}08`,border:`1px solid ${T.orange}30`,borderRadius:12,padding:"12px 14px",marginTop:14,display:"flex",alignItems:"flex-start",gap:10}}>
              <Info size={16} color={T.orange} style={{flexShrink:0,marginTop:2}}/>
              <p style={{fontSize:12,color:T.muted,lineHeight:1.55}}>Notifications are blocked. To enable, open your browser's site settings for bitelyze.com and allow notifications.</p>
            </div>)}
          </>);
        })()}
      </>)}

      {/* ── My Profile sub-view (existing Me content) ── */}
      {tab==="me"&&moreView==="profile"&&(<>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingTop:4}}>
          <button onClick={()=>setMoreView(null)} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,borderRadius:10,padding:"8px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center"}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text}}>My Profile</h2>
        </div>
        {/* Profile Completion Reminder (if any optional steps skipped) */}
        {(()=>{
          const skipped=["blockers","habits","planningHabit","motivation"].filter(k=>profile[k]===null);
          if(skipped.length===0||reminderDismissed)return null;
          return(<div style={{background:`${T.accent}10`,border:`1.5px dashed ${T.accent}50`,borderRadius:16,padding:"16px 18px",marginBottom:12,position:"relative"}}>
            <button onClick={()=>{
              try{
                const raw=localStorage.getItem(`bitelyze_skip_reminder_${uid}`);
                const prev=raw?JSON.parse(raw):{count:0};
                const next={count:(prev.count||0)+1,lastDismissed:Date.now()};
                localStorage.setItem(`bitelyze_skip_reminder_${uid}`,JSON.stringify(next));
              }catch(e){}
              setReminderDismissed(true);
            }} style={{position:"absolute",top:6,right:6,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",color:T.muted,cursor:"pointer",fontFamily:"inherit"}}><X size={16}/></button>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,paddingRight:20}}>
              <Sparkles size={18} color={T.accent}/>
              <p style={{fontSize:15,fontWeight:700,color:T.text}}>Unlock better coaching</p>
            </div>
            <p style={{fontSize:13,color:T.muted,lineHeight:1.5,marginBottom:12,paddingRight:20}}>Answer {skipped.length} more question{skipped.length>1?"s":""} to get more personalized tips. Takes 60 seconds.</p>
            <button onClick={()=>setCondensedStepIdx(0)} style={{width:"100%",padding:"10px",borderRadius:10,border:"none",background:T.accent,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6}}>Complete my profile <ArrowRight size={13}/></button>
          </div>);
        })()}

        {/* Profile Hero with gradient */}
        <div style={{background:`${T.accent}08`,border:`1.5px solid ${T.accent}20`,borderRadius:22,padding:"28px 20px",marginBottom:14,textAlign:"center",position:"relative",overflow:"hidden",boxShadow:`0 8px 32px ${T.accent}08`}}>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${T.accent}06,${T.purple}04,${T.blue}06)`,pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:"-50%",left:"50%",transform:"translateX(-50%)",width:300,height:200,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}0a,transparent 70%)`,pointerEvents:"none"}}/>
          <div style={{width:68,height:68,borderRadius:22,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 14px",boxShadow:`0 8px 24px ${T.accentGlow}`,position:"relative"}}><User size={32}/></div>
          <p style={{fontSize:22,fontWeight:900,letterSpacing:"-0.02em",position:"relative"}}>{profile.name}</p>
          <p style={{fontSize:12,color:T.muted,marginTop:4,fontWeight:500,position:"relative"}}>{profile.age} yrs · {profile.gender} · {profile.activity?.replace("_"," ")}</p>
        </div>
        {/* Stats as tappable pills */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {[["Total Meals",allHistory.length,T.accent,<UtensilsCrossed size={18}/>],["Streak",`${stats.streak}d`,T.orange,<Flame size={18}/>],["Badges",`${earned.length}/${BADGES.length}`,T.purple,<Trophy size={18}/>],["Water",`${water}/8`,T.blue,<Droplets size={18}/>]].map(([k,v,c,ic])=>(<div key={k} style={{flex:"1 1 calc(50% - 4px)",background:`${c}08`,border:`1px solid ${c}15`,borderRadius:14,padding:"14px 12px",textAlign:"center",cursor:"pointer",transition:"all .2s"}} className="ripple">
            <span style={{display:"flex",justifyContent:"center",marginBottom:4}}>{ic}</span>
            <span style={{fontSize:18,fontWeight:900,color:c,display:"block",lineHeight:1}}>{v}</span>
            <span style={{fontSize:10,color:T.muted,marginTop:4,display:"block",fontWeight:500}}>{k}</span>
          </div>))}
        </div>
        {/* BMR/TDEE Data Cards */}
        {(()=>{const w=parseFloat(profile.weight)||0,h=parseFloat(profile.height)||0,a=parseFloat(profile.age)||0;const acts={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};const bmr=w&&h&&a?Math.round(profile.gender==="Male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161):0;const tdee=Math.round(bmr*(acts[profile.activity]||1.375));return(
          <Card>
            <CardTitle icon={<BarChart3 size={16} color={T.accent}/>}>Body Metrics</CardTitle>
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
        <Card><CardTitle icon={<User size={16} color={T.accent}/>}>My Profile</CardTitle>{[["Height",`${profile.height} cm`],["Weight",`${profile.weight} kg`],["Target Weight",profile.targetWeight?`${profile.targetWeight} kg`:"Not set"],["Daily Goal",`${goal} kcal`],["Activity",profile.activity?.replace("_"," ")],["Goal",profile.goal?.replace("_"," ")]].map(([k,v],i,a)=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none",fontSize:13}}><span style={{color:T.muted,fontWeight:500}}>{k}</span><span style={{fontWeight:700,color:T.blue,textTransform:"capitalize"}}>{v}</span></div>))}</Card>
        {/* Actions */}
        <button onClick={onEditProfile} className="ripple" style={{width:"100%",padding:"14px",borderRadius:14,border:`1px solid ${T.border}`,background:T.inputBg,color:T.text,fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:14,marginBottom:10,transition:"all .2s",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Pencil size={14}/> Edit Profile</button>
      </>)}
    </div>

    {/* ── Fixed Bottom Tab Bar ── Hidden when coach chat is open */}
    {!coachOpen&&<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:1000,background:theme==="dark"?"rgba(8,8,14,0.94)":"rgba(245,245,248,0.96)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderTop:`1px solid ${T.border}`,paddingBottom:"env(safe-area-inset-bottom)",boxShadow:theme==="dark"?"0 -4px 24px rgba(0,0,0,0.4)":"0 -4px 24px rgba(0,0,0,0.08)"}}>
      <div style={{display:"flex",maxWidth:480,margin:"0 auto",position:"relative",padding:"6px 12px"}}>
        <div style={{position:"absolute",top:6,left:`calc(${activeTabIdx*25}% + 16px)`,width:"calc(25% - 20px)",height:"calc(100% - 12px)",background:`linear-gradient(135deg,${T.accent}18,${T.accent}08)`,borderRadius:12,transition:"left .3s cubic-bezier(0.16,1,0.3,1)",boxShadow:`0 0 12px ${T.accent}15,inset 0 1px 0 rgba(255,255,255,0.04)`,pointerEvents:"none"}}/>
        {[["analyze",<Camera size={20}/>,t("tab.analyze")],["log",<ClipboardList size={20}/>,t("tab.log")],["progress",<BarChart3 size={20}/>,t("tab.progress")],["me",<MoreHorizontal size={20}/>,t("tab.more")]].map(([k,ic,lb])=>(<button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 4px",border:"none",background:"transparent",color:tab===k?T.accent:T.muted,fontWeight:700,cursor:"pointer",borderRadius:12,transition:"all .25s cubic-bezier(0.16,1,0.3,1)",fontFamily:"inherit",position:"relative",zIndex:1,opacity:tab===k?1:0.5,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{display:"inline-block"}}>{ic}</span>
          <span style={{fontSize:10,fontWeight:700,color:tab===k?T.accent:T.muted}}>{lb}</span>
        </button>))}
      </div>
    </div>}
  </div>);}

// Route helpers
const routeMap={"/onboarding":"onboarding","/auth":"auth","/auth/login":"auth-login","/auth/signup":"auth-signup","/setup":"welcome","/dashboard":"app"};
const screenToRoute={"onboarding":"/onboarding","auth":"/auth","auth-login":"/auth/login","auth-signup":"/auth/signup","welcome":"/setup","s1":"/setup","s2":"/setup","s3":"/setup","s4":"/setup","m1":"/setup","s5":"/setup","m2":"/setup","s6":"/setup","s7":"/setup","s8":"/setup","s9":"/setup","compare":"/setup","m3":"/setup","plan":"/setup","app":"/dashboard"};
const navigate=(path)=>{if(window.location.pathname!==path)window.history.pushState(null,"",path);};

export default function App(){
  const[theme,setTheme]=useState(()=>localStorage.getItem("bitelyze_theme")||"dark");
  T=THEMES[theme];
  const toggleTheme=()=>{const next=theme==="dark"?"light":"dark";setTheme(next);localStorage.setItem("bitelyze_theme",next);T=THEMES[next];};
  const[lang,setLangState]=useState(()=>getStoredLang());
  const setLang=(code)=>{setLangState(code);setStoredLang(code);};
  const t=makeT(lang);
  const[authUser,setAuthUser]=useState(undefined);
  const[authResolved,setAuthResolved]=useState(false);
  const[profileLoading,setProfileLoading]=useState(false);
  // Restore screen from localStorage or URL on mount
  const[screen,setScreen]=useState(()=>{
    const saved=localStorage.getItem('bitelyze_screen');
    if(saved&&["welcome","s1","s2","s3","s4","m1","s5","m2","s6","s7","s8","s9","compare","m3","plan","app"].includes(saved))return saved;
    const p=window.location.pathname;
    const mapped=routeMap[p];
    if(mapped==="app")return"app";
    return"welcome";
  });
  const[profile,setProfile]=useState({name:"",age:"",gender:"Male",height:"",weight:"",targetWeight:"",activity:"",goal:"",goalSpeed:0.5,blockers:[],habits:[],planningHabit:"",motivation:""});
  const goal=calcGoal(profile);

  const[onboarded,setOnboarded]=useState(()=>!!localStorage.getItem('bitelyze_onboarded'));
  const[authInitialMode,setAuthInitialMode]=useState(()=>{const p=window.location.pathname;return p==="/auth/login"?"login":"signup";});

  // Save screen to localStorage and sync URL when screen changes
  useEffect(()=>{
    localStorage.setItem('bitelyze_screen',screen);
    if(authResolved){const route=screenToRoute[screen];if(route)navigate(route);}
  },[screen,authResolved]);

  // Handle browser back/forward
  useEffect(()=>{const handler=()=>{const p=window.location.pathname;const s=routeMap[p];if(s==="app"&&authUser)setScreen("app");else if(s==="welcome"&&authUser)setScreen("welcome");};window.addEventListener("popstate",handler);return()=>window.removeEventListener("popstate",handler);},[authUser]);

  useEffect(()=>{const unsub=onAuthStateChanged(auth,async(user)=>{setAuthUser(user||null);if(user){
    setProfileLoading(true);
    // Multiple ways to identify a returning user
    const metadata=user.metadata||{};
    const creationTime=metadata.creationTime?new Date(metadata.creationTime).getTime():0;
    const lastSignInTime=metadata.lastSignInTime?new Date(metadata.lastSignInTime).getTime():0;
    // More than 30 seconds between creation and last sign-in means returning user
    const isReturningByMetadata=creationTime>0&&lastSignInTime>0&&(lastSignInTime-creationTime>30000);
    // Also check the global setup-complete flag (cross-browser via user's Firebase claims-like approach)
    const setupCompleteKey=`setup_complete_${user.uid}`;
    const isSetupCompleteLocal=localStorage.getItem(setupCompleteKey)==="1";

    console.log("[auth] User signed in:",{uid:user.uid,email:user.email,isReturningByMetadata,isSetupCompleteLocal,creationTime:metadata.creationTime,lastSignInTime:metadata.lastSignInTime});

    const saved=await loadProfile(user.uid);
    console.log("[auth] Loaded profile:",saved);

    const hasFullProfile=saved&&saved.height&&saved.weight&&saved.activity&&saved.goal;
    const isReturningUser=isReturningByMetadata||isSetupCompleteLocal||!!saved;

    if(hasFullProfile){
      setProfile(p=>({...p,...saved}));
      try{localStorage.setItem(setupCompleteKey,"1");}catch(e){}
      setScreen("app");
      console.log("[auth] → dashboard (full profile)");
    } else if(isReturningUser){
      // Returning user but profile load incomplete or partial. Send to dashboard anyway.
      if(saved)setProfile(p=>({...p,...saved}));
      else if(user.displayName)setProfile(p=>({...p,name:user.displayName}));
      setScreen("app");
      console.log("[auth] → dashboard (returning user, incomplete load)");
    } else {
      // Genuinely new account — send to setup
      if(user.displayName)setProfile(p=>({...p,name:user.displayName}));
      setScreen("welcome");
      console.log("[auth] → setup flow (new account)");
    }
    setProfileLoading(false);
  }else{
    const p=window.location.pathname;
    if(p==="/auth/login")setAuthInitialMode("login");
    else if(p==="/auth/signup"||p==="/auth")setAuthInitialMode("signup");
    // Clear saved screen on logout
    localStorage.removeItem('bitelyze_screen');
  }setAuthResolved(true);});return unsub;},[]);

  const saveAndContinue=()=>{
    try{localStorage.setItem('bitelyze_screen','app');}catch(e){}
    if(authUser){
      try{localStorage.setItem(`setup_complete_${authUser.uid}`,"1");}catch(e){}
      try{localStorage.setItem("profile_"+authUser.uid,JSON.stringify(profile));}catch(e){}
      try{setDoc(doc(db,"users",authUser.uid,"data","profile"),profile,{merge:true}).catch(()=>{});}catch(e){}
    }
    window.location.assign("/dashboard");
  };

  if(!onboarded){navigate("/onboarding");return(<><style>{GS}</style><Onboarding onDone={(mode)=>{localStorage.setItem('bitelyze_onboarded','1');setAuthInitialMode(mode||"signup");setOnboarded(true);}}/></>);}
  if(authUser===undefined||(authUser&&profileLoading))return(<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><style>{GS}</style><div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"#000"}}><UtensilsCrossed size={24}/></div><div style={{width:32,height:32,border:`3px solid ${T.border}`,borderTop:`3px solid ${T.accent}`,borderRadius:"50%"}} className="spin"/><p style={{fontSize:12,color:T.muted,fontWeight:500}}>{profileLoading?"Loading your profile...":""}</p></div>);
  if(!authUser){navigate(authInitialMode==="login"?"/auth/login":"/auth/signup");return(<><style>{GS}</style><AuthScreen initialMode={authInitialMode}/></>);}
  return(<div style={{fontFamily:"'DM Sans',sans-serif"}}><style>{GS}</style>
    {screen==="welcome"&&<Welcome onNext={()=>setScreen("s1")} uid={authUser?.uid} onExistingProfileFound={(data)=>{setProfile(p=>({...p,...data}));setScreen("app");}}/>}
    {screen==="s1"&&<StepBasic p={profile} setP={setProfile} onNext={()=>setScreen("s2")} onBack={()=>setScreen("welcome")}/>}
    {screen==="s2"&&<StepBody p={profile} setP={setProfile} onNext={()=>setScreen("s3")} onBack={()=>setScreen("s1")}/>}
    {screen==="s3"&&<StepActivity p={profile} setP={setProfile} onNext={()=>setScreen("s4")} onBack={()=>setScreen("s2")}/>}
    {screen==="s4"&&<StepGoal p={profile} setP={setProfile} onNext={()=>setScreen(profile.goal==="maintain"?"m2":"m1")} onBack={()=>setScreen("s3")}/>}
    {screen==="m1"&&<Motivational1 onContinue={()=>setScreen("s5")}/>}
    {screen==="s5"&&<StepGoalSpeed p={profile} setP={setProfile} onNext={()=>setScreen("m2")} onBack={()=>setScreen("m1")}/>}
    {screen==="m2"&&<Motivational2 onContinue={()=>setScreen("s6")}/>}
    {screen==="s6"&&<StepBlockers p={profile} setP={setProfile} onNext={()=>setScreen("s7")} onBack={()=>setScreen(profile.goal==="maintain"?"s4":"m2")} onSkipAll={()=>setScreen("compare")}/>}
    {screen==="s7"&&<StepHabits p={profile} setP={setProfile} onNext={()=>setScreen("s8")} onBack={()=>setScreen("s6")} onSkip={()=>setScreen("s8")}/>}
    {screen==="s8"&&<StepMealPlanning p={profile} setP={setProfile} onNext={()=>setScreen("s9")} onBack={()=>setScreen("s7")} onSkip={()=>setScreen("s9")}/>}
    {screen==="s9"&&<StepMotivation p={profile} setP={setProfile} onNext={()=>setScreen("compare")} onBack={()=>setScreen("s8")} onSkip={()=>setScreen("compare")}/>}
    {screen==="compare"&&<ComparisonSlide onContinue={()=>setScreen("m3")}/>}
    {screen==="m3"&&<Motivational3 onContinue={()=>setScreen("plan")}/>}
    {screen==="plan"&&<PlanReady profile={profile} goal={goal} onStart={saveAndContinue} t={t} isEditing={!!(authUser&&localStorage.getItem(`setup_complete_${authUser.uid}`)==="1")}/>}
    {screen==="app"&&<TrackerApp profile={profile} goal={goal} uid={authUser.uid} onEditProfile={()=>setScreen("s1")} onSignOut={()=>signOut(auth)} theme={theme} toggleTheme={toggleTheme} lang={lang} setLang={setLang} t={t}/>}
  </div>);}
