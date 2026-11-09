import{Battle}from'./battle.mjs';
import{WIDTH as W,HEIGHT as H,MISSIONS,OPERATORS,inRange}from'./missions.mjs';
import{Soundscape}from'./audio.mjs';
import{enemyFrame,unitFacing,portalOpacity,operatorFrame}from'./visual-state.mjs';
import{createCombatRenderer}from'./combat-renderer.mjs';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const loadImage=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
function contains(x,y,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){if((poly[i][1]>y)!==(poly[j][1]>y)&&x<(poly[j][0]-poly[i][0])*(y-poly[i][1])/(poly[j][1]-poly[i][1])+poly[i][0])c=!c;}return c;}
// Register each drawn frame to its actual foot baseline. The sprite never bobs.
function atlas(image,cols,rows){
 const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
 const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(image,0,0);
 const data=x.getImageData(0,0,c.width,c.height).data,cw=image.width/cols,ch=image.height/rows,frames=[];
 for(let r=0;r<rows;r++){
  const sy=Math.round(r*ch),sh=Math.round((r+1)*ch)-sy,bounds=[0];
  // Locate transparent gutters near nominal cell edges. This preserves long
  // weapons that cross an approximate generated grid without borrowing neighbors.
  for(let col=1;col<cols;col++){
   const nominal=Math.round(col*cw),radius=Math.floor(cw*.13);let best=nominal,score=Infinity;
   for(let xx=nominal-radius;xx<=nominal+radius;xx++){
    let ink=0;for(let yy=sy;yy<sy+sh;yy++)if(data[(yy*c.width+xx)*4+3]>180)ink++;
    const rank=ink*1000+Math.abs(xx-nominal);if(rank<score){score=rank;best=xx;}
   }bounds.push(best);
  }bounds.push(image.width);
  for(let col=0;col<cols;col++){
   const sx=bounds[col],sw=bounds[col+1]-sx;let top=sh,bottom=0;
   for(let yy=0;yy<sh;yy++)for(let xx=0;xx<sw;xx++)if(data[((yy+sy)*c.width+xx+sx)*4+3]>180){top=Math.min(top,yy);bottom=Math.max(bottom,yy);}
   frames.push({sx,sy,sw,sh,top,bottom,pivot:(col+.5)*cw-sx});
  }
 }return{image,cols,rows,frames};
}

export function createGame(canvas,onState){
 const ctx=canvas.getContext('2d',{alpha:false}),game=new Battle(),audio=new Soundscape();let ready=false,stopped=false,raf,last=0,uiTimer=0,time=0,hover=null,fx=[],shake=0,assets,scale=1,routes=true,subtitles=true,returnPhase='briefing',recorded=false,footstepTimer=0;
 let progress={};try{progress=JSON.parse(localStorage.getItem('sector01-progress-v3')||'{}');}catch{}
 game.phase='missions';
 const publish=()=>onState({...game.snapshot(),phase:ready?game.phase:'loading',sound:audio.enabled,voices:audio.voicesEnabled,music:audio.musicEnabled&&audio.enabled,progress:{...progress},routes,subtitles});
 function resize(){const rect=canvas.getBoundingClientRect();scale=Math.max(1,Math.min(2,(window.devicePixelRatio||1)*rect.width/W));canvas.width=Math.round(W*scale);canvas.height=Math.round(H*scale);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';}
 const combat=createCombatRenderer(ctx,game);
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();publish();
 Promise.all(['map-night-v3','map-shrine-v3','map-foundry-v3','operators-unified-v4','enemies','enemies-snow','enemies-foundry','walk-transitions','enemy-deaths','boss-unified-v4','boss-deaths-v4'].map(s=>loadImage(`/assets/${s}.png`))).then(imgs=>{if(stopped)return;assets={scenes:imgs.slice(0,3),operators:atlas(imgs[3],6,5),enemies:[atlas(imgs[4],4,2),atlas(imgs[5],4,4),atlas(imgs[6],4,4)],walk:atlas(imgs[7],4,2),deaths:atlas(imgs[8],4,5),boss:atlas(imgs[9],6,3),bossDeaths:atlas(imgs[10],4,3)};ready=true;publish();}).catch(()=>{ready=true;game.phase='error';publish();});
 function polygon(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
 function label(text,x,y,size=13,color='#deeeef',align='center'){ctx.fillStyle=color;ctx.font=`600 ${size}px Arial`;ctx.textAlign=align;ctx.fillText(text,x,y);}
 function line(x,y,tx,ty,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(tx,ty);ctx.stroke();}
 function groundMark(x,y,dir,selected=false){ctx.save();ctx.shadowBlur=selected?12:0;ctx.shadowColor='#6febd8';polygon([[x-40,y-17],[x+40,y-17],[x+38,y+15],[x-42,y+15]],'#46c5bb15',selected?'#9ef9e4':'#53bfb5aa',selected?3:1.5);ctx.translate(x,y);ctx.rotate(dir*Math.PI/2);polygon([[42,-6],[51,0],[42,6]],'#78e9d2');ctx.restore();}
 function health(x,y,hp,max,width,color,sp){ctx.fillStyle='#08151be8';ctx.fillRect(x-width/2-2,y-2,width+4,10);ctx.fillStyle='#29313b';ctx.fillRect(x-width/2,y,width,6);ctx.fillStyle=color;ctx.fillRect(x-width/2,y,width*clamp(hp/max,0,1),6);if(sp!==undefined){ctx.fillStyle='#142b2e';ctx.fillRect(x-width/2,y+10,width,3);ctx.fillStyle=sp>=100?'#f7d28b':'#8ea6a5';ctx.fillRect(x-width/2,y+10,width*sp/100,3);}}
 function sprite(sheet,col,row,x,y,height,flip=false,filter='none',referenceRow=0,referenceCol=col){const f=sheet.frames[row*sheet.cols+col],ref=sheet.frames[referenceRow*sheet.cols+referenceCol];const factor=height/Math.max(1,ref.bottom-ref.top);ctx.save();ctx.translate(x,y);ctx.scale(flip?-1:1,1);ctx.filter=filter;ctx.drawImage(sheet.image,f.sx,f.sy,f.sw,f.sh,-f.pivot*factor,-f.bottom*factor,f.sw*factor,f.sh*factor);ctx.restore();}
 function drawUnit(u,ghost=false){
  // A single registered atlas keeps the weapon and body consistent between actions.
  const sheet=assets.operators,row=u.type,refRow=u.type,refCol=0;
  const col=operatorFrame(u,time);
  const target=u.action?(u.type===4?game.units:game.enemies).find(e=>e.id===u.action.target):null,facing=unitFacing(u,target),unitHeight=118+(u.y-190)*.07,flip=facing!==1;
  ctx.save();ctx.fillStyle='#02060a72';ctx.beginPath();ctx.ellipse(u.x,u.y+2,36,10,0,0,Math.PI*2);ctx.fill();
  if(u.buff>0){ctx.strokeStyle=u.type===3?'#be9bf0':'#80dccc';ctx.globalAlpha=.7;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(u.x,u.y,52,17,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
  if(ghost)ctx.globalAlpha=.54;else if(u.deploy>0)ctx.globalAlpha=1-u.deploy/.5;
  sprite(sheet,col,row,u.x,u.y,unitHeight,flip,u.hit>0?'brightness(1.65)':u.slow>0?'saturate(.65)':'none',refRow,refCol);
  ctx.restore();
  if(!ghost){health(u.x,u.y-unitHeight-12,u.hp,u.maxHp,82,'#72dccb',u.sp);if(u.sp>=100)label('ϟ',u.x+51,u.y-unitHeight+7,20,'#f7dd9e');if(u.stun>0)label('✦',u.x,u.y-180,17,'#ffd0a1');}
 }
 function drawEnemy(e,dead=false){
  const boss=e.kind==='boss',frame=enemyFrame(e,game.mission.id,dead),{row,col,transition,death,bossDeath}=frame;
  const sheet=bossDeath?assets.bossDeaths:boss?assets.boss:death?assets.deaths:transition?assets.walk:assets.enemies[game.mission.id];
  const height=boss?154:e.kind==='heavy'?145:e.kind==='runner'?115:129;
  ctx.save();ctx.globalAlpha=dead?Math.min(1,e.life/(boss?.75:.4)):portalOpacity(e);
  ctx.fillStyle='#02060a70';ctx.beginPath();ctx.ellipse(e.x,e.y+3,boss?38:29,10,0,0,Math.PI*2);ctx.fill();
  
  const target=e.action?game.units.find(u=>u.id===e.action.target):null;
  const flip=target?target.x<e.x:Math.cos(e.angle||0)<-.2;
  const filter=e.hit>0?'brightness(1.7)':e.slow>0?'saturate(.55)':e.enraged?'saturate(1.2)':'none';
  sprite(sheet,col,row,e.x,e.y,height,flip,filter,death||boss||transition?row:game.mission.id>0&&e.kind==='heavy'?2:0,transition?col:0);ctx.restore();
  if(!dead){health(e.x,e.y-height-13,e.hp,e.maxHp,boss?110:62,boss?'#e4a36c':'#d96967');if(e.kind==='heavy'||e.kind==='shooter')label(e.kind==='heavy'?'ARMORED':'RANGED',e.x,e.y-height-18,9,'#c6b7a7');}
 }
 function drawPortals(front=false){combat.gates(time,front);}
 function routePreview(){ctx.save();ctx.setLineDash([13,20]);ctx.lineDashOffset=-time*25;for(const path of game.mission.paths){ctx.beginPath();path.points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle='#f4ab927a';ctx.lineWidth=2;ctx.stroke();}ctx.restore();}
 function weather(){const weather=game.mission.weather;ctx.save();if(weather==='rain'){ctx.lineWidth=1;ctx.strokeStyle='#bfd8e026';ctx.beginPath();for(let i=0;i<100;i++){const x=(i*139+time*95)%W,y=65+(i*83+time*420)%645;ctx.moveTo(x,y);ctx.lineTo(x-4,y+18);}ctx.stroke();const flash=time%33;if(flash>31&&flash<31.2){ctx.fillStyle=`rgba(193,213,235,${.13*Math.sin((flash-31)*Math.PI*5)})`;ctx.fillRect(0,61,W,650);}}else if(weather==='snow'){for(let i=0;i<65;i++){const x=(i*137+Math.sin(time*.5+i)*25+time*(game.whiteout?60:9))%W,y=65+(i*79+time*19)%650;ctx.globalAlpha=.25+(i%3)*.17;ctx.fillStyle='#d7ebf4';ctx.beginPath();ctx.arc(x,y,1+i%3*.6,0,Math.PI*2);ctx.fill();}if(game.whiteout){ctx.globalAlpha=.16;ctx.fillStyle='#bfdce7';ctx.fillRect(0,61,W,650);}}else{for(let i=0;i<55;i++){const x=(i*139+Math.sin(time*.8+i)*25)%W,y=710-(i*79+time*30)%650;ctx.globalAlpha=.2+(i%4)*.13;ctx.fillStyle=i%2?'#eaa26b':'#de6d39';ctx.fillRect(x,y,1.5+i%2,2.5);}for(const [x,y]of game.mission.vents){const warn=game.time%18>15.5&&game.mission.vents[Math.floor(game.time/18+1)%2]?.[0]===x;ctx.globalAlpha=warn?.35:.06;ctx.fillStyle='#f88747';ctx.beginPath();ctx.ellipse(x,y,45,21,0,0,Math.PI*2);ctx.fill();if(warn){ctx.globalAlpha=.7;label('!',x,y+5,22,'#ffc48c');}}}ctx.globalAlpha=1;for(let i=0;i<3;i++){const x=(time*10+i*640)%(W+500)-250,y=game.mission.id===2?650:620;const g=ctx.createRadialGradient(x,y,20,x,y,270);g.addColorStop(0,game.mission.id===2?'#9a746010':'#b6d4e216');g.addColorStop(1,'#97bfce00');ctx.fillStyle=g;ctx.fillRect(x-270,y-120,540,240);}ctx.restore();}
 function drawFacing(){const p=game.pending;if(!p)return;const{x,y}=p.tile;for(let d=0;d<4;d++){const angle=d*Math.PI/2,cx=x+Math.cos(angle)*92,cy=y-52+Math.sin(angle)*70;ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);polygon([[-20,-18],[19,0],[-20,18]],d===p.dir?'#82ead8':'#1a2a33dd',d===p.dir?'#c2ffee':'#b1c5ca',2);ctx.restore();}}
 let swingVariant=0,impactVariant=0;
 function consume(){
  for(const event of game.events){
   const e={...event,life:.6,max:.6},pan=((e.x||W/2)-W/2)/(W/2);
   if(e.type==='voice'){audio.voice(e.voice);continue;}
   if(e.type==='shot'){audio.play(e.kind==='arts'?'v2/magic-cast':'v2/shot',e.kind==='arts'?.19:.26,pan);continue;}
   if(e.type==='healSound'){audio.play('v2/heal',.16,pan);continue;}
   if(e.type==='damage'){e.life=e.max=.85;e.x+=Math.random()*12-6;}
   else if(e.type==='slash'){e.life=e.max=.42;audio.play('v2/slash'+(++swingVariant%2+1),.22,pan);}
   else if(e.type==='muzzle'){continue;} // Release flashes are painted into the attack cel.
   else if(e.type==='enemyAttack'){
    e.life=e.max=e.boss?.66:.3;
    audio.play(e.boss?'v2/boss-hit'+(++impactVariant%2?'2':''):'v2/slash'+(++swingVariant%2+1),e.boss?.42:.12,pan);
    if(e.boss)shake=9;
   }else if(e.type==='hit'){
    fx.push({...e,type:'hitFlash',life:e.arts?.52:.36,max:e.arts?.52:.36});
    const cue=e.arts?'magic-hit':e.kind==='body'?'body-hit':e.armored?'armor-hit':e.kind==='bolt'?'arrow-hit':'impact'+(++impactVariant%2+1);
    audio.play('v2/'+cue,e.arts?.20:e.armored?.13:.15,pan);
    for(let i=0;i<(e.arts?16:10);i++)fx.push({type:'spark',x:e.x,y:e.y,vx:(Math.random()-.5)*360,vy:(Math.random()-.7)*270,life:.35+Math.random()*.2,max:.55,color:e.color});continue;
   }else if(e.type==='death'||e.type==='bossDeath'){
    audio.play(e.type==='bossDeath'?'v2/boss-hit2':'v2/body-hit',e.type==='bossDeath'?.45:.10,pan);
    if(e.type==='bossDeath'){e.life=e.max=2.6;shake=12;audio.play('v2/magic-hit',.28,pan);}
    for(let i=0;i<(e.type==='bossDeath'?65:12);i++)fx.push({type:'spark',x:e.x,y:e.y,vx:(Math.random()-.5)*300,vy:-Math.random()*240,life:.5+Math.random()*.8,max:1.3,color:e.color});
   }else if(['skill','nova','slam'].includes(e.type)){
    e.life=e.max=1.05;audio.play(e.type==='slam'?'v2/boss-hit':e.type==='nova'?'v2/magic-hit':'v2/magic-cast',e.type==='slam'?.36:.22,pan);shake=e.type==='slam'?9:3;
   }else if(e.type==='deploy'||e.type==='retreat')audio.play('v2/deploy',.24,pan);
   else if(e.type==='warning'||e.type==='bossArrival'){
    audio.play('v2/boss-warning',e.type==='bossArrival'?.38:.18,pan);
    if(e.type==='bossArrival'){shake=5;fx.push({...e,type:'slam',color:['#ed514e','#9bdcfa','#ff893d'][game.mission.id],life:1.4,max:1.4});}continue;
   }else if(e.type==='gateIn'){e.life=e.max=.9;audio.play('v2/gate-in',.12,pan);}
   else if(e.type==='breach'){e.life=e.max=1;audio.play('v2/gate-out',.25,pan);shake=5;}
   else if(e.type==='end')continue;
   fx.push(e);
  }game.events=[];
 }
 function drawEffect(e){combat.effect(e);}
 function drawProjectiles(){combat.projectiles();}
 function draw(){
  ctx.setTransform(scale,0,0,scale,0,0);ctx.fillStyle='#141e24';ctx.fillRect(0,0,W,H);if(!assets)return;
  ctx.save();if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);ctx.drawImage(assets.scenes[game.mission.id],0,0,W,H);
  ctx.beginPath();ctx.rect(0,61,W,652);ctx.clip();
  const u=game.unit(),placing=game.selected>=0&&!u,preview=game.pending?.tile||(placing&&hover&&game.validTile(hover)?hover:null);
  const ghost=preview?{type:game.selected,...preview,dir:game.pending?.dir??2,phase:0,action:null,buff:0,hit:0,slow:0}:null,rangeUnit=u||ghost;
  if(placing||rangeUnit){ctx.fillStyle='#07121c55';ctx.fillRect(0,61,W,652);}
  if(routes||game.phase==='briefing')routePreview();
  if(rangeUnit)combat.range(rangeUnit,time);
  if(placing)for(const tile of game.mission.tiles)if(game.validTile(tile))polygon(tile.poly,tile===preview?'#61ffe369':'#60dbba47',tile===preview?'#ffffff':'#abffe0',tile===preview?4:2.5);
  drawPortals();combat.auras(time);combat.telegraphs(time);
  for(const unit of game.units)groundMark(unit.x,unit.y,unit.dir,unit.type===game.selected);
  const entities=[...game.units.map(v=>({y:v.y,draw:()=>drawUnit(v)})),...game.enemies.map(v=>({y:v.y,draw:()=>drawEnemy(v)})),...game.dead.map(v=>({y:v.y,draw:()=>drawEnemy(v,true)}))];
  entities.sort((a,b)=>a.y-b.y).forEach(v=>v.draw());drawPortals(true);
  if(ghost){groundMark(ghost.x,ghost.y,ghost.dir,true);drawUnit(ghost,true);if(game.pending)drawFacing();}
  combat.auras(time,true);drawProjectiles();for(const e of fx)drawEffect(e);weather();ctx.restore();
 }
 function finishRecord(){if(game.phase!=='victory'||recorded)return;recorded=true;const key=String(game.mission.id);progress[key]=Math.max(progress[key]||0,game.lives===game.mission.lives?3:game.lives>=2?2:1);try{localStorage.setItem('sector01-progress-v3',JSON.stringify(progress));}catch{}}
 function frame(t){if(stopped)return;const raw=Math.min(.05,(t-last)/1000||0);last=t;if(ready){if(!['paused','manual','missions','victory','defeat'].includes(game.phase))time+=raw;const dt=raw*game.speed*(game.selected>=0?.25:1);if(game.phase==='running'){time+=dt-raw;let remaining=dt;while(remaining>0){const s=Math.min(1/60,remaining);game.update(s);remaining-=s;}consume();for(const e of fx){e.life-=dt;if(e.type==='spark'){e.x+=e.vx*dt;e.y+=e.vy*dt;e.vy+=230*dt;}}fx=fx.filter(e=>e.life>0);shake=Math.max(0,shake-20*dt);footstepTimer+=raw;if(footstepTimer>.55&&game.enemies.some(e=>!e.blocked)){audio.play(game.mission.id===1?(Math.floor(time*2)%2?'snow1':'snow2'):(Math.floor(time*2)%2?'step1':'step2'),.055);footstepTimer=0;}finishRecord();}audio.ambience(game.phase==='running',game.mission.id);audio.music(['victory','defeat'].includes(game.phase)?game.phase:['missions','briefing','loading'].includes(game.phase)?'menu':['night','shrine','foundry'][game.mission.id]); draw();}uiTimer+=raw;if(uiTimer>.1){publish();uiTimer=0;}raf=requestAnimationFrame(frame);}
 function point(event){const r=canvas.getBoundingClientRect();return{x:(event.clientX-r.left)*W/r.width,y:(event.clientY-r.top)*H/r.height};}
 function move(event){const p=point(event);hover=game.mission.tiles.find(t=>contains(p.x,p.y,t.poly));if(game.pending){const dx=p.x-game.pending.tile.x,dy=(p.y-game.pending.tile.y+52)*1.3;if(Math.hypot(dx,dy)>35)game.face(Math.abs(dx)>Math.abs(dy)?dx>0?0:2:dy>0?1:3);}canvas.style.cursor=game.pending?'crosshair':hover&&game.validTile(hover)?'pointer':'default';}
 function click(event){if(game.phase!=='running')return;const p=point(event);if(game.pending){const x=game.pending.tile.x,y=game.pending.tile.y-52,dx=p.x-x,dy=p.y-y;if(Math.hypot(dx,dy)>32&&Math.hypot(dx,dy)<150){game.face(Math.abs(dx)>Math.abs(dy)?dx>0?0:2:dy>0?1:3);game.deploy();}else{game.pending=null;}}else if(game.selected>=0&&!game.unit()){const tile=game.mission.tiles.find(t=>contains(p.x,p.y,t.poly));if(tile)game.prepare(tile);}else{const unit=[...game.units].reverse().find(u=>Math.abs(p.x-u.x)<58&&p.y>u.y-148&&p.y<u.y+18);if(unit)game.select(unit.type);else game.selected=-1;}consume();publish();}
 function pause(){if(game.phase==='running'){game.phase='paused';game.pending=null;}else if(game.phase==='paused')game.phase='running';publish();}
 function manual(){if(game.phase==='manual')game.phase=returnPhase;else{returnPhase=game.phase;game.phase='manual';}publish();}
 function missions(){if(game.phase==='missions')game.phase=returnPhase;else{returnPhase=game.phase;game.phase='missions';game.pending=null;}publish();}
 function choose(id){if(!audio.enabled)void audio.enable(true);audio.stopVoice();game.reset(id);fx=[];recorded=false;shake=0;time=0;publish();}
 function key(e){if(e.ctrlKey||e.altKey||e.metaKey||e.repeat)return;if(e.target instanceof HTMLButtonElement&&[' ','Enter'].includes(e.key))return;if(game.phase==='manual'||game.phase==='missions'){if(e.key==='Escape'){e.preventDefault();game.phase=returnPhase;publish();}return;}if(game.pending){const dirs={ArrowRight:0,d:0,ArrowDown:1,s:1,ArrowLeft:2,a:2,ArrowUp:3,w:3};if(e.key in dirs){e.preventDefault();game.face(dirs[e.key]);publish();return;}if(e.key==='Enter'){e.preventDefault();game.deploy();consume();publish();return;}}if(e.code==='Space'){e.preventDefault();pause();}else if(/^[1-5]$/.test(e.key)){game.select(Number(e.key)-1);publish();}else if(e.key.toLowerCase()==='q'){game.skill();consume();publish();}else if(e.key==='Escape'){if(game.pending)game.pending=null;else if(game.selected>=0)game.selected=-1;else pause();publish();}}
 function hidden(){if(document.hidden&&game.phase==='running')pause();}
 const portrait=window.matchMedia('(max-width: 500px) and (orientation: portrait), (pointer: coarse) and (orientation: portrait)');function orient(){if(portrait.matches&&game.phase==='running')pause();}portrait.addEventListener('change',orient);
 canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',click);window.addEventListener('keydown',key);document.addEventListener('visibilitychange',hidden);raf=requestAnimationFrame(frame);
 return{async start(){if(!audio.context)await audio.enable(true);game.start();consume();publish();},select(i){if(i<0){game.selected=-1;game.pending=null;}else game.select(i);publish();},pause,manual,missions,choose,face(dir){game.face(dir);publish();},confirm(){game.deploy();consume();publish();},cancel(){game.pending=null;publish();},speed(){game.speed=game.speed===1?2:1;publish();},skill(){game.skill();consume();publish();},retreat(){game.retreat();consume();publish();},async sound(){await audio.enable(!audio.enabled);publish();},routes(){routes=!routes;publish();},subtitles(){subtitles=!subtitles;game.message('CAPTIONS '+(subtitles?'ON · displayed during operator dialogue':'OFF'),3);publish();},async voices(){audio.voicesEnabled=!audio.voicesEnabled;if(!audio.voicesEnabled)audio.stopVoice();else{if(!audio.enabled)await audio.enable(true);audio.voice('ash');}publish();},async music(){if(!audio.enabled){await audio.enable(true);audio.musicEnabled=true;}else audio.musicEnabled=!audio.musicEnabled;publish();},restart(){choose(game.mission.id);},destroy(){stopped=true;cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',click);window.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',hidden);portrait.removeEventListener('change',orient);audio.destroy();}};
}


