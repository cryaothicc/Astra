import { OPERATORS, DIRECTIONS } from './missions.mjs';

export function createCombatRenderer(ctx, game) {
  function polygon(points, fill, stroke, width = 2) {
    ctx.beginPath(); points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath();
    if (fill) { ctx.fillStyle=fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle=stroke; ctx.lineWidth=width; ctx.stroke(); }
  }
  function text(value,x,y,size,color) {
    ctx.font=`bold ${size}px Arial`; ctx.textAlign='center'; ctx.lineWidth=4;
    ctx.strokeStyle='#07131bef'; ctx.strokeText(value,x,y); ctx.fillStyle=color; ctx.fillText(value,x,y);
  }
  function glow(x,y,r,color) {
    const g=ctx.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0,color); g.addColorStop(1,'#00000000');
    ctx.fillStyle=g; ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  function gates(time,front=false) {
    const entries=game.mission.paths.map(p=>({p:p.points[0],entry:true}));
    entries.push({p:game.mission.paths[0].points.at(-1),entry:false});
    for (const {p:[x,y],entry} of entries) {
      const color=entry?'#ff685d':'#5ee3ff', dark=entry?'#3c181b':'#102e43';
      ctx.save(); ctx.translate(x,y);
      if (front) {
        // Portal sill sits in front of feet; actors fade only inside the gate.
        polygon([[-46,5],[40,5],[50,22],[-35,22]],'#17232a',color,3);
        for(let i=-28;i<30;i+=18)polygon([[i,8],[i+9,8],[i+18,19],[i+9,19]],'#b99850');
        ctx.restore(); continue;
      }
      glow(0,-18,112,entry?'#ff4a382b':'#39cfff32');
      polygon([[-47,9],[-40,-113],[40,-113],[48,9]],'#101820f5','#55646b',5);
      polygon([[-36,4],[-31,-101],[31,-101],[36,4]],dark,color,3);
      ctx.save();ctx.shadowColor=color;ctx.shadowBlur=18;
      ctx.strokeStyle=color;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-42,3);ctx.lineTo(-36,-108);ctx.lineTo(36,-108);ctx.lineTo(43,3);ctx.stroke();ctx.restore();
      // Moving energy scanlines stay inside the gate rather than crossing walls.
      ctx.save();ctx.beginPath();ctx.rect(-30,-98,60,98);ctx.clip();
      for(let j=0;j<7;j++){const sy=-110+(time*22+j*19)%135;ctx.fillStyle=entry?'#ff796b22':'#8eefff2c';ctx.fillRect(-30,sy,60,2);}ctx.restore();
      ctx.save();ctx.shadowColor=color;ctx.shadowBlur=13;
      const s=entry?16:22;
      for(let i=0;i<(entry?2:1);i++){const cx=entry?-13+i*24:0;polygon([[cx-s*.6,-70],[cx+s*.45,-52],[cx-s*.6,-34],[cx-s*.2,-52]],color);}
      ctx.restore();
      text(entry?'IN':'DEFEND',0,-130,entry?20:18,color);
      ctx.fillStyle=color;ctx.fillRect(-20,-119,40,2);
      ctx.restore();
    }
  }
  function range(unit,time) {
    const op=OPERATORS[unit.type],s=game.whiteout&&unit.type!==3?.8:1,r=op.range*s,w=op.width*s,back=unit.type===4?145:65;
    ctx.save();ctx.translate(unit.x,unit.y);ctx.scale(1,1/1.12);ctx.rotate(unit.dir*Math.PI/2);
    const a=Math.asin(w/r);
    const shape=()=>{ctx.beginPath();ctx.moveTo(-back,-w);ctx.lineTo(Math.sqrt(r*r-w*w),-w);ctx.arc(0,0,r,-a,a);ctx.lineTo(-back,w);ctx.closePath();};
    shape();ctx.fillStyle=unit.type===4?'#69eac947':'#ffd15c42';ctx.fill();
    ctx.lineWidth=7;ctx.strokeStyle='#07131be8';ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=unit.type===4?'#a6ffe0':'#ffe39a';ctx.stroke();
    ctx.save();shape();ctx.clip();ctx.strokeStyle=unit.type===4?'#a5ffe373':'#ffe9a36b';ctx.lineWidth=1.3;
    for(let x=-back;x<r;x+=55){ctx.beginPath();ctx.moveTo(x,-w);ctx.lineTo(x,w);ctx.stroke();}
    for(let y=-w;y<w;y+=55){ctx.beginPath();ctx.moveTo(-back,y);ctx.lineTo(r,y);ctx.stroke();}
    ctx.restore();
    ctx.setLineDash([16,10]);ctx.lineDashOffset=-time*24;shape();ctx.lineWidth=2;ctx.strokeStyle='#fff7d8';ctx.stroke();ctx.setLineDash([]);
    polygon([[60,-12],[88,0],[60,12],[66,0]],'#ffedbd','#111b22',2);
    ctx.restore();
    text(`${unit.type===4?'HEAL':'ATTACK'} RANGE · ${DIRECTIONS[unit.dir]}`,unit.x,Math.min(695,unit.y+112),15,unit.type===4?'#b1ffe2':'#ffe7a6');
  }
  function telegraphs(time) {
    for(const e of game.enemies){
      if(e.kind!=='boss')continue;
      const color=game.mission.id===1?'#9ee8ff':game.mission.id===2?'#ff9d53':'#ff6c6b';
      if(e.enraged)glow(e.x,e.y-60,105,color+'21');
      if(!e.action||e.action.hitDone)continue;
      const target=game.units.find(u=>u.id===e.action.target),p=Math.min(1,e.action.time/e.action.hitAt);
      const x=e.action.cast?e.x:target?.x??e.x,y=e.action.cast?e.y:target?.y??e.y,r=e.action.cast?240:game.mission.id===2?125:85;
      ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color+'24';ctx.lineWidth=3;
      ctx.beginPath();ctx.ellipse(x,y,r,r*.42,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y,r*p,r*.42*p,0,0,Math.PI*2);ctx.stroke();
      ctx.setLineDash([10,9]);ctx.lineDashOffset=-time*30;ctx.beginPath();ctx.ellipse(x,y,r+8,(r+8)*.42,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      text(e.action.cast?'FROST PULSE':game.mission.id===2?'HAMMER IMPACT':'CLEAVE',x,y+r*.42+23,13,color);ctx.restore();
    }
  }
  function effect(e) {
    const a=Math.max(0,Math.min(1,e.life/e.max)),p=1-a,color=e.color||'#ffd49a';ctx.save();ctx.globalAlpha=Math.min(1,a*2);ctx.fillStyle=color;ctx.strokeStyle=color;
    if(e.type==='damage'){
      ctx.font=`bold ${Number(e.value)>500?28:21}px Arial`;ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#0c1724';ctx.strokeText(String(e.value),e.x,e.y-p*42);ctx.fillText(String(e.value),e.x,e.y-p*42);
    }else if(e.type==='spark'){
      ctx.globalAlpha=a;ctx.strokeStyle=color;ctx.lineWidth=2+a;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x-e.vx*.035,e.y-e.vy*.035);ctx.stroke();
    }else if(e.type==='slash'||e.type==='enemyAttack'){
      const angle=Math.atan2(e.ty-e.y,e.tx-e.x);ctx.translate(e.tx,e.ty);ctx.rotate(angle);
      const radius=e.boss?95:e.type==='enemyAttack'?28:55;ctx.shadowColor=color;ctx.shadowBlur=18;
      ctx.beginPath();ctx.arc(-24,0,radius,-1.15+p*.5,1.2+p*.5);ctx.arc(-34,0,radius*.8,1.2+p*.5,-1.15+p*.5,true);ctx.closePath();ctx.fillStyle=color+'b8';ctx.fill();
      ctx.lineWidth=e.boss?5:3;ctx.strokeStyle='#fff8df';ctx.beginPath();ctx.arc(-24,0,radius,-1.05+p*.5,1.1+p*.5);ctx.stroke();
      if(e.boss)glow(0,0,90,color+'80');
    }else if(e.type==='hitFlash'){
      glow(e.x,e.y,e.arts?64:36,e.arts?'#b785ff85':'#ffeacb77');
      ctx.translate(e.x,e.y);ctx.rotate(p*1.5);ctx.lineWidth=2*a;ctx.beginPath();ctx.arc(0,0,9+p*(e.arts?53:25),0,Math.PI*2);ctx.stroke();
      if(e.arts)for(let i=0;i<6;i++){const q=i*Math.PI/3;polygon([[Math.cos(q)*(10+p*40),Math.sin(q)*(10+p*40)],[Math.cos(q+.11)*(22+p*50),Math.sin(q+.11)*(22+p*50)],[Math.cos(q+.22)*(10+p*40),Math.sin(q+.22)*(10+p*40)]],color);}
    }else if(e.type==='muzzle'){
      ctx.translate(e.x,e.y);ctx.rotate(Math.atan2(e.ty-e.y,e.tx-e.x));glow(0,0,35,color+'88');
      polygon([[0,-7],[35*a,0],[0,7],[8,0]],'#fff4d1');
    }else if(e.type==='deploy'||e.type==='retreat'){
      ctx.globalAlpha=a*.65;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,e.y,30+p*50,10+p*17,0,0,Math.PI*2);ctx.stroke();
      for(let i=0;i<7;i++){ctx.fillRect(e.x-40+i*13,e.y-p*130-i%3*15,2,15*a);}
    }else if(e.type==='heal'){
      glow(e.x,e.y,48,'#5ee1b54a');for(let i=0;i<4;i++){const x=e.x+Math.sin(i*2.4)*30,y=e.y+25-p*75+i*10;ctx.fillRect(x-7,y-2,14,4);ctx.fillRect(x-2,y-7,4,14);}
    }else if(['skill','nova','slam','bossDeath'].includes(e.type)){
      const r=e.type==='nova'?360:e.type==='bossDeath'?240:155,y=e.type==='skill'?e.y+65:e.y;
      glow(e.x,y-30,r*.6,color+'35');ctx.globalAlpha=a*.8;ctx.lineWidth=5*a;
      for(let i=0;i<2;i++){const q=Math.max(0,p-i*.12);ctx.beginPath();ctx.ellipse(e.x,y,25+q*r,9+q*r*.38,0,0,Math.PI*2);ctx.stroke();}
      if(e.type==='slam'||e.type==='bossDeath')for(let i=0;i<10;i++){const q=i*.628;ctx.lineWidth=2*a;ctx.beginPath();ctx.moveTo(e.x+Math.cos(q)*15,y+Math.sin(q)*6);ctx.lineTo(e.x+Math.cos(q)*(30+p*r),y+Math.sin(q)*(30+p*r)*.38);ctx.stroke();}
    }else if(e.type==='breach'){
      ctx.globalAlpha=a*.13;ctx.fillStyle='#d34038';ctx.fillRect(0,61,1672,650);
    }
    ctx.restore();
  }
  function projectiles() {
    for(const p of game.projectiles){
      const t=Math.min(1,p.time/p.duration),isArts=p.kind==='arts',heal=p.kind==='heal',color=isArts?'#c2a0ff':heal?'#8effce':'#ffd295';
      const pos=q=>({x:p.x+(p.tx-p.x)*q,y:p.y+(p.ty-p.y)*q-(isArts||heal?Math.sin(q*Math.PI)*30:0)}),h=pos(t);
      ctx.save();ctx.shadowColor=color;ctx.shadowBlur=isArts?17:9;ctx.lineCap='round';
      for(let i=5;i>0;i--){const tail=pos(Math.max(0,t-i*.035)),end=pos(Math.max(0,t-(i-1)*.035));ctx.strokeStyle=color;ctx.globalAlpha=(1-i/6)*.8;ctx.lineWidth=isArts?6-i*.7:heal?3:2;ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(end.x,end.y);ctx.stroke();}
      ctx.globalAlpha=1;glow(h.x,h.y,isArts?24:heal?18:8,color+'99');ctx.fillStyle='#fff9f0';ctx.beginPath();ctx.arc(h.x,h.y,isArts?4.5:heal?3:2,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }
  return {gates,range,telegraphs,effect,projectiles};
}
