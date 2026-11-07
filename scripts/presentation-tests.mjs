import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Battle } from '../lib/battle.mjs';
import { enemyFrame, unitFacing, portalOpacity } from '../lib/visual-state.mjs';

// Facing follows the current target and remains stable through recovery.
const caster={type:3,x:500,dir:1,lookX:-100};
assert.equal(unitFacing(caster,{x:300}),-1);
assert.equal(unitFacing(caster,{x:700}),1);
assert.equal(unitFacing(caster,null),-1);
for(let biome=0;biome<3;biome++){
 const boss={kind:'boss',p:0,blocked:null};
 assert.deepEqual([0,16,32,48].map(p=>enemyFrame({...boss,p},biome).col),[0,1,2,3]);
 assert.deepEqual([0,.5,.83,1.1].map(time=>enemyFrame({...boss,action:{time,hitAt:.82}},biome).col),[0,1,2,3]);
 assert.deepEqual([2.6,2.2,1.6,.4].map(life=>enemyFrame({...boss,life,deathDuration:2.6},biome,true)),[0,1,2,3].map(col=>({row:2,col})));
 const game=new Battle(biome);game.start();game.spawned=game.mission.total-1;game.resolved=game.mission.total-1;game.spawn();
 const e=game.enemies[0];e.p=100;game.damage(e,99999,true);
 assert.ok(game.events.some(e=>e.type==='bossDeath'));
 game.update(.1);assert.equal(game.phase,'running','result must wait for defeat animation');
 for(let i=0;i<180;i++)game.update(1/60);
 assert.equal(game.phase,'victory');assert.equal(game.dead.length,0);
}
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
console.log('PASS target-facing, boss walk/attack/collapse frames, delayed victory, route gate transitions, and all 12 Japanese voice assets.');
