"use client";
import { useEffect, useRef, useState } from "react";
const roster = [
  { name: "ASH", role: "VANGUARD", cost: 10, x: 238, icon: "blade" },
  { name: "BASTION", role: "DEFENDER", cost: 18, x: 526, icon: "shield" },
  { name: "KESTREL", role: "SNIPER", cost: 14, x: 814, icon: "aim" },
  { name: "LUMEN", role: "CASTER", cost: 20, x: 1101, icon: "staff" },
  { name: "SUTURE", role: "MEDIC", cost: 16, x: 1389, icon: "medic" },
];
function Icon({name, ...props}: {name: string; className?: string}) {
  const shapes: Record<string, React.ReactNode> = {
    blade: <><path d="m4 29 21-24-7 18-14 6Zm9 2L33 8l-6 17-14 6Z"/><path d="m1 34 9-11m8 12 8-10"/></>,
    shield: <><path d="M18 3 32 8v14c0 6-14 13-14 13S4 28 4 22V8l14-5Z"/><path d="M18 7v23M8 11v11l7 6"/></>,
    aim: <><circle cx="18" cy="18" r="12"/><path d="M18 0v12m0 12v12M0 18h12m12 0h12"/><circle cx="18" cy="18" r="2"/></>,
    staff: <><path d="m8 8 23 25M3 7l4-5 8 3 2 7-6 5-7-4-1-6Zm4-5 4 15M3 7l12-2"/></>,
    medic: <path d="M12 2h12v10h10v12H24v10H12V24H2V12h10V2Z"/>,
    tower: <path d="M7 2h5v6h4V2h5v6h4V2h5v12l-5 3v10l6 7H5l6-7V17l-4-3V2Z"/>,
    enemy: <><path d="m3 2 4 12 11 5 11-5 4-12-12 9h-6L3 2Z"/><path d="m9 18 9 5 9-5-1 10-8 6-8-6-1-10Zm5 7h1m6 0h1M18 29v7"/></>,
  };
  return <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" {...props}>{shapes[name] || shapes.aim}</svg>;
}
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<any>(null);
  const [state, setState] = useState<any>({ dp: 24, kills: 0, lives: 8, deployed: 3, active: [0,1,2], selected: -1, phase: "loading", speed: 1, sound: false, unit: null, wave: 1, elapsed: 0, toast: "", cooldowns: [0,0,0,0,0] });
  const [help, setHelp] = useState(false);
  useEffect(() => {
    let disposed = false;
    let instance: any;
    import("../lib/game.mjs").then(({ createGame }) => {
      if(disposed || !canvasRef.current) return;
      instance = createGame(canvasRef.current, setState);
      engine.current = instance;
    });
    return () => { disposed = true; instance?.destroy(); };
  }, []);
  function action(name: string, ...args: any[]) { engine.current?.[name](...args); }
  function openHelp() { if(state.phase === "running") action("pause"); setHelp(true); }
  return <main className="command-room"><div className="game-shell">
    <section className="battle-stage" aria-label="Sector 01 tactical battlefield">
      <canvas ref={canvasRef} width="1672" height="941" aria-label="Battlefield. Select an operator card and click a highlighted tile to deploy." tabIndex={0}/>
      <header className="battle-header">
        <div className="sector"><span/><div><h1>SECTOR 01</h1><p>CHECKPOINT</p></div><div className="stripes"/></div>
        <div className="battle-counters"><Icon name="enemy" className="enemy-icon"/><strong>{state.kills} <span>/ 35</span></strong><i/><Icon name="tower" className="tower-icon"/><span className="lives-label">LIVES</span><strong className={state.lives < 3 ? "danger" : ""}>{state.lives}</strong></div>
        <div className="battle-controls"><button onClick={() => action("speed")} title="Change game speed" aria-label={`Game speed ${state.speed} times`}>{state.speed}×</button><button onClick={() => action("pause")} aria-label={state.phase === "paused" ? "Resume operation" : "Pause operation"}>{state.phase === "paused" ? "▶" : "Ⅱ"}</button></div>
      </header>
      <div className="field-status"><span className={state.phase === "running" ? "live-dot" : ""}/><span>{state.phase === "paused" ? "TACTICAL PAUSE" : "OPERATION LIVE"}</span><b>WAVE {state.wave} / 3</b></div>
      {state.toast && <div className="field-toast" role="status">{state.toast}</div>}
      {state.selected >= 0 && <aside className="operator-panel">
        <div className="panel-eyebrow">{state.unit ? "OPERATOR STATUS" : "DEPLOY OPERATOR"}<button onClick={() => action("select", -1)} aria-label="Close operator details">×</button></div>
        <div className="panel-name"><Icon name={roster[state.selected].icon}/><div><h2>{roster[state.selected].name}</h2><span>{roster[state.selected].role}</span></div><b>◆ {roster[state.selected].cost}</b></div>
        <p>{state.description}</p>
        {state.unit ? <><div className="health-caption"><span>HP</span><b>{Math.ceil(state.unit.hp)} / {state.unit.maxHp}</b></div><div className="health-track"><i style={{width:`${state.unit.hp / state.unit.maxHp * 100}%`}}/></div><button className={`skill-button ${state.unit.sp >= 100 ? "ready" : ""}`} disabled={state.unit.sp < 100 || state.phase !== "running"} onClick={() => action("skill")}><span>ϟ {state.skillName}</span><b>{state.unit.sp >= 100 ? "ACTIVATE [Q]" : `${Math.floor(state.unit.sp)}%`}</b><i style={{width:`${state.unit.sp}%`}}/></button><button className="retreat-button" onClick={() => action("retreat")}>↩ Retreat <span>+{Math.floor(roster[state.selected].cost / 2)} DP</span></button></> : <div className="deploy-instruction"><span>◇</span>{state.cooldowns[state.selected] > 0 ? `Redeploy in ${Math.ceil(state.cooldowns[state.selected])}s` : state.dp < roster[state.selected].cost ? `Need ${roster[state.selected].cost - Math.floor(state.dp)} more DP` : "Choose a glowing tile to deploy"}</div>}
      </aside>}
      <div className="roster">
        <aside className="deployment"><div className="dp"><i/><span>DP</span><strong>{Math.floor(state.dp)}</strong></div><div className="dp-track"><i style={{width:`${(state.dp % 1)*100}%`}}/></div><div className="deploy-count">DEPLOY <b>{state.deployed} <span>/ 8</span></b></div><div className="stripes"/></aside>
        {roster.map((op,i) => <button key={op.name} aria-label={`Select ${op.name}, ${op.role}, ${op.cost} DP`} onClick={() => action("select", i)} className={`operator-card ${state.selected === i ? "selected" : ""} ${!state.active.includes(i) && (state.dp < op.cost || state.cooldowns[i] > 0) ? "unavailable" : ""}`}>
          <div className="portrait"><svg viewBox="0 0 274 150" preserveAspectRatio="xMidYMid slice"><image href="/assets/reference.png" x={-op.x} y="-729" width="1672" height="941"/></svg></div>
          <span className="card-index">0{i+1}</span>{state.active.includes(i) && <span className="deployed-badge">ON FIELD</span>}{state.cooldowns[i] > 0 && <span className="cooldown-label">{Math.ceil(state.cooldowns[i])}s</span>}
          <div className="card-caption"><Icon name={op.icon}/><div><h2>{op.name}</h2><p>{op.role}</p></div><span className="card-cost">◈ {op.cost}</span></div>
        </button>)}
      </div>
      {(state.phase === "loading" || state.phase === "error") && <div className="modal-veil"><div className="operation-modal"><span className="eyebrow">RHODES TACTICAL NETWORK</span><h2>{state.phase === "error" ? "CONNECTION INTERRUPTED" : "PREPARING OPERATION"}</h2><p>{state.phase === "error" ? "A game asset could not load. Reload to reconnect." : "Loading battlefield and animation data…"}</p>{state.phase === "error" ? <button onClick={()=>location.reload()}>RECONNECT</button> : <div className="loading-line"/>}</div></div>}
      {(state.phase === "paused" || help) && <div className="modal-veil"><div className="operation-modal"><span className="eyebrow">SECTOR 01 / CHECKPOINT</span><h2>{help ? "FIELD MANUAL" : "TACTICAL PAUSE"}</h2>{help ? <><p>Hold the checkpoint. Stop 35 hostiles from reaching the blue exit. You have 8 lives.</p><div className="manual"><div><b>01 / DEPLOY</b><span>Choose a portrait (1–5), then a glowing tile. Melee operators hold the road; ranged operators use raised platforms.</span></div><div><b>02 / SUPPORT</b><span>Deploy Lumen for area damage and Suture to heal your frontline. DP regenerates and is earned with eliminations.</span></div><div><b>03 / COMMAND</b><span>Select a deployed operator and activate their charged skill with Q. Retreat returns half the deployment cost.</span></div></div></> : <p>The battlefield is on hold. Plan your next move.</p>}<button onClick={() => {setHelp(false); if(state.phase === "paused") action("pause");}}>RESUME OPERATION <span>→</span></button><button className="secondary" onClick={() => {setHelp(false); action("restart");}}>RESTART CHECKPOINT</button></div></div>}
      {(state.phase === "victory" || state.phase === "defeat") && <div className="modal-veil result-veil"><div className={`operation-modal result ${state.phase}`}><span className="eyebrow">OPERATION REPORT / 01</span><div className="result-emblem">{state.phase === "victory" ? "◇" : "×"}</div><h2>{state.phase === "victory" ? "MISSION ACCOMPLISHED" : "CHECKPOINT LOST"}</h2><p>{state.phase === "victory" ? "Hostile forces neutralized. The checkpoint is secure." : "Hostile forces breached the perimeter. Regroup and try again."}</p><div className="result-stats"><div><b>{state.kills}<small>/35</small></b><span>ELIMINATED</span></div><div><b>{state.lives}<small>/8</small></b><span>LIVES SAVED</span></div><div><b>{Math.floor(state.elapsed/60)}:{String(Math.floor(state.elapsed%60)).padStart(2,"0")}</b><span>OPERATION TIME</span></div></div><button onClick={() => action("restart")}>DEPLOY AGAIN <span>→</span></button></div></div>}
    </section>
    <footer className="utility-bar"><div className="mission-label"><span>◆</span> TACTICAL COMMAND <i/> <span className="desktop-hint">1–5 SELECT <b>·</b> CLICK TILE TO DEPLOY <b>·</b> SPACE PAUSE <b>·</b> Q SKILL</span><span className="mobile-hint">TAP PORTRAIT, THEN TILE</span></div><nav><button onClick={() => action("sound")} aria-label={state.sound ? "Mute sound" : "Enable sound"}>{state.sound ? "◖))" : "◖×"}<span>SOUND {state.sound ? "ON" : "OFF"}</span></button><button onClick={openHelp} title="How to play"><b>?</b><span>FIELD MANUAL</span></button><button onClick={() => { if(document.fullscreenElement) document.exitFullscreen?.(); else document.querySelector(".command-room")?.requestFullscreen?.(); }} aria-label="Toggle fullscreen">⛶</button></nav></footer>
  </div></main>;
}
