// Small, map-registered movements leave roads and deployment surfaces readable.
const TAU=Math.PI*2;
function glow(ctx,x,y,r,color){
 const gradient=ctx.createRadialGradient(x,y,0,x,y,r);
 gradient.addColorStop(0,color);gradient.addColorStop(1,'#00000000');
 ctx.fillStyle=gradient;ctx.fillRect(x-r,y-r,r*2,r*2);
}
function fan(ctx,x,y,time,phase=0){
 ctx.save();ctx.translate(x,y);ctx.scale(1,.65);
 // Replace the old stationary blades inside the original metal housing.
 ctx.beginPath();ctx.arc(0,0,16,0,TAU);ctx.fillStyle='#18242af2';ctx.fill();ctx.clip();
 ctx.rotate(time*2.1+phase);ctx.fillStyle='#52636c';
 for(let i=0;i<5;i++){ctx.rotate(TAU/5);ctx.beginPath();ctx.moveTo(3,1);ctx.quadraticCurveTo(13,-10,15,-1);ctx.lineTo(5,5);ctx.fill();}
 ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fillStyle='#89949b';ctx.fill();ctx.restore();
}
function steam(ctx,x,y,time,phase=0){
 for(let i=0;i<7;i++){
  const age=(time*.32+i/7+phase)%1;
  glow(ctx,x+Math.sin(age*5+phase)*12,y-age*76,10+age*23,`rgba(178,198,204,${Math.sin(age*Math.PI)*.075})`);
 }
}
function trees(ctx,image,time){
 // Warp just the existing tree canopies, tapering displacement to zero at
 // every edge. Each strip is replaced, so no duplicate trunk is left behind.
 for(const [x,y,w,h,phase]of [[1,62,173,48,0],[1510,62,160,48,1.7]]){
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  for(let dy=0;dy<h;dy+=2){
   const sway=Math.sin(Math.PI*dy/h)*Math.sin(time*.65+phase+dy*.01)*1.8;
   ctx.drawImage(image,x/1672*image.width,y+dy,w/1672*image.width,2,x+sway,y+dy,w,2);
  }ctx.restore();
 }
}
function molten(ctx,time){
 // Pour into the ladle already painted on the far left of Cinder Works.
 ctx.save();ctx.lineCap='round';
 for(let i=0;i<3;i++){
  ctx.strokeStyle=['#e75321aa','#ffb635b8','#fff0a0bd'][i];ctx.lineWidth=[10,5,2][i];
  ctx.beginPath();ctx.moveTo(87,367);ctx.bezierCurveTo(86+Math.sin(time*3)*.7,385,87,408,86,431);ctx.stroke();
 }
 for(let i=0;i<9;i++){
  const y=369+(i*8+time*64)%62;ctx.fillStyle='#fff3b3b8';ctx.fillRect(84+Math.sin(i+time)*1.2,y,2,3);
 }
 for(let i=0;i<4;i++){
  const age=(time*.8+i*.25)%1;ctx.globalAlpha=(1-age)*.55;ctx.strokeStyle='#ffbe50';ctx.lineWidth=1.4;
  ctx.beginPath();ctx.ellipse(86,435,4+age*24,2+age*7,0,0,TAU);ctx.stroke();
 }ctx.restore();
 const pools=[[349,211,34],[456,212,32],[889,636,33],[999,638,34],[1106,637,33],[1430,449,31]];
 for(const [x,y,r]of pools){
  glow(ctx,x,y,r*1.5,`rgba(255,108,25,${.10+Math.sin(time*2+x)*.035})`);
  ctx.save();ctx.beginPath();ctx.ellipse(x,y,r,8,0,0,TAU);ctx.clip();
  for(let i=0;i<5;i++){
   const age=(time*.35+i*.2+x*.001)%1;ctx.globalAlpha=Math.sin(age*Math.PI)*.5;
   ctx.strokeStyle='#ffbe53';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x+(i-2)*9,y,age*13,age*4,0,0,TAU);ctx.stroke();
  }ctx.restore();
 }
 steam(ctx,1503,648,time,.2);steam(ctx,128,597,time,.7);
}
export function drawEnvironment(ctx,biome,time,image){
 ctx.save();
 if(biome===2){molten(ctx,time);}
 else{
  const fans=biome===0?[[524,166],[566,166],[355,572],[411,572]]:[[524,166],[566,166],[378,574],[419,574]];
  fans.forEach(([x,y],i)=>fan(ctx,x,y,time,i));
  steam(ctx,822,210,time);steam(ctx,1444,494,time,.5);
  if(biome===1)trees(ctx,image,time);
  else{
   for(let i=0;i<18;i++){
    const age=(time*.55+i*.137)%1,x=i%2?1540+(i%3)*35:38+(i%3)*34,y=235+(i*79)%420;
    ctx.globalAlpha=(1-age)*.19;ctx.strokeStyle='#c1d6df';ctx.lineWidth=1;
    ctx.beginPath();ctx.ellipse(x,y,2+age*13,1+age*4,0,0,TAU);ctx.stroke();
   }ctx.globalAlpha=1;
  }
 }
 ctx.restore();
}
