import assert from 'node:assert/strict';
import {Battle,TILES,PATH_LENGTH} from '../lib/game.mjs';
const step=(b,n)=>{for(let i=0;i<n&&b.phase==='running';i++){b.update(1/60);b.events=[];}};
const b=new Battle();
assert.equal(b.units.length,3);
b.selected=3;
assert.equal(b.deploy(TILES.find(t=>t.id==='p1')),true);
assert.equal(b.dp,4);
assert.equal(b.units.length,4);
b.selected=4;
assert.equal(b.deploy(TILES.find(t=>t.id==='p3')),false,'insufficient DP must prevent deployment');
assert.equal(b.units.length,4);
b.phase='paused';const before=b.snapshot();b.update(5);
assert.equal(b.time,before.elapsed);assert.equal(b.dp,before.dp);
b.phase='running';b.selected=3;b.retreat();assert.equal(b.dp,14);assert.equal(b.cooldowns[3],12);
b.selected=3;assert.equal(b.deploy(TILES.find(t=>t.id==='p1')),false,'redeploy cooldown must be enforced');
const c=new Battle();c.selected=0;c.unit().sp=100;assert.equal(c.skill(),true);assert.equal(c.dp,32);assert.equal(c.unit().sp,0);assert.equal(c.skill(),false);
const d=new Battle();d.units=[];for(const e of d.enemies)e.p=PATH_LENGTH-1;step(d,20);assert.equal(d.lives,5);step(d,18000);assert.equal(d.phase,'defeat');assert.equal(d.lives,0);
const v=new Battle();v.selected=3;v.deploy(TILES.find(t=>t.id==='p1'));
let heals=0,attacks=0,skills=0;
for(let i=0;i<18000&&v.phase==='running';i++){
  if(v.dp>=16&&!v.units.some(u=>u.type===4)){v.selected=4;const tile=TILES.filter(t=>v.validTile(t)).sort((a,b)=>Math.hypot(a.x-730,a.y-560)-Math.hypot(b.x-730,b.y-560))[0];v.deploy(tile);}
  for(const u of v.units)if(u.sp>=100){v.selected=u.type;if(v.skill())skills++;}
  v.update(1/60);heals+=v.events.filter(e=>e.type==='heal').length;attacks+=v.events.filter(e=>e.type==='shot'||e.type==='slash').length;v.events=[];
}
assert.equal(v.phase,'victory');assert.equal(v.resolved,35);assert.equal(v.kills,35);assert.equal(v.lives,8);assert.ok(heals>0);assert.ok(attacks>30);assert.ok(skills>5);
v.reset();assert.equal(v.phase,'running');assert.equal(v.kills,0);assert.equal(v.units.length,3);
console.log(`PASS: costs, placement, pause, retreat, cooldowns, skills, healing, damage, defeat, victory, and restart. Full mission: ${attacks} attacks, ${heals} heals, ${skills} skills.`);
