import { DIRECTIONS, rangeCells, RANGE_CELL, BOARD_PROJECTION } from './missions.mjs';

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
    const entries=game.mission.paths.map((p,i)=>({p:p.points[0],entry:true,next:p.points[1],index:i}));
    const ends=new Map(game.mission.paths.map(p=>[p.points.at(-1).join(','),p]));
    for(const path of ends.values())entries.push({p:path.points.at(-1),entry:false,next:path.points.at(-2)});
    for(const {p:[x,y],entry,next,index} of entries){
      const color=entry?'#f27b70':'#68cfff';ctx.save();ctx.translate(x,y);
      if(front){ctx.restore();continue;}
      polygon([[-50,-38],[50,-38],[50,38],[-50,38]],'#101b22ba','#344752',2);
      ctx.strokeStyle=color;ctx.lineWidth=3;
      for(const [cx,cy,sx,sy] of [[-46,-34,1,1],[46,-34,-1,1],[-46,34,1,-1],[46,34,-1,-1]]){
        ctx.beginPath();ctx.moveTo(cx+sx*17,cy);ctx.lineTo(cx,cy);ctx.lineTo(cx,cy+sy*13);ctx.stroke();
      }
      const dx=entry?next[0]-x:x-next[0],dy=entry?next[1]-y:y-next[1];
      ctx.save();ctx.scale(1,.78);ctx.rotate(Math.atan2(dy/.78,dx));ctx.globalAlpha=.7+.12*Math.sin(time*2);
      for(const offset of [-12,8])polygon([[offset-9,-13],[offset+4,0],[offset-9,13],[offset-2,0]],color);
      ctx.restore();text(entry?'ENTRY '+String.fromCharCode(65+index):'BASE',0,53,10,color);ctx.restore();
    }
  }
  function range(unit,time) {
    const color=unit.type===4?'#a9ffe1':'#ffe2a0',fill=unit.type===4?'#63d5b334':'#ecaa323e';
    ctx.save();ctx.translate(unit.x,unit.groundY??unit.y);ctx.scale(1,1/BOARD_PROJECTION);ctx.rotate(unit.dir*Math.PI/2);
    for(const [x,y] of rangeCells(unit,game)){
      const r=RANGE_CELL/2-3;ctx.save();ctx.translate(x,y);
      ctx.fillStyle=fill;ctx.fillRect(-r,-r,r*2,r*2);
      ctx.lineWidth=5;ctx.strokeStyle='#101923c9';ctx.strokeRect(-r,-r,r*2,r*2);
      ctx.lineWidth=2;ctx.strokeStyle=color;ctx.strokeRect(-r,-r,r*2,r*2);
      ctx.beginPath();ctx.rect(-r+2,-r+2,r*2-4,r*2-4);ctx.clip();
      ctx.strokeStyle=unit.type===4?'#92f5cd7d':'#ffcc777d';ctx.lineWidth=3;
      for(let j=-140;j<150;j+=18){ctx.beginPath();ctx.moveTo(j,-r);ctx.lineTo(j+r*2,r);ctx.stroke();}ctx.restore();
    }
    ctx.fillStyle='#fff6d3';ctx.shadowColor='#f8c273';ctx.shadowBlur=8;
    polygon([[57,-13],[80,0],[57,13],[62,0]],color);
    ctx.restore();
    text(`${unit.type===4?'HEAL':'ATTACK'} · ${DIRECTIONS[unit.dir]}`,unit.x,Math.min(690,unit.y+75),14,color);
  }
  function auras(time,front=false){
    for(const e of game.enemies){
      if(e.kind!=='boss')continue;
      const color=['#ed514e','#9bdcfa','#ff893d'][game.mission.id];
      ctx.save();
      if(!front){
        ctx.translate(e.x,e.y+2);ctx.scale(1,.32);
        glow(0,0,e.enraged?60:46,color+(e.enraged?'55':'28'));
        ctx.strokeStyle=color+'70';ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(0,0,38,0,Math.PI*2);ctx.stroke();
      }else if(e.enraged){
        for(let i=0;i<4;i++){const p=(time*.35+i*.25)%1;ctx.globalAlpha=(1-p)*.5;ctx.fillStyle=color;ctx.fillRect(e.x+Math.sin(i*2.4)*27,e.y-12-p*80,2,3);}
      }ctx.restore();
    }
  }
  function telegraphs(time) {
    for(const e of game.enemies){
      if(e.kind!=='boss')continue;
      const color=game.mission.id===1?'#9ee8ff':game.mission.id===2?'#ff9d53':'#ff6c6b';

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
      const radius=e.boss?122:e.type==='enemyAttack'?38:79;ctx.shadowColor=color;ctx.shadowBlur=20;ctx.globalCompositeOperation='lighter';
      ctx.beginPath();ctx.arc(-24,0,radius,-1.15+p*.5,1.2+p*.5);ctx.arc(-34,0,radius*.8,1.2+p*.5,-1.15+p*.5,true);ctx.closePath();ctx.fillStyle=color+'b8';ctx.fill();
      ctx.lineWidth=e.boss?5:3;ctx.strokeStyle='#fff8df';ctx.beginPath();ctx.arc(-24,0,radius,-1.05+p*.5,1.1+p*.5);ctx.stroke();
      ctx.globalAlpha=a*.5;ctx.lineWidth=2;ctx.beginPath();ctx.arc(-40,0,radius+12,-1+p*.6,1.3+p*.6);ctx.stroke();
      if(e.boss)glow(0,0,105,color+'80');
    }else if(e.type==='hitFlash'){
      ctx.globalCompositeOperation='lighter';glow(e.x,e.y,e.arts?94:48,e.arts?'#b785ff95':'#ffeacb88');
      ctx.translate(e.x,e.y);ctx.rotate(p*1.5);ctx.lineWidth=2*a;ctx.beginPath();ctx.arc(0,0,9+p*(e.arts?53:25),0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#fff9ed';polygon([[0,-22*a],[4,-5],[27*a,0],[4,4],[0,20*a],[-4,4],[-24*a,0],[-4,-4]],'#fff9ed');
      if(e.arts)for(let i=0;i<6;i++){const q=i*Math.PI/3;polygon([[Math.cos(q)*(10+p*40),Math.sin(q)*(10+p*40)],[Math.cos(q+.11)*(22+p*50),Math.sin(q+.11)*(22+p*50)],[Math.cos(q+.22)*(10+p*40),Math.sin(q+.22)*(10+p*40)]],color);}
    }else if(e.type==='muzzle'){
      ctx.globalCompositeOperation='lighter';ctx.translate(e.x,e.y);ctx.rotate(Math.atan2(e.ty-e.y,e.tx-e.x));glow(0,0,48,color+'88');
      if(e.kind==='arts'||e.kind==='heal'){ctx.strokeStyle=color;ctx.lineWidth=3*a;ctx.beginPath();ctx.arc(0,0,12+p*28,0,Math.PI*2);ctx.stroke();polygon([[0,-18],[13,0],[0,18],[-13,0]],'#fff4ff');}
      else polygon([[0,-11],[16,-5],[55*a,0],[16,5],[0,11],[8,0]],'#fff4d1');
    }else if(e.type==='gateIn'||e.type==='breach'){
      const exit=e.type==='breach',c=exit?'#7cdeff':'#ff8175';ctx.globalCompositeOperation='lighter';
      glow(e.x,e.y-35,90,c+'50');ctx.strokeStyle=c;ctx.lineWidth=2*a;
      for(let i=0;i<3;i++){const q=(p+i*.17)%1;ctx.beginPath();ctx.ellipse(e.x+(exit?-q:q)*25,e.y-38,14+q*35,30+q*33,0,0,Math.PI*2);ctx.stroke();}
      for(let i=0;i<12;i++){const q=i*.54;ctx.globalAlpha=a*(.5+i%3*.15);ctx.fillStyle=c;ctx.fillRect(e.x+Math.sin(q)*p*65,e.y-15-Math.cos(q)*p*55,2,8*a);}
      if(exit){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a*.07;ctx.fillStyle='#d34038';ctx.fillRect(0,61,1672,650);}
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
    }
    ctx.restore();
  }
  function projectiles() {
    for(const p of game.projectiles){
      const t=Math.min(1,p.time/p.duration),isArts=p.kind==='arts',heal=p.kind==='heal',color=isArts?'#c2a0ff':heal?'#8effce':'#ffd295';
      const pos=q=>({x:p.x+(p.tx-p.x)*q,y:p.y+(p.ty-p.y)*q-(isArts||heal?Math.sin(q*Math.PI)*30:0)}),h=pos(t);
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowColor=color;ctx.shadowBlur=isArts?22:10;ctx.lineCap='round';
      for(let i=8;i>0;i--){const tail=pos(Math.max(0,t-i*.04)),end=pos(Math.max(0,t-(i-1)*.04));ctx.strokeStyle=color;ctx.globalAlpha=(1-i/9)*.9;ctx.lineWidth=isArts?10-i*.8:heal?5:3;ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(end.x,end.y);ctx.stroke();}
      ctx.globalAlpha=1;glow(h.x,h.y,isArts?37:heal?25:12,color+'aa');ctx.fillStyle='#fff9f0';ctx.beginPath();ctx.arc(h.x,h.y,isArts?7:heal?4:2.5,0,Math.PI*2);ctx.fill();
      if(isArts){ctx.strokeStyle='#dac5ff';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(h.x,h.y,15,8,p.time*8,0,Math.PI*2);ctx.stroke();}ctx.restore();
    }
  }
  return {gates,range,auras,telegraphs,effect,projectiles};
}
