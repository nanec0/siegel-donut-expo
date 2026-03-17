// Full DonutKDS component — see artifacts in Claude conversation for annotated version
// This is the production-ready version with all QA fixes applied

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WARN_SECS = 600;
const COLUMNS = [
  { id:"PENDING",    label:"PENDING",        sub:"FOH Queue",                   accent:"#ff2d78", glow:"rgba(255,45,120,0.35)",  dot:"#ff2d78" },
  { id:"PROCESSING", label:"PROCESSING",     sub:"Decorating / Proofing",       accent:"#ff9f0a", glow:"rgba(255,159,10,0.35)",  dot:"#ff9f0a" },
  { id:"READY",      label:"READY / STAGED", sub:"Spare Wall · Awaiting Pickup",accent:"#30d158", glow:"rgba(48,209,88,0.35)",   dot:"#30d158" },
];
const EXPO_OPTIONS = [
  { id:"local", label:"Stock Local",       icon:"🍩", color:"#ff2d78" },
  { id:"deco",  label:"Decoración",        icon:"🎨", color:"#bf5af2" },
  { id:"prod",  label:"Producción / JIRA", icon:"🏭", color:"#ff9f0a" },
];
const SAMPLE = [
  { id:"ORD-001", qty:12, name:"Raspberry Filled",  col:"PENDING",    elapsed:45,  expoDestination:null },
  { id:"ORD-002", qty:6,  name:"Classic Glazed",    col:"PENDING",    elapsed:120, expoDestination:null },
  { id:"ORD-003", qty:24, name:"Chocolate Frosted", col:"PENDING",    elapsed:600, expoDestination:null },
  { id:"ORD-004", qty:3,  name:"Maple Bacon",       col:"PROCESSING", elapsed:240, expoDestination:EXPO_OPTIONS[0] },
  { id:"ORD-005", qty:18, name:"Matcha Dream",      col:"PROCESSING", elapsed:580, expoDestination:EXPO_OPTIONS[1] },
  { id:"ORD-006", qty:9,  name:"Strawberry Burst",  col:"READY",      elapsed:90,  expoDestination:EXPO_OPTIONS[0] },
];
const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [ref, handler]);
}

const ExpoPopover = ({ anchorRect, onSelect, onClose }) => {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  const top = anchorRect ? anchorRect.bottom + 8 : 100;
  const left = anchorRect ? anchorRect.left : 100;
  return (
    <motion.div ref={ref} initial={{opacity:0,scale:.9,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.9,y:-8}} transition={{duration:.15}}
      style={{position:"fixed",top,left,zIndex:200,background:"#1a1a2e",border:"1.5px solid #ff2d78",borderRadius:14,padding:10,minWidth:220,boxShadow:"0 8px 32px rgba(0,0,0,.8)",display:"flex",flexDirection:"column",gap:6}}>
      <div style={{fontSize:10,color:"#888",letterSpacing:1,paddingLeft:6,paddingBottom:2}}>EXPO DECISION — WHERE DOES IT GO?</div>
      {EXPO_OPTIONS.map(opt => (
        <button key={opt.id} onClick={() => onSelect(opt)}
          style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,background:"#0d0d1a",border:`1px solid ${opt.color}44`,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13}}>
          <span style={{fontSize:18}}>{opt.icon}</span><span style={{color:opt.color}}>{opt.label}</span>
        </button>
      ))}
      <button onClick={onClose} style={{padding:"7px 0",borderRadius:10,background:"none",border:"none",color:"#555",fontSize:12,cursor:"pointer"}}>Cancel</button>
    </motion.div>
  );
};

const TicketCard = ({ ticket, colAccent, colGlow, onStart, onReady, onBump }) => {
  const [showExpo, setShowExpo] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const btnRef = useRef(null);
  const isUrgent = ticket.elapsed >= WARN_SECS;
  const timerColor = isUrgent ? "#ff453a" : "#aaa";
  return (
    <>
      <motion.div layout initial={{opacity:0,y:20,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,scale:.92}} transition={{type:"spring",stiffness:380,damping:30}}
        style={{background:"#0d0d1a",border:`1.5px solid ${isUrgent?"#ff453a":colAccent}`,boxShadow:isUrgent?"0 0 18px rgba(255,69,58,.4)":`0 0 18px ${colGlow}`,borderRadius:16,padding:"14px 14px 12px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:11,color:"#666",letterSpacing:1,fontWeight:600}}>{ticket.id}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:2}}>
              <span style={{fontSize:28,fontWeight:900,color:colAccent,lineHeight:1}}>{ticket.qty}×</span>
              <span style={{fontSize:14,fontWeight:700,color:"#f0f0f0"}}>{ticket.name}</span>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
            <span style={{fontSize:13,fontFamily:"monospace",fontWeight:700,color:timerColor}}>{fmt(ticket.elapsed)}</span>
            {isUrgent && <motion.span animate={{opacity:[1,.4,1]}} transition={{repeat:Infinity,duration:1}} style={{fontSize:10,color:"#ff453a",fontWeight:700}}>⚠ LATE</motion.span>}
          </div>
        </div>
        {ticket.expoDestination && (
          <div style={{display:"flex",alignItems:"center",gap:6,background:`${ticket.expoDestination.color}1a`,border:`1px solid ${ticket.expoDestination.color}44`,borderRadius:8,padding:"4px 10px"}}>
            <span style={{fontSize:14}}>{ticket.expoDestination.icon}</span>
            <span style={{fontSize:11,fontWeight:700,color:ticket.expoDestination.color}}>{ticket.expoDestination.label}</span>
          </div>
        )}
        <div style={{display:"flex",gap:7}}>
          {ticket.col==="PENDING" && <button ref={btnRef} onClick={() => { setAnchorRect(btnRef.current?.getBoundingClientRect()); setShowExpo(true); }} style={{flex:1,padding:"8px 0",borderRadius:10,background:"#ff2d78",border:"none",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer"}}>START ▾</button>}
          {ticket.col==="PROCESSING" && <button onClick={() => onReady(ticket.id)} style={{flex:1,padding:"8px 0",borderRadius:10,background:"#30d158",border:"none",color:"#0d0d1a",fontWeight:800,fontSize:12,cursor:"pointer"}}>READY ✓</button>}
          {ticket.col==="READY" && <button onClick={() => onBump(ticket.id)} style={{flex:1,padding:"8px 0",borderRadius:10,background:"#0a84ff",border:"none",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer"}}>BUMP → REVEL</button>}
        </div>
      </motion.div>
      <AnimatePresence>{showExpo && <ExpoPopover anchorRect={anchorRect} onSelect={(opt) => { setShowExpo(false); onStart(ticket.id, opt); }} onClose={() => setShowExpo(false)}/>}</AnimatePresence>
    </>
  );
};

const Toast = ({ msg, color="#30d158" }) => (
  <motion.div initial={{opacity:0,y:30,x:"-50%"}} animate={{opacity:1,y:0,x:"-50%"}} exit={{opacity:0,y:30,x:"-50%"}}
    style={{position:"fixed",bottom:24,left:"50%",background:"#1a1a2e",border:`1px solid ${color}`,borderRadius:14,padding:"10px 20px",color:"#fff",fontWeight:700,fontSize:13,boxShadow:`0 0 20px ${color}66`,zIndex:200,whiteSpace:"nowrap"}}>
    {msg}
  </motion.div>
);

export default function DonutKDS() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(SAMPLE);
  const [showWaste, setShowWaste] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setTickets(ts => ts.map(t => ({...t, elapsed: t.elapsed+1}))), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const showToast = useCallback((msg, color) => {
    setToast({msg,color});
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const handleStart = useCallback((id, opt) => {
    setTickets(ts => ts.map(t => t.id===id ? {...t,col:"PROCESSING",elapsed:0,expoDestination:opt} : t));
    showToast(`🚀 Moved to PROCESSING → ${opt.label}`, opt.color);
  }, [showToast]);

  const handleReady = useCallback((id) => {
    setTickets(ts => ts.map(t => t.id===id ? {...t,col:"READY",elapsed:0} : t));
    showToast("✅ Staged on spare wall!", "#30d158");
  }, [showToast]);

  const handleBump = useCallback((id) => {
    let bumpedId = id;
    setTickets(ts => { const t = ts.find(x => x.id===id); if(t) bumpedId=t.id; return ts.filter(x => x.id!==id); });
    setTimeout(() => showToast(`📡 ${bumpedId} bumped to Revel ✓`, "#0a84ff"), 0);
  }, [showToast]);

  const colTickets = useMemo(() => {
    const map = {PENDING:[],PROCESSING:[],READY:[]};
    tickets.forEach(t => { if(map[t.col]) map[t.col].push(t); });
    return map;
  }, [tickets]);

  return (
    <div style={{minHeight:"100vh",background:"#060610",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",padding:16,boxSizing:"border-box"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>🍩</span>
          <div>
            <div style={{fontWeight:900,fontSize:18,color:"#fff"}}>Donut KDS <span style={{marginLeft:8,fontSize:11,color:"#ff2d78",background:"#ff2d7822",border:"1px solid #ff2d7855",borderRadius:6,padding:"2px 8px"}}>PINK BOX</span></div>
            <div style={{fontSize:11,color:"#555"}}>Kitchen Display System · Siegel Companies</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={() => navigate("/foh")} style={{background:"none",border:"1px solid #333",color:"#aaa",borderRadius:10,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>← FOH</button>
          <button onClick={() => navigate("/expo")} style={{background:"none",border:"1px solid #333",color:"#aaa",borderRadius:10,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>Expo →</button>
          <motion.div animate={{opacity:[1,0,1]}} transition={{repeat:Infinity,duration:1.6}} style={{width:7,height:7,borderRadius:"50%",background:"#30d158"}}/>
          <span style={{color:"#30d158",fontSize:12,fontWeight:700}}>LIVE</span>
          <motion.button whileTap={{scale:.95}} onClick={() => setShowWaste(true)}
            style={{background:"#ff2d78",border:"none",color:"#fff",fontWeight:800,fontSize:13,padding:"10px 18px",borderRadius:12,cursor:"pointer",boxShadow:"0 0 20px rgba(255,45,120,.5)"}}>
            🗑 REPORT WASTE
          </motion.button>
        </div>
      </div>
      <div style={{display:"flex",gap:14}}>
        {COLUMNS.map(col => {
          const ts = colTickets[col.id];
          const urgent = ts.filter(t => t.elapsed >= WARN_SECS).length;
          return (
            <div key={col.id} style={{flex:1,background:"#0d0d1a",border:`1px solid ${col.accent}44`,borderRadius:20,padding:16,boxShadow:`0 0 30px ${col.glow}`}}>
              <div style={{borderBottom:`1px solid ${col.accent}33`,paddingBottom:12,marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <motion.div animate={{boxShadow:[`0 0 6px ${col.dot}`,`0 0 14px ${col.dot}`,`0 0 6px ${col.dot}`]}} transition={{repeat:Infinity,duration:2}} style={{width:10,height:10,borderRadius:"50%",background:col.dot}}/>
                    <span style={{fontWeight:900,fontSize:14,color:col.accent,letterSpacing:1}}>{col.label}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {urgent > 0 && <motion.span animate={{opacity:[1,.4,1]}} transition={{repeat:Infinity,duration:1.2}} style={{fontSize:11,background:"#ff453a22",color:"#ff453a",fontWeight:700,borderRadius:6,padding:"2px 7px"}}>{urgent} LATE</motion.span>}
                    <span style={{fontSize:12,background:`${col.accent}22`,color:col.accent,fontWeight:700,borderRadius:8,padding:"3px 10px"}}>{ts.length}</span>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#555",marginTop:4,marginLeft:18}}>{col.sub}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,overflowY:"auto",maxHeight:"calc(100vh - 200px)"}}>
                <AnimatePresence mode="popLayout">
                  {ts.length === 0
                    ? <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:"center",padding:"40px 0",color:"#333",fontSize:13}}><div style={{fontSize:28,marginBottom:8}}>🍩</div>Queue empty</motion.div>
                    : ts.map(t => <TicketCard key={t.id} ticket={t} colAccent={col.accent} colGlow={col.glow} onStart={handleStart} onReady={handleReady} onBump={handleBump}/>)
                  }
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
      <AnimatePresence>{toast && <Toast key={toast.msg} msg={toast.msg} color={toast.color}/>}</AnimatePresence>
    </div>
  );
}
