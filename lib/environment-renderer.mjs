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
function steam(ctx,x,y,time,phase=0,size=1){
 for(let i=0;i<9;i++){
  const age=(time*(.12+(i%3)*.013)+i/9+phase)%1,drift=Math.sin(time*.37+phase)*18;
  const cx=x+(Math.sin(age*4+phase)*18+drift)*age*size,cy=y-age*105*size;
  const opacity=Math.sin(age*Math.PI)**2*.065;
  glow(ctx,cx,cy,(13+age*31)*size,`rgba(171,179,183,${opacity})`);
  glow(ctx,cx+12*size,cy+7*size,(9+age*21)*size,`rgba(197,199,195,${opacity*.45})`);
 }
}
function warpRegion(ctx,image,x,y,w,h,time,strength,phase){
 // Replace each strip of the painted smoke/fire, never leave a still duplicate
 // underneath. Zero displacement at the boundary keeps adjacent metal rigid.
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 for(let row=0;row<h;row+=4){
  const taper=Math.sin(Math.PI*row/h),dx=Math.sin(row*.042-time*1.6+phase)*strength*taper;
  const dy=Math.sin(row*.025-time*.93+phase)*strength*.55*taper,sh=Math.min(4,h-row);
  ctx.drawImage(image,x+dx,y+row+dy,w,sh,x,y+row,w,sh);
 }ctx.restore();
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
const furnaces=[[299,164,96,56],[404,164,95,56],[840,580,99,65],[948,580,99,65],[1056,580,99,65],[1382,410,98,45]];
function fire(ctx,image,time){
 for(const [index,[x,y,w,h]]of furnaces.entries()){
  ctx.save();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w-8,y+h);ctx.lineTo(x+8,y+h);ctx.closePath();ctx.clip();
  warpRegion(ctx,image,x,y,w,h,time,2,index);
  for(let i=0;i<8;i++){
   const phase=time*(2+i*.16)+i*2.41+index,height=9+(Math.sin(phase)+1)*9;
   const cx=x+12+i*(w-24)/7,base=y+h-3,lean=Math.sin(phase*.73)*4,half=3+(i%3);
   const gradient=ctx.createLinearGradient(cx,base-height,cx,base);
   gradient.addColorStop(0,'#ff752800');gradient.addColorStop(.35,'#f7682090');gradient.addColorStop(.85,'#ffb331cb');gradient.addColorStop(1,'#ffe08bb3');
   ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(cx-half,base);
   ctx.bezierCurveTo(cx-half*2,base-height*.4,cx+lean-half,base-height*.75,cx+lean,base-height);
   ctx.bezierCurveTo(cx+lean,base-height*.55,cx+half*2,base-height*.3,cx+half,base);ctx.fill();
  }ctx.restore();
 }
}
function embers(ctx,time){
 const sources=[[45,355],[92,190],[1530,338],[1590,620],[352,213],[455,213],[886,638],[999,638],[1103,638],[1430,448]];
 ctx.save();ctx.lineCap='round';
 for(let i=0;i<76;i++){
  const [sx,sy]=sources[i%sources.length],period=2.6+(i%7)*.53,age=(time/period+i*.618)%1;
  const x=sx+Math.sin(i*15.7)*32+Math.sin(time*.6+i)*age*24+age*(i%2?22:-18),y=sy-age*(65+(i%5)*35);
  ctx.globalAlpha=Math.sin(age*Math.PI)**1.5*(.28+(i%3)*.15);
  ctx.strokeStyle=i%3?'#ffa45d':'#ffe1a0';ctx.lineWidth=.8+(i%3)*.35;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.sin(time+i)*1.3,y+1.5+(i%4));ctx.stroke();
 }ctx.restore();
}
function molten(ctx,time,image){
 // Broad smoke banks already painted at the perimeter drift and curl.
 for(const [x,y,w,h,phase]of [[1,62,151,164,0],[1489,62,104,130,2],[1,481,144,173,4],[1520,500,150,209,6]])warpRegion(ctx,image,x,y,w,h,time,3.4,phase);
 fire(ctx,image,time);
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
 steam(ctx,1511,652,time,.2,1.8);steam(ctx,113,608,time,.7,1.7);
 steam(ctx,70,220,time,.5,1.4);steam(ctx,1510,195,time,.9,1.35);
 steam(ctx,887,625,time,.4,.55);steam(ctx,1105,627,time,.8,.5);
 embers(ctx,time);
}
export function drawEnvironment(ctx,biome,time,image){
 ctx.save();
 if(biome===2){molten(ctx,time,image);}
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
