// Animation decisions are separate from rendering and never change firing arcs.
export function actionFrame(action) {
  if (!action) return 0;
  if (action.time < action.hitAt * .48) return 0;
  if (action.time < action.hitAt) return 1;
  if (action.time < action.hitAt + .16) return 2;
  return 3;
}

export function enemyFrame(enemy, biome, dead = false) {
  if(dead&&enemy.kind!=='boss')return {row:biome===0?0:biome===1?(enemy.kind==='heavy'?2:1):(enemy.kind==='heavy'?4:3),col:Math.min(3,Math.floor((enemy.deathDuration-enemy.life)/.26)),death:true};
  if(enemy.kind==='boss'){
    if(dead)return {row:biome,col:Math.min(3,Math.floor((enemy.deathDuration-enemy.life)/.52)),bossDeath:true};
    const col=enemy.action?(enemy.action.time<enemy.action.hitAt?4:enemy.action.time<enemy.action.hitAt+.32?5:0):enemy.blocked?0:walkFrame(enemy);
    return {row:biome,col,boss:true};
  }
  // All four drawings come from the same character sheet. Never insert a
  // mismatched passing pose or an unrelated recoil cel mid-stride.
  const walkCol=walkFrame(enemy);
  if (biome > 0) {
    const base = enemy.kind === 'heavy' ? 2 : 0;
    return { row: base + (enemy.action ? 1 : 0), col: enemy.action ? actionFrame(enemy.action) : enemy.blocked ? 1 : walkCol };
  }
  const frame = enemy.action ? enemy.action.time < enemy.action.hitAt ? 5 : 6 : enemy.blocked ? 4 : walkCol;
  return { row: Math.floor(frame / 4), col: frame % 4 };
}

function walkFrame(enemy){
  const cadence=enemy.kind==='boss'?5:enemy.kind==='heavy'?5.5:enemy.kind==='runner'?8:6.5;
  return Math.floor((enemy.walkTime||0)*cadence)%4;
}

export function unitFacing(unit, target) {
  const dx = target ? target.x - unit.x : unit.lookX;
  if (Number.isFinite(dx) && Math.abs(dx) > 8) return dx < 0 ? -1 : 1;
  return unit.dir === 2 ? -1 : unit.dir === 0 ? 1 : unit.lookSign || 1;
}

export function portalOpacity(enemy) {
  return Math.max(0, Math.min(1, enemy.p / 40, (enemy.path.length - enemy.p) / 38));
}

export function operatorFrame(unit,time){
 if(unit.skillShot>0)return 3;
 if(!unit.action)return 0;
 const a=unit.action;return a.time<a.hitAt?2:a.time<a.hitAt+.15?3:a.time<a.hitAt+.31?4:5;
}

// Idle never swaps the body drawing: only eye patches blink, while boots stay planted.
export function idleMotion(unit,time){
 if(unit.action||unit.skillShot>0)return {breath:1,blink:false};
 const phase=time+(unit.phase||0);
 return {breath:1+Math.sin(phase*Math.PI/2.3)*.0045,blink:phase%5.8>5.61};
}
