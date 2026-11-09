import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Battle } from '../lib/battle.mjs';
import { enemyFrame, unitFacing, portalOpacity, operatorFrame } from '../lib/visual-state.mjs';
import { rangeCells, inRange, BOARD_PROJECTION } from '../lib/missions.mjs';

// Facing follows the current target and remains stable through recovery.
const caster={type:3,x:500,dir:1,lookX:-100};
assert.equal(unitFacing(caster,{x:300}),-1);
assert.equal(unitFacing(caster,{x:700}),1);
assert.equal(unitFacing(caster,null),-1);
for(let biome=0;biome<3;biome++){
 const boss={kind:'boss',p:0,blocked:null};
 const walk=[0,9,18,27].map(p=>enemyFrame({...boss,p},biome));
 assert.equal(new Set(walk.map(f=>f.col)).size,4);
 assert.ok(walk.every(f=>f.boss&&f.row===biome));
 for(const kind of ['grunt','heavy']){const walk=[0,7,14,20,27].map(p=>enemyFrame({kind,p},biome));assert.equal(new Set(walk.map(f=>`${f.transition?'extra':'base'}:${f.row}:${f.col}`)).size,5);}
 assert.deepEqual([0,.5,.83,1.2].map(time=>enemyFrame({...boss,action:{time,hitAt:.82}},biome).col),[4,4,5,0]);
 assert.deepEqual([2.6,2.0,1.4,.4].map(life=>enemyFrame({...boss,life,deathDuration:2.6},biome,true)),[0,1,2,3].map(col=>({row:biome,col,bossDeath:true})));
 const game=new Battle(biome);game.start();game.spawned=game.mission.total-5;game.resolved=game.mission.total-1;game.spawn();game.spawned=game.mission.total;
 const e=game.enemies[0];e.p=100;game.damage(e,99999,true);
 assert.ok(game.events.some(e=>e.type==='bossDeath'));
 game.update(.1);assert.equal(game.phase,'running','result must wait for defeat animation');
 for(let i=0;i<180;i++)game.update(1/60);
 assert.equal(game.phase,'victory');assert.equal(game.dead.length,0);
}
// Each highlighted cell is hittable, and a position behind a forward-only unit is not.
for(let type=0;type<5;type++)for(let dir=0;dir<4;dir++)for(const whiteout of [false,true]){
 const unit={x:700,y:400,type,dir},a=dir*Math.PI/2;
 for(const [f,s] of rangeCells(unit,{whiteout})){
  const target={x:unit.x+f*Math.cos(a)-s*Math.sin(a),y:unit.y+(f*Math.sin(a)+s*Math.cos(a))/BOARD_PROJECTION};
  assert.ok(inRange(unit,target,{whiteout}));
 }
 if(type!==4)assert.equal(inRange(unit,{x:unit.x-200*Math.cos(a),y:unit.y-200*Math.sin(a)/BOARD_PROJECTION},{whiteout}),false);
}
const entrance=new Battle();entrance.start();entrance.spawn();assert.ok(entrance.events.some(e=>e.type==='gateIn'));
assert.equal(portalOpacity({p:0,path:{length:1000}}),0);
assert.equal(portalOpacity({p:100,path:{length:1000}}),1);
assert.equal(portalOpacity({p:1000,path:{length:1000}}),0);
const manifest=JSON.parse(fs.readFileSync(new URL('../public/assets/audio/voices/manifest.json',import.meta.url),'utf8'));
assert.equal(manifest.length,12);
for(const line of manifest){
 const bytes=fs.readFileSync(new URL(`../public/assets/audio/voices/${line.key}.wav`,import.meta.url));
 assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WAVE');
 assert.equal(bytes.readUInt32LE(24),24000);assert.ok(bytes.length>24000);assert.ok(line.seconds>.7&&line.seconds<5);
}
console.log('PASS target-facing, cohesive four-pose boss and five-pose enemy walks, attack/collapse frames, delayed victory, exact range tile agreement, gate transitions, and all 12 Japanese voice assets.');

const music=JSON.parse(fs.readFileSync(new URL('../public/assets/audio/music/manifest.json',import.meta.url),'utf8'));assert.equal(Object.keys(music.tracks).length,6);for(const name of ['menu','night','shrine','foundry']){const b=fs.readFileSync(new URL(`../public/assets/audio/music/${name}.ogg`,import.meta.url));assert.equal(b.subarray(0,4).toString(),'OggS');assert.ok(music.tracks[name].duration>30);}
console.log('PASS four complete instrumental music assets.');

for(const name of ['victory','defeat']){const b=fs.readFileSync(new URL(`../public/assets/audio/music/${name}.ogg`,import.meta.url));assert.equal(b.subarray(0,4).toString(),'OggS');assert.ok(music.tracks[name].duration>3&&music.tracks[name].duration<10);}
// A result stops the battle source and never restarts after its one-shot ends.
const {Soundscape}=await import('../lib/audio.mjs');
const sources=[];const parameter={value:0,cancelScheduledValues(){},setTargetAtTime(){}};
const audio=new Soundscape();audio.enabled=true;audio.master={};
audio.context={currentTime:0,createGain:()=>({gain:{...parameter},connect(){}}),createBufferSource:()=>{const s={playbackRate:{value:1},connect(){},start(){},stop(){this.stopped=true;}};sources.push(s);return s;}};
for(const key of ['night','victory','defeat','menu'])audio.buffers.set('music/'+key,{duration:5});
audio.music('night');const battle=sources.at(-1);assert.equal(battle.loop,true);
audio.music('victory');assert.equal(battle.stopped,true);const win=sources.at(-1);assert.equal(win.loop,false);win.onended();
for(let i=0;i<100;i++)audio.music('victory');assert.equal(sources.length,2);
audio.music('menu');assert.equal(sources.length,3);audio.music('defeat');assert.equal(sources.at(-1).loop,false);
console.log('PASS result music interrupts battle, plays once, stays silent, and resets on mission navigation.');

assert.equal(operatorFrame({phase:0},0),0);assert.equal(operatorFrame({phase:0},5.65),1);assert.equal(operatorFrame({phase:0},5.81),0);
assert.deepEqual([0,.32,.5,.7].map(time=>operatorFrame({action:{time,hitAt:.32}},0)),[2,3,4,5]);
console.log('PASS matched operator idle/blink and anticipation/release/follow-through/recovery poses.');
