// Animation decisions are separate from rendering and never change firing arcs.
export function actionFrame(action) {
  if (!action) return 0;
  if (action.time < action.hitAt * .48) return 0;
  if (action.time < action.hitAt) return 1;
  if (action.time < action.hitAt + .16) return 2;
  return 3;
}

export function enemyFrame(enemy, biome, dead = false) {
  if (enemy.kind === 'boss') {
    if (dead) {
      const elapsed = enemy.deathDuration - enemy.life;
      return { row: 2, col: elapsed < .32 ? 0 : elapsed < .8 ? 1 : elapsed < 1.3 ? 2 : 3 };
    }
    return enemy.action
      ? { row: 1, col: actionFrame(enemy.action) }
      : { row: 0, col: enemy.blocked ? 1 : Math.floor(enemy.p / 16) % 4 };
  }
  if (biome > 0) {
    const base = enemy.kind === 'heavy' ? 2 : 0;
    return { row: base + (enemy.action ? 1 : 0), col: enemy.action ? actionFrame(enemy.action) : enemy.blocked ? 1 : Math.floor(enemy.p / 13) % 4 };
  }
  const frame = dead || enemy.hit > 0 ? 7 : enemy.action ? enemy.action.time < enemy.action.hitAt ? 5 : 6 : enemy.blocked ? 4 : Math.floor(enemy.p / 13) % 4;
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
