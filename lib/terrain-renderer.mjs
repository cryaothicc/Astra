import {BOARD,boardPoint} from './missions.mjs';

// Exact board geometry is shared by roads, deployment tiles, gates and enemies.
// The generated atlas supplies only materials; it cannot move a gameplay lane.
export function paintTerrain(ctx,mission,materials){
 const road=new Set(mission.roads.map(p=>p.join(','))),high=new Set(mission.high.map(p=>p.join(','))),pits=new Set(mission.pits.map(p=>p.join(',')));
 const palette=[['#263137','#10181e','#52616a'],['#667989','#263d50','#a2b5be'],['#493d36','#201e22','#746353']][mission.id];
 const cw=materials?.width/4,ch=materials?.height/3;
 const face=(points,fill,stroke)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.4;ctx.stroke();}};
 ctx.fillStyle='#071018a8';ctx.fillRect(0,61,1672,650);
 // A common plinth grounds the playable board in each painted environment.
 const left=BOARD.x-55,right=BOARD.x+(BOARD.cols-1)*BOARD.dx+55,top=BOARD.y-43,bottom=BOARD.y+(BOARD.rows-1)*BOARD.dy+43;
 ctx.shadowColor='#000';ctx.shadowBlur=35;ctx.fillStyle=palette[1];ctx.fillRect(left-6,top-6,right-left+12,bottom-top+28);ctx.shadowBlur=0;
 for(let r=0;r<BOARD.rows;r++)for(let c=0;c<BOARD.cols;c++){
  const key=`${c},${r}`,[x,gy]=boardPoint([c,r]),isRoad=road.has(key),isHigh=high.has(key),pit=pits.has(key),rise=pit?-6:isRoad?0:isHigh?BOARD.rise:48+(c*7+r*3)%3*7,y=gy-rise,w=52,h=40;
  if(rise>0){face([[x-w,y+h],[x+w,y+h],[x+w,gy+h],[x-w,gy+h]],palette[0],palette[1]);for(let j=0;j<2;j++){ctx.strokeStyle=palette[1]+'88';ctx.beginPath();ctx.moveTo(x-w,gy+h-j*12);ctx.lineTo(x+w,gy+h-j*12);ctx.stroke();}}
  const kind=pit?3:isRoad?0:isHigh?1:2;
  ctx.save();ctx.beginPath();ctx.rect(x-w,y-h,w*2,h*2);ctx.clip();
  if(materials)ctx.drawImage(materials,kind*cw,mission.id*ch,cw,ch,x-w,y-h,w*2,h*2);
  else{ctx.fillStyle=isRoad?palette[0]:palette[2];ctx.fillRect(x-w,y-h,w*2,h*2);}
  ctx.fillStyle=isRoad?'#00000008':pit?'#00000050':'#d4dbe40c';ctx.fillRect(x-w,y-h,w*2,h*2);ctx.restore();
  ctx.strokeStyle=pit?'#101b22':isRoad?palette[2]+'65':palette[2];ctx.lineWidth=1.4;ctx.strokeRect(x-w,y-h,w*2,h*2);
  if(isHigh){ctx.strokeStyle='#d3cba87a';ctx.lineWidth=2;for(const sx of [-1,1])for(const sy of [-1,1]){ctx.beginPath();ctx.moveTo(x+sx*43,y+sy*22);ctx.lineTo(x+sx*43,y+sy*31);ctx.lineTo(x+sx*31,y+sy*31);ctx.stroke();}}
  if(isRoad&&(c+r)%3===0){ctx.fillStyle=palette[2]+'55';for(const sx of [-1,1])for(const sy of [-1,1])ctx.fillRect(x+sx*46-1,y+sy*34-1,2,2);}
  if(isRoad){ctx.strokeStyle=mission.id===0?'#c9a45183':mission.id===1?'#b3e0ef66':'#de9a4e8c';ctx.lineWidth=2;for(const [dc,dr]of [[0,-1],[0,1],[-1,0],[1,0]])if(!road.has(`${c+dc},${r+dr}`)){ctx.beginPath();if(dc){ctx.moveTo(x+dc*49,y-35);ctx.lineTo(x+dc*49,y+35);}else{ctx.moveTo(x-46,y+dr*37);ctx.lineTo(x+46,y+dr*37);}ctx.stroke();}}
  if(!isRoad&&!isHigh&&!pit&&(c+r)%4===0){ctx.fillStyle='#111d2444';ctx.fillRect(x-38,y-26,76,52);ctx.strokeStyle=palette[2]+'45';ctx.strokeRect(x-38,y-26,76,52);}
 }
 ctx.fillStyle=palette[1];ctx.fillRect(left-6,bottom+1,right-left+12,13);ctx.fillStyle=palette[2];ctx.fillRect(left-6,bottom, right-left+12,2);
}
