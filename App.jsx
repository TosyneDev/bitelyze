import { useState, useRef, useEffect } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#08080e", card: "#111118", border: "#1c1c2a",
  accent: "#00e5a0", accentDim: "#00e5a015", accentGlow: "#00e5a035",
  orange: "#ff6b35", orangeDim: "#ff6b3515",
  blue: "#4facfe", blueDim: "#4facfe15",
  purple: "#a78bfa", purpleDim: "#a78bfa15",
  text: "#eeeef5", muted: "#777799", danger: "#ff4757",
};

const GS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#08080e;font-family:'DM Sans',sans-serif}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
  @keyframes pop{0%{transform:scale(0.82);opacity:0}65%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
  @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
  @keyframes badgePop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
  @keyframes ripple{0%{transform:scale(1)}50%{transform:scale(0.95)}100%{transform:scale(1)}}
  .fadeUp{animation:fadeUp .4s ease forwards}
  .fadeIn{animation:fadeIn .35s ease forwards}
  .slideIn{animation:slideIn .32s ease forwards}
  .pop{animation:pop .38s ease forwards}
  .glow:hover{box-shadow:0 0 22px #00e5a038;transform:translateY(-1px)}
  .ripple:active{animation:ripple .2s ease}
  .upload:hover{border-color:#00e5a0!important;background:#00e5a00c!important}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#1c1c2a;border-radius:99px}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcGoal = (p) => {
  if(!p) return 2000;
  const w=parseFloat(p.weight),h=parseFloat(p.height),a=parseFloat(p.age);
  if(!w||!h||!a) return 2000;
  const bmr = p.gender==="Male" ? 10*w+6.25*h-5*a+5 : 10*w+6.25*h-5*a-161;
  const act = {sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};
  const def = {lose_fast:-750,lose:-500,lose_slow:-250,maintain:0,gain:300};
  return Math.round(bmr*(act[p.activity]||1.375)+(def[p.goal]|| -500));
};

const TODAY = new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
const HOUR  = new Date().getHours();

const coachGreeting = (name) => {
  if(HOUR<12) return `Good morning, ${name}! 🌅 Breakfast sets the tone — make it count.`;
  if(HOUR<17) return `Hey ${name}! 🌤️ Midday check-in — how's your eating going?`;
  return `Evening, ${name}! 🌙 Almost done for the day — let's finish strong.`;
};

const coachTips = [
  "💡 Eating slowly helps your brain register fullness — aim for 20 mins per meal.",
  "💡 Protein at breakfast reduces cravings by up to 60% throughout the day.",
  "💡 Drinking water before meals can reduce calorie intake by ~13%.",
  "💡 Your body burns more calories digesting protein than carbs or fat.",
  "💡 Sleep affects hunger hormones — aim for 7–8 hours for best results.",
  "💡 Eating from smaller plates naturally reduces portion sizes.",
];

const BADGES = [
  { id:"first_meal", icon:"🍽️", name:"First Bite",      desc:"Log your first meal",           check:(s)=>s.totalMeals>=1 },
  { id:"hydrated",   icon:"💧", name:"Hydration Hero",  desc:"Hit water goal for the first time",check:(s)=>s.waterGoalHits>=1 },
  { id:"streak3",    icon:"🔥", name:"3-Day Streak",    desc:"Log meals 3 days in a row",      check:(s)=>s.streak>=3 },
  { id:"streak7",    icon:"⚡", name:"Week Warrior",    desc:"7-day logging streak",            check:(s)=>s.streak>=7 },
  { id:"meals10",    icon:"🏅", name:"10 Meals Logged", desc:"Track 10 meals total",            check:(s)=>s.totalMeals>=10 },
  { id:"undergoal",  icon:"🎯", name:"On Target",       desc:"Stay under calorie goal",         check:(s)=>s.daysUnderGoal>=1 },
  { id:"earlybird",  icon:"🌅", name:"Early Bird",      desc:"Log breakfast before 9am",        check:(s)=>s.earlyBreakfast>=1 },
  { id:"coach",      icon:"🧠", name:"Coach's Pet",     desc:"Open the app 5 days running",     check:(s)=>s.streak>=5 },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
const Btn = ({onClick,disabled,children,style={}}) => (
  <button className={disabled?"":"glow ripple"} onClick={onClick} disabled={disabled}
    style={{width:"100%",padding:"14px",borderRadius:13,border:"none",
      background:disabled?"#1c1c2a":`linear-gradient(135deg,${T.accent},#00b87a)`,
      color:disabled?T.muted:"#000",fontWeight:800,fontSize:15,cursor:disabled?"not-allowed":"pointer",
      transition:"all .2s",fontFamily:"inherit",...style}}>
    {children}
  </button>
);

const Card = ({children,style={}}) => (
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:12,...style}}>
    {children}
  </div>
);

const CardTitle = ({icon,children}) => (
  <p style={{fontSize:13,fontWeight:800,marginBottom:12,display:"flex",alignItems:"center",gap:7,color:T.text}}>
    <span>{icon}</span>{children}
  </p>
);

function MacroBar({label,val,max,color}){
  const pct=Math.min((val/max)*100,100);
  return(
    <div style={{marginBottom:9}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
        <span style={{color:T.muted}}>{label}</span>
        <span style={{fontWeight:700,color}}>{val}g</span>
      </div>
      <div style={{height:6,borderRadius:99,background:"#1c1c2a",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width 1s ease"}}/>
      </div>
    </div>
  );
}

function ProgressDots({total,current}){
  return(
    <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:26}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{width:i===current?22:7,height:7,borderRadius:99,
          background:i<=current?T.accent:T.border,transition:"all .3s ease"}}/>
      ))}
    </div>
  );
}

function NumInput({label,value,onChange,unit,placeholder}){
  return(
    <div style={{marginBottom:15}}>
      <p style={{fontSize:11,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>{label}</p>
      <div style={{display:"flex",alignItems:"center",background:"#0e0e16",border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{flex:1,padding:"13px 16px",background:"transparent",border:"none",color:T.text,fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit"}}/>
        {unit&&<span style={{padding:"0 16px",color:T.muted,fontSize:13,fontWeight:600}}>{unit}</span>}
      </div>
    </div>
  );
}

function TextInput({label,value,onChange,placeholder}){
  return(
    <div style={{marginBottom:15}}>
      <p style={{fontSize:11,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>{label}</p>
      <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"13px 16px",background:"#0e0e16",border:`1.5px solid ${T.border}`,borderRadius:12,color:T.text,fontSize:15,outline:"none",fontFamily:"inherit",fontWeight:500}}/>
    </div>
  );
}

function Pulse(){
  return(
    <div style={{textAlign:"center",padding:"28px 0"}}>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:12}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:9,height:9,borderRadius:"50%",background:T.accent,
            animation:`pulse .8s ease-in-out ${i*.2}s infinite`,display:"inline-block"}}/>
        ))}
      </div>
      <p style={{color:T.muted,fontSize:13}}>Analyzing your food with AI…</p>
    </div>
  );
}

function HowToCard({title,icon,steps,tip,open,onToggle}){
  return(
    <div style={{marginBottom:13,borderRadius:13,border:`1.5px solid ${open?T.accent+"55":T.border}`,overflow:"hidden",transition:"border-color .2s"}}>
      <button onClick={onToggle} style={{width:"100%",padding:"11px 15px",background:open?T.accentDim:"#0e0e16",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",fontFamily:"inherit"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <span style={{fontSize:18}}>{icon}</span>
          <span style={{fontSize:12,fontWeight:700,color:open?T.accent:T.muted}}>{title}</span>
        </div>
        <span style={{color:open?T.accent:T.muted,fontSize:16,transition:"transform .25s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>⌄</span>
      </button>
      {open&&(
        <div className="fadeUp" style={{padding:"14px 16px 16px",background:"#0b0b12",borderTop:`1px solid ${T.border}`}}>
          {steps.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:11,marginBottom:i<steps.length-1?13:0,alignItems:"flex-start"}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#000",flexShrink:0,marginTop:2}}>{i+1}</div>
              <div><p style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:2}}>{s.title}</p><p style={{fontSize:12,color:T.muted,lineHeight:1.55}}>{s.desc}</p></div>
            </div>
          ))}
          {tip&&(
            <div style={{marginTop:13,padding:"10px 13px",background:T.orangeDim,border:`1px solid ${T.orange}30`,borderRadius:10,display:"flex",gap:8}}>
              <span style={{fontSize:15}}>💡</span>
              <p style={{fontSize:12,color:"#e8c090",lineHeight:1.55}}>{tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Welcome({onNext}){
  return(
    <div className="fadeIn" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 22px",textAlign:"center",background:T.bg,backgroundImage:`radial-gradient(ellipse at 50% 28%, #00e5a012 0%, transparent 62%)`}}>
      <div className="pop" style={{width:92,height:92,borderRadius:26,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,marginBottom:26,boxShadow:`0 0 52px ${T.accentGlow}`}}>🍽️</div>
      <h1 style={{fontSize:34,fontWeight:900,letterSpacing:"-1px",marginBottom:10,lineHeight:1.15,color:T.text}}>
        Meet <span style={{color:T.accent}}>Bitelyze</span>
      </h1>
      <p style={{color:T.muted,fontSize:14,lineHeight:1.75,maxWidth:290,marginBottom:36}}>
        Your personal AI nutrition coach. Snap meals, track calories, build healthy habits — one bite at a time.
      </p>
      <div style={{width:"100%",maxWidth:330}}>
        {[["📸","Snap food → instant calorie breakdown"],["🧠","AI coach tips personalised to you"],["🏆","Streaks, badges & weekly progress"],["💧","Hydration tracking & meal reminders"]].map(([icon,text])=>(
          <div key={text} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 15px",background:"#0e0e16",border:`1px solid ${T.border}`,borderRadius:12,marginBottom:9,textAlign:"left"}}>
            <span style={{fontSize:19}}>{icon}</span>
            <span style={{fontSize:13,color:"#b8b8d0",fontWeight:500}}>{text}</span>
          </div>
        ))}
        <Btn onClick={onNext} style={{marginTop:14,fontSize:16,padding:"15px"}}>Let's Go →</Btn>
      </div>
    </div>
  );
}

function StepBasic({p,setP,onNext,onBack}){
  const ok=p.name.trim()&&p.age&&parseInt(p.age)>0&&p.gender;
  return(
    <div className="slideIn" style={{minHeight:"100vh",background:T.bg}}>
      <div style={{padding:"20px 22px 16px",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14}}>←</button>
        <ProgressDots total={4} current={0}/>
        <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Let's get to know you</h2>
        <p style={{color:T.muted,fontSize:13}}>Step 1 of 4 — Basic information</p>
      </div>
      <div style={{padding:"24px 22px 40px",maxWidth:480,margin:"0 auto"}}>
        <TextInput label="Your Name" value={p.name} onChange={v=>setP(x=>({...x,name:v}))} placeholder="e.g. Tosyne"/>
        <NumInput label="Age" value={p.age} onChange={v=>setP(x=>({...x,age:v}))} unit="yrs" placeholder="e.g. 28"/>
        <p style={{fontSize:11,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:".7px",fontWeight:700}}>Gender</p>
        <div style={{display:"flex",gap:10,marginBottom:26}}>
          {[["Male","👨"],["Female","👩"]].map(([g,icon])=>(
            <button key={g} onClick={()=>setP(x=>({...x,gender:g}))}
              style={{flex:1,padding:"13px",borderRadius:12,border:`1.5px solid ${p.gender===g?T.accent:T.border}`,
                background:p.gender===g?T.accentDim:"#0e0e16",color:p.gender===g?T.accent:T.text,
                fontWeight:700,fontSize:14,cursor:"pointer",transition:"all .18s",fontFamily:"inherit",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:20}}>{icon}</span>{g}
            </button>
          ))}
        </div>
        <Btn onClick={onNext} disabled={!ok}>Continue →</Btn>
      </div>
    </div>
  );
}

function StepBody({p,setP,onNext,onBack}){
  const [open,setOpen]=useState(null);
  const ok=p.height&&p.weight&&parseFloat(p.height)>0&&parseFloat(p.weight)>0;
  const bmi=p.height&&p.weight?(parseFloat(p.weight)/((parseFloat(p.height)/100)**2)).toFixed(1):null;
  const bmiInfo=bmi?(bmi<18.5?["Underweight",T.blue]:bmi<25?["Healthy ✓",T.accent]:bmi<30?["Overweight",T.orange]:["Obese",T.danger]):null;
  return(
    <div className="slideIn" style={{minHeight:"100vh",background:T.bg}}>
      <div style={{padding:"20px 22px 16px",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14}}>←</button>
        <ProgressDots total={4} current={1}/>
        <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Body Measurements</h2>
        <p style={{color:T.muted,fontSize:13}}>Step 2 of 4 — Used to calculate your BMR</p>
      </div>
      <div style={{padding:"22px 20px 40px",maxWidth:480,margin:"0 auto"}}>
        <NumInput label="Height" value={p.height} onChange={v=>setP(x=>({...x,height:v}))} unit="cm" placeholder="e.g. 170"/>
        <HowToCard icon="📏" title="Don't know your height? Tap here" open={open==="h"} onToggle={()=>setOpen(open==="h"?null:"h")}
          steps={[{title:"Stand against a flat wall",desc:"Shoes off, back/heels/head touching the wall, standing straight."},{title:"Mark the top of your head",desc:"Place a flat book on your head and have someone mark the wall. Measure floor to mark."},{title:"Use your phone",desc:"iPhone Measure app or Google Measure can estimate height using AR camera."},{title:"Visit a pharmacy",desc:"Most pharmacies have a free height/weight station — quick and accurate."}]}
          tip="No tape measure? A standard door is about 200 cm tall — stand next to it for a rough estimate!"/>
        <div style={{marginTop:6}}>
          <NumInput label="Current Weight" value={p.weight} onChange={v=>setP(x=>({...x,weight:v}))} unit="kg" placeholder="e.g. 70"/>
        </div>
        <HowToCard icon="⚖️" title="Don't know your weight? Tap here" open={open==="w"} onToggle={()=>setOpen(open==="w"?null:"w")}
          steps={[{title:"Use a bathroom scale",desc:"Weigh yourself in the morning before eating, with minimal clothing."},{title:"Visit a pharmacy or hospital",desc:"Health centres and pharmacies offer free weighing — most accurate option."},{title:"Use a BMI estimator app",desc:"Apps like 'Smart Scale' can estimate weight from body measurements if no scale available."}]}
          tip="Weigh yourself consistently — same time, same conditions each day gives the best results."/>
        <div style={{marginTop:6}}>
          <NumInput label="Target Weight (optional)" value={p.targetWeight} onChange={v=>setP(x=>({...x,targetWeight:v}))} unit="kg" placeholder="e.g. 65"/>
        </div>
        {bmiInfo&&(
          <div style={{background:bmiInfo[1]+"18",border:`1px solid ${bmiInfo[1]}40`,borderRadius:12,padding:"11px 15px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:T.muted}}>Your current BMI</span>
            <span style={{fontSize:15,fontWeight:800,color:bmiInfo[1]}}>{bmi} — {bmiInfo[0]}</span>
          </div>
        )}
        <Btn onClick={onNext} disabled={!ok}>Continue →</Btn>
      </div>
    </div>
  );
}

function StepActivity({p,setP,onNext,onBack}){
  const opts=[
    {k:"sedentary",l:"Sedentary",d:"Desk job, little or no exercise",i:"🛋️"},
    {k:"light",l:"Lightly Active",d:"Walk sometimes, light exercise 1–3x/week",i:"🚶"},
    {k:"moderate",l:"Moderately Active",d:"Exercise 3–5x per week",i:"🏃"},
    {k:"active",l:"Very Active",d:"Hard training 6–7x/week",i:"🏋️"},
    {k:"very_active",l:"Extremely Active",d:"Physical job + daily training",i:"⚡"},
  ];
  return(
    <div className="slideIn" style={{minHeight:"100vh",background:T.bg}}>
      <div style={{padding:"20px 22px 16px",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14}}>←</button>
        <ProgressDots total={4} current={2}/>
        <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Activity Level</h2>
        <p style={{color:T.muted,fontSize:13}}>Step 3 of 4 — How active are you?</p>
      </div>
      <div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>
        {opts.map(o=>(
          <div key={o.k} onClick={()=>setP(x=>({...x,activity:o.k}))}
            style={{display:"flex",alignItems:"center",gap:13,padding:"13px 15px",marginBottom:9,
              background:p.activity===o.k?T.accentDim:"#0e0e16",
              border:`1.5px solid ${p.activity===o.k?T.accent:T.border}`,
              borderRadius:14,cursor:"pointer",transition:"all .18s"}}>
            <span style={{fontSize:24}}>{o.i}</span>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:700,color:p.activity===o.k?T.accent:T.text,marginBottom:2}}>{o.l}</p>
              <p style={{fontSize:12,color:T.muted}}>{o.d}</p>
            </div>
            {p.activity===o.k&&<span style={{color:T.accent,fontSize:18}}>✓</span>}
          </div>
        ))}
        <Btn onClick={onNext} disabled={!p.activity} style={{marginTop:8}}>Continue →</Btn>
      </div>
    </div>
  );
}

function StepGoal({p,setP,onNext,onBack}){
  const goals=[
    {k:"lose_fast",l:"Lose Weight Fast",d:"−750 kcal/day · ~0.75 kg/week",i:"🔥"},
    {k:"lose",l:"Lose Weight",d:"−500 kcal/day · ~0.5 kg/week",i:"📉",best:true},
    {k:"lose_slow",l:"Lose Gradually",d:"−250 kcal/day · ~0.25 kg/week",i:"🌱"},
    {k:"maintain",l:"Maintain Weight",d:"Eat at maintenance calories",i:"⚖️"},
    {k:"gain",l:"Build Muscle",d:"+300 kcal/day · lean bulk",i:"💪"},
  ];
  return(
    <div className="slideIn" style={{minHeight:"100vh",background:T.bg}}>
      <div style={{padding:"20px 22px 16px",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,fontSize:22,cursor:"pointer",marginBottom:14}}>←</button>
        <ProgressDots total={4} current={3}/>
        <h2 style={{fontSize:22,fontWeight:800,marginBottom:4,color:T.text}}>Your Goal</h2>
        <p style={{color:T.muted,fontSize:13}}>Step 4 of 4 — This sets your daily calorie target</p>
      </div>
      <div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>
        {goals.map(g=>(
          <div key={g.k} onClick={()=>setP(x=>({...x,goal:g.k}))}
            style={{display:"flex",alignItems:"center",gap:13,padding:"13px 15px",marginBottom:9,
              background:p.goal===g.k?T.accentDim:"#0e0e16",
              border:`1.5px solid ${p.goal===g.k?T.accent:T.border}`,
              borderRadius:14,cursor:"pointer",transition:"all .18s"}}>
            <span style={{fontSize:24}}>{g.i}</span>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:700,color:p.goal===g.k?T.accent:T.text,marginBottom:2}}>
                {g.l}{g.best&&<span style={{fontSize:9,background:T.accent,color:"#000",borderRadius:5,padding:"2px 6px",marginLeft:7,fontWeight:800}}>BEST</span>}
              </p>
              <p style={{fontSize:12,color:T.muted}}>{g.d}</p>
            </div>
            {p.goal===g.k&&<span style={{color:T.accent,fontSize:18}}>✓</span>}
          </div>
        ))}
        <Btn onClick={onNext} disabled={!p.goal} style={{marginTop:8}}>Calculate My Plan →</Btn>
      </div>
    </div>
  );
}

function PlanReady({profile,goal,onStart}){
  const p=profile||{};
  const w=parseFloat(p.weight)||0,h=parseFloat(p.height)||0,a=parseFloat(p.age)||0;
  const acts={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};
  const bmr=w&&h&&a?Math.round(p.gender==="Male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161):0;
  const tdee=Math.round(bmr*(acts[p.activity]||1.375));
  const bmi=h>0?(w/((h/100)**2)).toFixed(1):0;
  const bi=bmi<18.5?["Underweight",T.blue]:bmi<25?["Healthy",T.accent]:bmi<30?["Overweight",T.orange]:["Obese",T.danger];
  return(
    <div className="fadeIn" style={{minHeight:"100vh",background:T.bg,backgroundImage:`radial-gradient(ellipse at 50% 10%, #00e5a010 0%, transparent 58%)`,paddingBottom:48}}>
      <div style={{padding:"36px 22px 22px",textAlign:"center"}}>
        <div className="pop" style={{width:76,height:76,borderRadius:22,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 18px",boxShadow:`0 0 40px ${T.accentGlow}`}}>🎯</div>
        <h2 style={{fontSize:26,fontWeight:900,marginBottom:7,color:T.text}}>Your Plan is Ready,<br/><span style={{color:T.accent}}>{p.name}!</span></h2>
        <p style={{color:T.muted,fontSize:13}}>Here are your personalised targets</p>
      </div>
      <div style={{padding:"0 18px",maxWidth:480,margin:"0 auto"}}>
        <div style={{background:`linear-gradient(135deg,#0e1a12,#091410)`,border:`1.5px solid ${T.accent}45`,borderRadius:20,padding:"26px 20px",marginBottom:13,textAlign:"center"}}>
          <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:9}}>Daily Calorie Goal</p>
          <p style={{fontSize:64,fontWeight:900,color:T.accent,lineHeight:1}}>{goal}</p>
          <p style={{fontSize:13,color:T.muted,marginTop:5}}>kcal per day</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:13}}>
          {[["BMR",`${bmr} kcal`,"Calories at rest",T.blue],["TDEE",`${tdee} kcal`,"Maintenance",T.orange],["BMI",bi[0],`${bmi} kg/m²`,bi[1]],["Target",p.targetWeight?`${p.targetWeight} kg`:"—","Goal weight",T.accent]].map(([l,v,s,c])=>(
            <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"13px 15px"}}>
              <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".6px",marginBottom:5}}>{l}</p>
              <p style={{fontSize:16,fontWeight:800,color:c,marginBottom:3}}>{v}</p>
              <p style={{fontSize:11,color:T.muted}}>{s}</p>
            </div>
          ))}
        </div>
        <Card>
          <CardTitle icon="⚗️">Recommended Daily Macros</CardTitle>
          <MacroBar label={`Protein — ${Math.round(goal*.3/4)}g`} val={Math.round(goal*.3/4)} max={200} color={T.blue}/>
          <MacroBar label={`Carbs — ${Math.round(goal*.45/4)}g`} val={Math.round(goal*.45/4)} max={350} color={T.orange}/>
          <MacroBar label={`Fat — ${Math.round(goal*.25/9)}g`} val={Math.round(goal*.25/9)} max={100} color="#ff6b9d"/>
        </Card>
        <Btn onClick={onStart} style={{fontSize:16,padding:"15px"}}>🚀 Start Tracking</Btn>
      </div>
    </div>
  );
}

// ─── WEEKLY CHART ─────────────────────────────────────────────────────────────
function WeeklyChart({weekData,goal}){
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const max=Math.max(goal*1.2,...weekData.map(d=>d.cal||0));
  return(
    <Card>
      <CardTitle icon="📊">7-Day Calorie Trend</CardTitle>
      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100,marginBottom:8}}>
        {days.map((d,i)=>{
          const cal=weekData[i]?.cal||0;
          const h=cal>0?Math.max((cal/max)*92,8):0;
          const over=cal>goal;
          const today=i===new Date().getDay()-1;
          return(
            <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:9,color:cal>0?T.accent:T.muted,fontWeight:700,marginBottom:2}}>{cal>0?cal:""}</div>
              <div style={{width:"100%",height:92,display:"flex",alignItems:"flex-end"}}>
                <div style={{width:"100%",height:`${h}px`,borderRadius:"6px 6px 3px 3px",
                  background:h===0?"#1c1c2a":over?`linear-gradient(180deg,${T.danger},${T.danger}88)`:`linear-gradient(180deg,${T.accent},${T.accent}77)`,
                  transition:"height .8s ease",border:today?`1.5px solid ${T.accent}`:"none"}}/>
              </div>
              <span style={{fontSize:9,color:today?T.accent:T.muted,fontWeight:today?800:500}}>{d}</span>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:14,marginTop:4}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:3,background:T.accent}}/><span style={{fontSize:11,color:T.muted}}>Under goal</span></div>
        <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:3,background:T.danger}}/><span style={{fontSize:11,color:T.muted}}>Over goal</span></div>
      </div>
    </Card>
  );
}

// ─── WATER TRACKER ────────────────────────────────────────────────────────────
function WaterTracker({water,setWater,goal=8}){
  const pct=Math.min((water/goal)*100,100);
  const msgs=["Start hydrating — your body needs it!","Good start! Keep going 💧","Halfway there — great work!","Almost there, push through!","Hydration goal crushed! 🎉"];
  const msgIdx=Math.floor((pct/100)*4);
  return(
    <Card style={{background:`linear-gradient(135deg,#0d1318,#091014)`}}>
      <CardTitle icon="💧">Water Intake</CardTitle>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
        <div style={{position:"relative",width:72,height:72,flexShrink:0}}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#1c1c2a" strokeWidth="7"/>
            <circle cx="36" cy="36" r="30" fill="none" stroke={T.blue} strokeWidth="7"
              strokeDasharray={`${2*Math.PI*30}`}
              strokeDashoffset={`${2*Math.PI*30*(1-pct/100)}`}
              strokeLinecap="round" transform="rotate(-90 36 36)"
              style={{transition:"stroke-dashoffset 0.8s ease"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:15,fontWeight:900,color:T.blue}}>{water}</span>
            <span style={{fontSize:8,color:T.muted}}>/{goal}</span>
          </div>
        </div>
        <div style={{flex:1}}>
          <p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>{water} of {goal} glasses</p>
          <p style={{fontSize:12,color:T.muted,marginBottom:10,lineHeight:1.4}}>{msgs[Math.min(msgIdx,4)]}</p>
          <div style={{display:"flex",gap:8}}>
            <button className="ripple" onClick={()=>setWater(w=>Math.max(0,w-1))}
              style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${T.border}`,background:"#1c1c2a",color:T.muted,fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>−</button>
            <button className="glow ripple" onClick={()=>setWater(w=>Math.min(goal+4,w+1))}
              style={{flex:1,padding:"7px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${T.blue},#2a7fc8)`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Add Glass</button>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:5}}>
        {Array.from({length:goal}).map((_,i)=>(
          <div key={i} onClick={()=>setWater(i+1)}
            style={{flex:1,height:8,borderRadius:99,background:i<water?T.blue:"#1c1c2a",cursor:"pointer",transition:"background .2s"}}/>
        ))}
      </div>
    </Card>
  );
}

// ─── MEAL REMINDERS ───────────────────────────────────────────────────────────
function MealReminders({mealLog}){
  const now=new Date();
  const h=now.getHours();
  const meals=[
    {name:"Breakfast",icon:"🍳",time:"7–9 AM",done:mealLog.some(m=>parseInt(m.time)<9),urgent:h>=7&&h<10},
    {name:"Lunch",icon:"🥘",time:"12–2 PM",done:mealLog.some(m=>parseInt(m.time)>=12&&parseInt(m.time)<15),urgent:h>=12&&h<15},
    {name:"Dinner",icon:"🍲",time:"7–9 PM",done:mealLog.length>=3,urgent:h>=19&&h<21},
  ];
  return(
    <Card>
      <CardTitle icon="⏰">Meal Reminders</CardTitle>
      {meals.map((m,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
          <div style={{width:38,height:38,borderRadius:11,background:m.done?T.accentDim:m.urgent?T.orangeDim:"#1c1c2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,border:`1px solid ${m.done?T.accent:m.urgent?T.orange:T.border}`}}>
            {m.icon}
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:700,color:m.done?T.accent:T.text,marginBottom:2}}>{m.name}</p>
            <p style={{fontSize:11,color:T.muted}}>{m.time}</p>
          </div>
          <div style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,
            background:m.done?T.accentDim:m.urgent?T.orangeDim:"#1c1c2a",
            color:m.done?T.accent:m.urgent?T.orange:T.muted,border:`1px solid ${m.done?T.accent+"40":m.urgent?T.orange+"40":T.border}`}}>
            {m.done?"Logged ✓":m.urgent?"Time to eat!":"Upcoming"}
          </div>
        </div>
      ))}
    </Card>
  );
}

// ─── STREAKS & BADGES ─────────────────────────────────────────────────────────
function StreaksAndBadges({stats}){
  const earned=BADGES.filter(b=>b.check(stats));
  const locked=BADGES.filter(b=>!b.check(stats));
  return(
    <>
      <Card style={{background:`linear-gradient(135deg,#13100a,#1a1208)`,borderColor:T.orange+"40"}}>
        <CardTitle icon="🔥">Current Streak</CardTitle>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{textAlign:"center"}}>
            <p style={{fontSize:52,fontWeight:900,color:T.orange,lineHeight:1}}>{stats.streak}</p>
            <p style={{fontSize:11,color:T.muted}}>day{stats.streak!==1?"s":""}</p>
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>
              {stats.streak===0?"Start your streak today!":`${stats.streak} day${stats.streak>1?"s":""} in a row! 🎉`}
            </p>
            <p style={{fontSize:12,color:T.muted,lineHeight:1.5}}>
              {stats.streak<3?"Log meals 3 days in a row to earn your first streak badge!":stats.streak<7?"Keep going — 7 days earns you Week Warrior! ⚡":"You're unstoppable. Keep the chain alive!"}
            </p>
            <div style={{display:"flex",gap:4,marginTop:10}}>
              {Array.from({length:7}).map((_,i)=>(
                <div key={i} style={{flex:1,height:5,borderRadius:99,background:i<stats.streak%7?T.orange:"#1c1c2a"}}/>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {earned.length>0&&(
        <Card>
          <CardTitle icon="🏆">Badges Earned ({earned.length}/{BADGES.length})</CardTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {earned.map(b=>(
              <div key={b.id} className="pop" style={{textAlign:"center",padding:"10px 6px",background:T.purpleDim,border:`1px solid ${T.purple}40`,borderRadius:12}}>
                <span style={{fontSize:26,display:"block",marginBottom:5}}>{b.icon}</span>
                <p style={{fontSize:10,fontWeight:700,color:T.purple,lineHeight:1.3}}>{b.name}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card style={{opacity:.75}}>
        <CardTitle icon="🔒">Locked Badges ({locked.length})</CardTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {locked.map(b=>(
            <div key={b.id} style={{textAlign:"center",padding:"10px 6px",background:"#1c1c2a",borderRadius:12,border:`1px solid ${T.border}`}}>
              <span style={{fontSize:26,display:"block",marginBottom:5,filter:"grayscale(1)",opacity:.4}}>{b.icon}</span>
              <p style={{fontSize:9,color:T.muted,lineHeight:1.3}}>{b.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// ─── MEAL HISTORY ─────────────────────────────────────────────────────────────
function MealHistory({history,onReuse}){
  const unique=history.filter((m,i,a)=>a.findIndex(x=>x.foodName===m.foodName)===i).slice(0,8);
  if(unique.length===0) return null;
  return(
    <Card>
      <CardTitle icon="🕒">Recent Meals — Tap to Re-log</CardTitle>
      {unique.map((m,i)=>(
        <div key={i} onClick={()=>onReuse(m)}
          style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",
            borderBottom:i<unique.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
          <div>
            <p style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:2}}>{m.foodName}</p>
            <p style={{fontSize:11,color:T.muted}}>{m.servingSize}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,fontWeight:800,color:T.accent}}>{m.totalCalories} kcal</span>
            <span style={{fontSize:11,color:T.muted,background:"#1c1c2a",padding:"3px 9px",borderRadius:20}}>+ Add</span>
          </div>
        </div>
      ))}
    </Card>
  );
}

// ─── COACH BANNER ─────────────────────────────────────────────────────────────
function CoachBanner({name,consumed,goal,streak}){
  const [tipIdx]=useState(()=>Math.floor(Math.random()*coachTips.length));
  const pct=Math.round((consumed/goal)*100);
  let msg="",color=T.accent;
  if(consumed===0){msg=coachGreeting(name);color=T.accent;}
  else if(pct<50){msg=`You've had ${consumed} kcal so far. ${goal-consumed} more to reach your goal today.`;color=T.blue;}
  else if(pct<90){msg=`Almost at your goal! Just ${goal-consumed} kcal left. Smart eating, ${name}! 💪`;color=T.orange;}
  else if(pct<=105){msg=`Goal reached! Great discipline today, ${name}. Rest and recover tonight 🌙`;color=T.accent;}
  else{msg=`You're ${consumed-goal} kcal over today. No worries — just go easy on the next meal.`;color=T.danger;}

  return(
    <div style={{margin:"14px 16px 0",padding:"14px 16px",background:color+"12",border:`1px solid ${color}35`,borderRadius:14}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
        <span style={{fontSize:22,flexShrink:0}}>🧠</span>
        <div>
          <p style={{fontSize:11,fontWeight:700,color,textTransform:"uppercase",letterSpacing:".7px",marginBottom:3}}>Your Coach</p>
          <p style={{fontSize:13,color:T.text,lineHeight:1.55,fontWeight:500}}>{msg}</p>
        </div>
      </div>
      <div style={{padding:"9px 12px",background:"#ffffff08",borderRadius:10,borderLeft:`3px solid ${T.orange}`}}>
        <p style={{fontSize:12,color:"#d0c090",lineHeight:1.5}}>{coachTips[tipIdx]}</p>
      </div>
      {streak>0&&<p style={{fontSize:11,color:T.orange,fontWeight:700,marginTop:8}}>🔥 {streak}-day streak — don't break it!</p>}
    </div>
  );
}

// ─── MAIN TRACKER APP ─────────────────────────────────────────────────────────
function TrackerApp({profile,goal,onEditProfile}){
  const [tab,setTab]=useState("analyze");
  const [image,setImage]=useState(null);
  const [imgB64,setImgB64]=useState(null);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState(null);
  const [textFood,setTextFood]=useState("");
  const [consumed,setConsumed]=useState(0);
  const [mealLog,setMealLog]=useState([]);
  const [allHistory,setAllHistory]=useState([]);
  const [water,setWater]=useState(0);
  const [streak,setStreak]=useState(1);
  const [weekData]=useState(()=>[
    {cal:0},{cal:0},{cal:0},{cal:0},{cal:0},{cal:0},{cal:0}
  ].map((_,i)=>({cal:i<new Date().getDay()-1?Math.floor(Math.random()*(goal*1.1-goal*.6)+goal*.6):0})));
  const fileRef=useRef();

  const todayWeek=[...weekData];
  todayWeek[Math.max(0,new Date().getDay()-1)]={cal:consumed};

  const stats={
    streak,totalMeals:allHistory.length,
    waterGoalHits:water>=8?1:0,
    daysUnderGoal:consumed<=goal&&consumed>0?1:0,
    earlyBreakfast:mealLog.some(m=>parseInt(m.time)<9)?1:0,
  };

  const handleFile=(file)=>{
    if(!file) return;
    const r=new FileReader();
    r.onload=(e)=>{setImage(e.target.result);setImgB64(e.target.result.split(",")[1]);setResult(null);setError(null);};
    r.readAsDataURL(file);
  };

  const analyze=async()=>{
    if(!imgB64&&!textFood) return;
    setLoading(true);setError(null);
    try{
      const content=imgB64
        ?[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgB64}},
          {type:"text",text:`Analyze this food for a ${profile.age}yo ${profile.gender} weighing ${profile.weight}kg. Return ONLY valid JSON no markdown: {"foodName":"...","totalCalories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"servingSize":"...","healthScore":0,"suggestions":[{"icon":"🥗","text":"..."}],"exercises":[{"name":"...","duration":"...","calories":0}]}`}]
        :`Analyze "${textFood}" for a ${profile.age}yo ${profile.gender} weighing ${profile.weight}kg. Return ONLY valid JSON: {"foodName":"...","totalCalories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"servingSize":"...","healthScore":0,"suggestions":[{"icon":"🥗","text":"..."}],"exercises":[{"name":"...","duration":"...","calories":0}]}`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{
          "Content-Type":"application/json",
          "x-api-key":process.env.REACT_APP_ANTHROPIC_KEY,
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true"
        },
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content}]}),
      });
      const data=await res.json();
      const txt=data.content.map(i=>i.text||"").join("");
      setResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setError("Couldn't analyze. Try a clearer image or type the food name.");}
    setLoading(false);
  };

  const logMeal=(meal)=>{
    const m=meal||result;
    if(!m) return;
    const entry={...m,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
    setConsumed(c=>c+m.totalCalories);
    setMealLog(l=>[...l,entry]);
    setAllHistory(h=>[...h,entry]);
    if(!meal){setResult(null);setImage(null);setImgB64(null);setTextFood("");}
  };

  const hc=result?(result.healthScore>=7?T.accent:result.healthScore>=4?T.orange:T.danger):T.accent;
  const rem=goal-consumed;

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",color:T.text}}>
      {/* Header */}
      <div style={{padding:"16px 18px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10,background:"#0c0c13",position:"sticky",top:0,zIndex:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🍽️</div>
        <div style={{flex:1}}>
          <p style={{fontSize:15,fontWeight:800}}>Bitelyze</p>
          <p style={{fontSize:10,color:T.muted}}>{TODAY}</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:T.orangeDim,border:`1px solid ${T.orange}40`,borderRadius:20,padding:"4px 10px"}}>
          <span style={{fontSize:13}}>🔥</span>
          <span style={{fontSize:12,fontWeight:800,color:T.orange}}>{streak}d</span>
        </div>
        <button onClick={onEditProfile} style={{background:"#1a1a28",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>⚙️</button>
      </div>

      {/* Stats bar */}
      <div style={{display:"flex",background:"#0c0c13",borderBottom:`1px solid ${T.border}`}}>
        {[["Goal",goal,T.accent],["Eaten",consumed,T.orange],[rem<0?"Over!":"Left",Math.abs(rem),rem<0?T.danger:T.blue]].map(([l,v,c],i)=>(
          <div key={l} style={{flex:1,padding:"9px 0",textAlign:"center",borderRight:i<2?`1px solid ${T.border}`:"none"}}>
            <span style={{fontSize:16,fontWeight:800,color:c,display:"block"}}>{v}</span>
            <span style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:".5px"}}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{height:4,background:"#1a1a28"}}>
        <div style={{height:"100%",width:`${Math.min((consumed/goal)*100,100)}%`,background:`linear-gradient(90deg,${T.accent},${T.orange})`,transition:"width .8s ease"}}/>
      </div>

      {/* Coach banner */}
      <CoachBanner name={profile.name} consumed={consumed} goal={goal} streak={streak}/>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,margin:"14px 0 0",background:"#0c0c13"}}>
        {[["analyze","📸","Analyze"],["log","📋","Log"],["progress","📊","Progress"],["me","👤","Me"]].map(([k,ic,lb])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{flex:1,padding:"10px 4px",border:"none",background:"transparent",
              color:tab===k?T.accent:T.muted,fontSize:11,fontWeight:700,cursor:"pointer",
              borderBottom:`2px solid ${tab===k?T.accent:"transparent"}`,transition:"all .2s",fontFamily:"inherit"}}>
            {ic} {lb}
          </button>
        ))}
      </div>

      <div style={{padding:"16px 15px 70px",maxWidth:480,margin:"0 auto"}}>

        {/* ── ANALYZE TAB ── */}
        {tab==="analyze"&&(
          <>
            {!image?(
              <div className="upload" onClick={()=>fileRef.current.click()}
                style={{border:`2px dashed ${T.border}`,borderRadius:16,padding:"28px 18px",textAlign:"center",cursor:"pointer",background:"#0e0e16",marginBottom:11,transition:"all .2s"}}>
                <span style={{fontSize:34,display:"block",marginBottom:9}}>📷</span>
                <p style={{fontWeight:700,fontSize:14,marginBottom:3}}>Snap or upload your meal</p>
                <p style={{fontSize:12,color:T.muted}}>JPG or PNG • or type food name below</p>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
              </div>
            ):(
              <div style={{position:"relative",marginBottom:11}}>
                <img src={image} alt="food" style={{width:"100%",borderRadius:14,maxHeight:230,objectFit:"cover",border:`1px solid ${T.border}`}}/>
                <button onClick={()=>{setImage(null);setImgB64(null);setResult(null);}}
                  style={{position:"absolute",top:10,right:10,background:"#00000088",border:"none",color:"#fff",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✕</button>
              </div>
            )}
            {!image&&(
              <input style={{width:"100%",padding:"12px 15px",background:"#0e0e16",border:`1.5px solid ${T.border}`,borderRadius:12,color:T.text,fontSize:14,outline:"none",marginBottom:11,fontFamily:"inherit"}}
                placeholder="Or type food name, e.g. 'Grilled chicken with rice'…"
                value={textFood} onChange={e=>setTextFood(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()}/>
            )}
            <Btn onClick={analyze} disabled={!image&&!textFood}>{loading?"Analyzing…":"🔍 Analyze Calories"}</Btn>

            {loading&&<Pulse/>}
            {error&&<div style={{background:"#1a0f0f",border:`1px solid ${T.danger}40`,borderRadius:12,padding:"11px 15px",marginTop:13,color:T.danger,fontSize:13}}>⚠️ {error}</div>}

            {result&&!loading&&(
              <div className="fadeUp" style={{marginTop:16}}>
                <div style={{background:`linear-gradient(135deg,#111a12,#0a1410)`,border:`1.5px solid ${T.accent}40`,borderRadius:16,padding:"17px",marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:13}}>
                    <div><p style={{fontSize:17,fontWeight:800,marginBottom:3}}>{result.foodName}</p><p style={{fontSize:12,color:T.muted}}>{result.servingSize}</p></div>
                    <div style={{textAlign:"center",background:hc+"22",border:`1px solid ${hc}40`,borderRadius:10,padding:"5px 11px"}}>
                      <span style={{fontSize:17,fontWeight:900,color:hc,display:"block"}}>{result.healthScore}/10</span>
                      <span style={{fontSize:9,color:T.muted,textTransform:"uppercase"}}>Health</span>
                    </div>
                  </div>
                  <div style={{textAlign:"center",padding:"11px 0",borderTop:`1px solid ${T.border}`}}>
                    <span style={{fontSize:50,fontWeight:900,color:T.accent}}>{result.totalCalories}</span>
                    <span style={{fontSize:13,color:T.muted,marginLeft:5}}>kcal</span>
                  </div>
                </div>
                <Card>
                  <CardTitle icon="⚗️">Macronutrients</CardTitle>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",marginBottom:11}}>
                    {[["Protein",result.protein,T.blue],["Carbs",result.carbs,T.orange],["Fat",result.fat,"#ff6b9d"],["Fiber",result.fiber,T.accent]].map(([l,v,c])=>(
                      <div key={l} style={{textAlign:"center"}}><span style={{fontSize:18,fontWeight:800,color:c,display:"block"}}>{v}g</span><span style={{fontSize:10,color:T.muted}}>{l}</span></div>
                    ))}
                  </div>
                  <MacroBar label="Protein" val={result.protein} max={150} color={T.blue}/>
                  <MacroBar label="Carbs" val={result.carbs} max={300} color={T.orange}/>
                </Card>
                <Card>
                  <CardTitle icon="💡">Coach Suggestions</CardTitle>
                  {result.suggestions?.map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:9,padding:"8px 0",borderBottom:i<result.suggestions.length-1?`1px solid ${T.border}`:"none"}}>
                      <span style={{fontSize:16}}>{s.icon}</span>
                      <span style={{fontSize:13,lineHeight:1.55,color:"#c8c8e0"}}>{s.text}</span>
                    </div>
                  ))}
                </Card>
                <Card>
                  <CardTitle icon="🏋️">Burn It Off</CardTitle>
                  {result.exercises?.map((e,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<result.exercises.length-1?`1px solid ${T.border}`:"none"}}>
                      <div><p style={{fontSize:13,fontWeight:600,marginBottom:1}}>{e.name}</p><p style={{fontSize:11,color:T.muted}}>{e.duration}</p></div>
                      <span style={{fontSize:12,color:T.orange,fontWeight:700}}>−{e.calories} kcal</span>
                    </div>
                  ))}
                </Card>
                <div style={{display:"flex",gap:9}}>
                  <Btn onClick={()=>logMeal()} style={{flex:1,width:"auto"}}>✅ Log Meal</Btn>
                  <button onClick={()=>{setResult(null);setImage(null);setImgB64(null);setTextFood("");}}
                    style={{padding:"13px 15px",borderRadius:12,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>✕</button>
                </div>
              </div>
            )}

            <div style={{marginTop:16}}>
              <MealHistory history={allHistory} onReuse={(m)=>{logMeal(m);}}/>
            </div>
          </>
        )}

        {/* ── LOG TAB ── */}
        {tab==="log"&&(
          <>
            <Card style={{textAlign:"center"}}>
              <p style={{fontSize:12,color:T.muted,marginBottom:10}}>Today's Progress</p>
              <div style={{position:"relative",display:"inline-block",marginBottom:13}}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" fill="none" stroke="#1c1c2a" strokeWidth="9"/>
                  <circle cx="55" cy="55" r="46" fill="none" stroke={T.accent} strokeWidth="9"
                    strokeDasharray={`${2*Math.PI*46}`}
                    strokeDashoffset={`${2*Math.PI*46*(1-Math.min(consumed/goal,1))}`}
                    strokeLinecap="round" transform="rotate(-90 55 55)"
                    style={{transition:"stroke-dashoffset 1s ease"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:20,fontWeight:900,color:T.accent}}>{Math.round(Math.min((consumed/goal)*100,100))}%</span>
                  <span style={{fontSize:9,color:T.muted}}>of goal</span>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:24}}>
                {[["Eaten",consumed,T.accent],["Goal",goal,T.blue],[rem<0?"Over!":"Left",Math.abs(rem),rem<0?T.danger:T.orange]].map(([l,v,c])=>(
                  <div key={l}><span style={{fontSize:15,fontWeight:800,color:c,display:"block"}}>{v}</span><span style={{fontSize:9,color:T.muted,textTransform:"uppercase"}}>{l}</span></div>
                ))}
              </div>
            </Card>

            <WaterTracker water={water} setWater={setWater}/>
            <MealReminders mealLog={mealLog}/>

            {mealLog.length===0?(
              <div style={{textAlign:"center",padding:"24px 0",color:T.muted}}>
                <span style={{fontSize:38,display:"block",marginBottom:11}}>🍽️</span>
                <p style={{fontSize:14,marginBottom:14}}>No meals logged yet.<br/>Analyze your first meal!</p>
                <button onClick={()=>setTab("analyze")} style={{padding:"11px 22px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${T.accent},#00b87a)`,color:"#000",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📸 Analyze Food</button>
              </div>
            ):(
              <Card>
                <CardTitle icon="🍴">Meals Today</CardTitle>
                {mealLog.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<mealLog.length-1?`1px solid ${T.border}`:"none"}}>
                    <div><p style={{fontSize:13,fontWeight:600,marginBottom:2}}>{m.foodName}</p><p style={{fontSize:11,color:T.muted}}>{m.time}</p></div>
                    <span style={{fontSize:13,fontWeight:800,color:T.accent}}>{m.totalCalories} kcal</span>
                  </div>
                ))}
              </Card>
            )}
          </>
        )}

        {/* ── PROGRESS TAB ── */}
        {tab==="progress"&&(
          <>
            <WeeklyChart weekData={todayWeek} goal={goal}/>
            <StreaksAndBadges stats={stats}/>
          </>
        )}

        {/* ── ME TAB ── */}
        {tab==="me"&&(
          <>
            <div style={{background:`linear-gradient(135deg,#0e1a12,#091410)`,border:`1.5px solid ${T.accent}30`,borderRadius:16,padding:"20px",marginBottom:12,textAlign:"center"}}>
              <div style={{width:60,height:60,borderRadius:18,background:`linear-gradient(135deg,${T.accent},#00b87a)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 11px"}}>{profile.gender==="Male"?"👨":"👩"}</div>
              <p style={{fontSize:20,fontWeight:800}}>{profile.name}</p>
              <p style={{fontSize:12,color:T.muted,marginTop:3}}>{profile.age} yrs · {profile.gender}</p>
            </div>
            <Card>
              <CardTitle icon="👤">My Profile</CardTitle>
              {[["Height",`${profile.height} cm`],["Weight",`${profile.weight} kg`],["Target Weight",profile.targetWeight?`${profile.targetWeight} kg`:"Not set"],["Daily Goal",`${goal} kcal`],["Activity",profile.activity?.replace("_"," ")],["Goal",profile.goal?.replace("_"," ")]].map(([k,v],i,a)=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none",fontSize:13}}>
                  <span style={{color:T.muted}}>{k}</span>
                  <span style={{fontWeight:700,color:T.blue,textTransform:"capitalize"}}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle icon="📈">My Stats</CardTitle>
              {[["Total Meals Logged",allHistory.length],["Current Streak",`${streak} day${streak!==1?"s":""}`],["Badges Earned",`${BADGES.filter(b=>b.check(stats)).length} / ${BADGES.length}`],["Water Today",`${water} glasses`]].map(([k,v],i,a)=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none",fontSize:13}}>
                  <span style={{color:T.muted}}>{k}</span>
                  <span style={{fontWeight:700,color:T.accent}}>{v}</span>
                </div>
              ))}
            </Card>
            <button onClick={onEditProfile} style={{width:"100%",padding:"13px",borderRadius:12,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>✏️ Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("welcome");
  const [profile,setProfile]=useState({name:"",age:"",gender:"Male",height:"",weight:"",targetWeight:"",activity:"",goal:""});
  const goal=calcGoal(profile);

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif"}}>
      <style>{GS}</style>
      {screen==="welcome" &&<Welcome onNext={()=>setScreen("s1")}/>}
      {screen==="s1"      &&<StepBasic p={profile} setP={setProfile} onNext={()=>setScreen("s2")} onBack={()=>setScreen("welcome")}/>}
      {screen==="s2"      &&<StepBody  p={profile} setP={setProfile} onNext={()=>setScreen("s3")} onBack={()=>setScreen("s1")}/>}
      {screen==="s3"      &&<StepActivity p={profile} setP={setProfile} onNext={()=>setScreen("s4")} onBack={()=>setScreen("s2")}/>}
      {screen==="s4"      &&<StepGoal  p={profile} setP={setProfile} onNext={()=>setScreen("plan")} onBack={()=>setScreen("s3")}/>}
      {screen==="plan"    &&<PlanReady profile={profile} goal={goal} onStart={()=>setScreen("app")}/>}
      {screen==="app"     &&<TrackerApp profile={profile} goal={goal} onEditProfile={()=>setScreen("s1")}/>}
    </div>
  );
}
