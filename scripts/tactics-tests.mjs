import assert from'node:assert/strict';
import{Battle}from'../lib/battle.mjs';
import{MISSIONS,OPERATORS,inRange,pointOn}from'../lib/missions.mjs';
const tick=(b,seconds)=>{for(let i=0;i<seconds*60&&b.phase==='running';i++){b.update(1/60);b.events=[];}};
for(const m of MISSIONS){const b=new Battle(m.id);assert.equal(b.phase,'briefing');assert.equal(b.units.length,0);assert.equal(b.enemies.length,0);assert.equal(b.dp,m.dp);b.update(30);assert.equal(b.time,0);b.start();assert.equal(b.phase,'running');assert.equal(b.enemies.length,0);assert.equal(b.units.length,0);for(const path of m.paths){const origin=pointOn(path,0);assert.equal(origin.x,path.points[0][0]);assert.equal(origin.y,path.points[0][1]);}}
const b=new Battle();b.start();b.selected=0;const tile=b.mission.tiles.find(t=>t.id==='g3'),high=b.mission.tiles.find(t=>t.id==='p0');assert.equal(b.prepare(high),false,'vanguard cannot use high ground');assert.equal(b.prepare(tile),true);assert.equal(b.units.length,0,'tile choice must not deploy before direction confirmation');assert.equal(b.dp,14);b.face(2);assert.equal(b.deploy(),true);assert.equal(b.units.length,1);assert.equal(b.dp,4);assert.equal(b.units[0].dir,2);b.selected=0;assert.equal(b.validTile(tile),false,'cannot duplicate a deployed operator');
const u=b.units[0];assert.equal(inRange(u,{x:u.x-100,y:u.y},b),true);assert.equal(inRange(u,{x:u.x+130,y:u.y},b),false,'facing must constrain attacks');b.selected=3;assert.equal(b.prepare(high),false,'cannot deploy without enough DP');
b.phase='paused';const snapshot=b.snapshot();b.update(60);assert.equal(b.time,snapshot.elapsed);assert.equal(b.dp,snapshot.dp);b.phase='running';b.selected=0;b.retreat();assert.equal(b.dp,9);assert.equal(b.units.length,0);assert.equal(b.cooldowns[0],25);assert.equal(b.costFor(0),15);b.selected=0;assert.equal(b.prepare(tile),false,'redeployment cooldown enforced');
const p=new Battle();p.start();p.selected=2;p.deploy(p.mission.tiles.find(t=>t.id==='p1'),2);p.spawn();const enemy=p.enemies[0];enemy.x=1000;enemy.y=300;enemy.p=1;const sniper=p.units[0];p.launch(sniper,enemy,200);const hp=enemy.hp;p.update(.01);assert.equal(enemy.hp,hp,'projectile cannot deal instant damage');p.update(.4);assert.ok(enemy.hp<hp,'projectile applies damage on arrival');
const fail=new Battle(2);fail.start();tick(fail,320);assert.equal(fail.phase,'defeat');assert.equal(fail.lives,0);
const plans=[[[0,[4,3],2],[2,[3,2],0],[3,[5,2],1],[4,[6,4],3],[1,[6,3],2]],[[0,[4,4],3],[2,[9,3],2],[3,[5,3],0],[4,[7,3],2],[1,[7,4],2]],[[0,[5,3],3],[2,[4,2],0],[4,[6,2],1],[3,[7,4],3],[1,[6,3],2]]];
for(let m=0;m<3;m++){
 const game=new Battle(m);game.start();let deployed=0,heals=0,attacks=0,boss=false,weather=false;
 for(let i=0;i<27000&&game.phase==='running';i++){
  if(deployed<plans[m].length){const[type,cell,dir]=plans[m][deployed];game.selected=type;if(game.deploy(game.mission.tiles.find(t=>t.cell[0]===cell[0]&&t.cell[1]===cell[1]),dir))deployed++;}
  for(const unit of game.units)if(unit.sp>=100&&(unit.type!==1||unit.hp<unit.maxHp*.6||game.enemies.some(e=>e.kind==='boss'&&e.blocked===unit.id))&&(unit.type!==4||game.units.some(a=>a.hp<a.maxHp-500))){game.selected=unit.type;game.skill();}
  game.update(1/60);heals+=game.events.filter(e=>e.type==='heal').length;attacks+=game.events.filter(e=>e.type==='shot'||e.type==='slash').length;boss||=game.bossSeen;weather||=game.whiteout||game.lastHazard>0;game.events=[];
 }
 assert.equal(game.phase,'victory',`mission ${m+1} must be completable`);assert.equal(game.resolved,game.mission.total);assert.ok(game.lives>0);assert.equal(deployed,5);assert.ok(heals>0);assert.ok(attacks>20);assert.ok(boss);if(m>0)assert.ok(weather);console.log(`PASS ${game.mission.name}: ${game.kills}/${game.mission.total} defeated, ${game.lives} lives, ${Math.round(game.time)}s, ${heals} heals, ${game.stats.skills} skills.`);
 game.reset(m);assert.equal(game.units.length,0);assert.equal(game.enemies.length,0);assert.equal(game.phase,'briefing');
}
console.log('PASS empty starts, class restrictions, two-step placement, facing, DP, pause, retreat/cost scaling, cooldowns, projectile timing, defeat, 3 missions, bosses, hazards, healing, and restart.');

// Static placements without skills must no longer trivialize the final assault.
for(const m of [0,2]){const game=new Battle(m);game.start();let deployed=0;for(let i=0;i<18000&&game.phase==='running';i++){if(deployed<plans[m].length){const[type,cell,dir]=plans[m][deployed];game.selected=type;if(game.deploy(game.mission.tiles.find(t=>t.cell[0]===cell[0]&&t.cell[1]===cell[1]),dir))deployed++;}game.update(1/30);game.events=[];}assert.equal(game.phase,'defeat','timed skills must matter during the final assault');}
console.log('PASS hard-stage balance: deliberate formations win; unattended skill-free plans lose Nightwatch and Cinder Works.');

// Healing must respect both the previewed range and the authored limits.
const medicBattle=new Battle();medicBattle.start();
medicBattle.units=[{id:1,type:4,x:600,y:400,groundY:400,dir:0,hp:1000,maxHp:1900,sp:100},{id:2,type:1,x:700,y:400,hp:1000,maxHp:3900},{id:3,type:0,x:1200,y:400,hp:1000,maxHp:2100}];
medicBattle.selected=4;medicBattle.skill();assert.equal(medicBattle.units[1].hp,1650);assert.equal(medicBattle.units[2].hp,1000);assert.equal(medicBattle.units[0].sp,0);
assert.ok(OPERATORS[4].atk/OPERATORS[4].interval<75,'regular medic healing remains below 75 HP/sec');
const {assaultSchedule}=await import('../lib/waves.mjs');
for(let i=0;i<3;i++){const queue=assaultSchedule(i);assert.equal(queue.length,MISSIONS[i].total);assert.equal(queue.filter(e=>e.kind==='boss').length,1);assert.deepEqual([...new Set(queue.map(e=>e.wave))],[1,2,3]);assert.ok(queue.every(e=>e.lane<MISSIONS[i].paths.length));}
assert.notDeepEqual(assaultSchedule(0).map(e=>e.kind),assaultSchedule(1).map(e=>e.kind));
console.log('PASS bounded healing, range-limited medical skill and distinct deterministic assault schedules.');
