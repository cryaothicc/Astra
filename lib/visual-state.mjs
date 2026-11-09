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
    const col=enemy.action?(enemy.action.time<enemy.action.hitAt?4:enemy.action.time<enemy.action.hitAt+.32?5:0):enemy.blocked?0:Math.floor(enemy.p/8.5)%4;
    return {row:biome,col,boss:true};
  }
  // The passing pose splits the first step: five distinct drawings per stride.
  const walking=!dead&&!enemy.action&&!enemy.blocked;
  const step=Math.floor(enemy.p/(enemy.kind==='boss'?12.8:6.6))%5;
  if(walking&&step===1)return {row:biome===0||enemy.kind==='boss'?0:1,col:enemy.kind==='boss'?biome:biome===0?3:biome===1?(enemy.kind==='heavy'?1:0):(enemy.kind==='heavy'?3:2),transition:true};
  const walkCol=[0,0,1,2,3][step];
  if (enemy.kind === 'boss') {
    if (dead) {
      const elapsed = enemy.deathDuration - enemy.life;
      return { row: 2, col: elapsed < .32 ? 0 : elapsed < .8 ? 1 : elapsed < 1.3 ? 2 : 3 };
    }
    return enemy.action
      ? { row: 1, col: actionFrame(enemy.action) }
      : { row: 0, col: enemy.blocked ? 1 : walkCol };
  }
  if (biome > 0) {
    const base = enemy.kind === 'heavy' ? 2 : 0;
    return { row: base + (enemy.action ? 1 : 0), col: enemy.action ? actionFrame(enemy.action) : enemy.blocked ? 1 : walkCol };
  }
  const frame = dead || enemy.hit > 0 ? 7 : enemy.action ? enemy.action.time < enemy.action.hitAt ? 5 : 6 : enemy.blocked ? 4 : walkCol;
  return { row: Math.floor(frame / 4), col: frame % 4 };
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
 if(!unit.action)return (time+(unit.phase||0))%5.8>5.58?1:0;
 const a=unit.action;return a.time<a.hitAt?2:a.time<a.hitAt+.15?3:a.time<a.hitAt+.31?4:5;
}
