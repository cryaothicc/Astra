const TAU=Math.PI*2;
const random=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};

// A particle keeps its velocity and depth between frames. Gusts curve its
// trajectory; there is no shared grid, wrap clock, or identical falling speed.
export class WeatherField{
 constructor(kind){this.kind=kind;this.time=0;this.gust=0;this.whiteout=0;
  this.particles=Array.from({length:kind==='rain'?165:100},(_,i)=>({
   x:random(i+1)*1732-30,y:61+random(i+501)*652,
   depth:.2+random(i+101)*.8,phase:random(i+201)*TAU,
   fall:random(i+301),drift:random(i+401),spin:random(i+601),
  }));
 }
 update(dt,whiteout=false){
  dt=Math.max(0,Math.min(.1,dt));this.time+=dt;
  this.whiteout+=(Number(whiteout)-this.whiteout)*Math.min(1,dt*1.2);
  const wind=Math.sin(this.time*.31)*22+Math.sin(this.time*.79+1.8)*9;
  this.gust+=(wind-this.gust)*Math.min(1,dt*2);
  for(const p of this.particles){
   const snow=this.kind==='snow',t=this.time;
   p.vx=snow?this.gust*(.5+p.depth)+Math.sin(t*(.5+p.drift)+p.phase)*(9+p.drift*17)+this.whiteout*72:22+this.gust*.8+p.drift*25;
   p.vy=snow?12+p.fall*34+p.depth*14+Math.sin(t*.7+p.phase)*3:320+p.fall*390+p.depth*180;
   p.x+=p.vx*dt;p.y+=p.vy*dt;
   if(p.y>745){p.y=40;p.x=random(p.phase+t)*1732-30;}
   if(p.x>1715)p.x=-30;if(p.x<-40)p.x=1705;
  }
 }
}

export function createWeatherRenderer(ctx){
 let field=null,last=0;
 return function drawWeather(kind,time,whiteout){
  if(kind!=='rain'&&kind!=='snow')return;
  if(!field||field.kind!==kind||time<last){field=new WeatherField(kind);last=time;}
  field.update(time-last,whiteout);last=time;
  ctx.save();ctx.lineCap='round';
  for(const p of field.particles){
   const edge=Math.min(1,(p.y-40)/35,(745-p.y)/45);
   if(kind==='rain'){
    const trail=.012+p.depth*.012;
    ctx.globalAlpha=edge*(.045+p.depth*.16);ctx.strokeStyle='#c6dde8';ctx.lineWidth=.45+p.depth*.65;
    ctx.beginPath();ctx.moveTo(p.x-p.vx*trail,p.y-p.vy*trail);ctx.lineTo(p.x,p.y);ctx.stroke();
   }else{
    const radius=.55+p.depth*1.65;
    ctx.globalAlpha=edge*(.18+p.depth*.44)*(.88+Math.sin(time*1.3+p.phase)*.12);
    ctx.fillStyle=p.depth>.7?'#e4f1f5':'#a8c1d2';
    ctx.beginPath();ctx.ellipse(p.x,p.y,radius,radius*(.45+Math.abs(Math.sin(time*(.6+p.spin)+p.phase))*.45),time*.3+p.phase,0,TAU);ctx.fill();
   }
  }
  if(field.whiteout>.01){ctx.globalAlpha=field.whiteout*.11;ctx.fillStyle='#c5dbe7';ctx.fillRect(0,61,1672,652);}
  ctx.restore();
 };
}
