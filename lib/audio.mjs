const EFFECTS=['shot','slash','impact','heal','deploy','death','warning','latch','step1','step2','ambience','snow1','snow2','metal','ice','heavy'];
const VOICES=['start','victory','ash','ash-skill','bastion','bastion-skill','kestrel','kestrel-skill','lumen','lumen-skill','suture','suture-skill'];

// Local recordings and pre-rendered Japanese AI dialogue. No runtime speech API.
export class Soundscape {
 constructor(){this.enabled=false;this.voicesEnabled=true;this.context=null;this.buffers=new Map();this.pending=new Map();this.last=new Map();this.ambient=null;this.voiceSource=null;this.voiceToken=0;this.nextBeat=0;this.volume=.72;}
 async enable(value){
  this.enabled=value;
  if(!value){this.stopAmbience();this.stopVoice();return;}
  try{
   if(!this.context){
    this.context=new(window.AudioContext||window.webkitAudioContext)();
    this.master=this.context.createDynamicsCompressor();this.master.threshold.value=-12;this.master.knee.value=12;this.master.ratio.value=4;this.master.attack.value=.005;this.master.release.value=.2;this.master.connect(this.context.destination);
    this.effects=this.context.createGain();this.effects.gain.value=1;this.effects.connect(this.master);
   }
   await this.context.resume();await Promise.all([...EFFECTS,...VOICES.map(v=>'voices/'+v)].map(name=>this.load(name)));this.play('latch',.12);
  }catch{this.enabled=false;}
 }
 async load(name){
  if(this.buffers.has(name))return this.buffers.get(name);
  if(this.pending.has(name))return this.pending.get(name);
  const request=(async()=>{try{const r=await fetch('/assets/audio/'+name+'.wav');if(!r.ok)return;const buffer=await this.context.decodeAudioData(await r.arrayBuffer());this.buffers.set(name,buffer);return buffer;}catch{return;}finally{this.pending.delete(name);}})();
  this.pending.set(name,request);return request;
 }
 play(name,volume=.2,pan=0,rate=1,lowpass=0){
  if(!this.enabled||!this.context||!this.buffers.has(name))return;
  const now=this.context.currentTime,key=name+'/'+(rate<.7?'low':'normal');
  if(now-(this.last.get(key)??-10)<(name==='shot'?.09:.1))return;this.last.set(key,now);
  const s=this.context.createBufferSource(),g=this.context.createGain();s.buffer=this.buffers.get(name);s.playbackRate.value=rate*(.97+Math.random()*.06);g.gain.value=volume*this.volume;
  s.connect(g);let out=g;
  if(lowpass){const f=this.context.createBiquadFilter();f.type='lowpass';f.frequency.value=lowpass;out.connect(f);out=f;}
  if(this.context.createStereoPanner){const p=this.context.createStereoPanner();p.pan.value=Math.max(-.7,Math.min(.7,pan));out.connect(p);out=p;}
  out.connect(this.effects);s.start();
 }
 async voice(key){
  if(!this.enabled||!this.voicesEnabled||!this.context)return;
  this.stopVoice();const token=this.voiceToken,buffer=await this.load('voices/'+key);
  if(!buffer||token!==this.voiceToken||!this.enabled||!this.voicesEnabled)return;
  const s=this.context.createBufferSource(),g=this.context.createGain();s.buffer=buffer;g.gain.value=.84*this.volume;s.connect(g);g.connect(this.master);this.voiceSource=s;
  this.effects.gain.setTargetAtTime(.48,this.context.currentTime,.04);
  s.onended=()=>{if(this.voiceSource===s){this.voiceSource=null;this.effects.gain.setTargetAtTime(1,this.context.currentTime,.15);}};s.start();
 }
 stopVoice(){this.voiceToken++;if(this.voiceSource){this.voiceSource.onended=null;try{this.voiceSource.stop();}catch{}this.voiceSource=null;}if(this.effects)this.effects.gain.setTargetAtTime(1,this.context.currentTime,.1);}
 ambience(active,biome=0){
  if(!active||!this.enabled){this.stopAmbience();return;}
  if(this.ambient||!this.buffers.has('ambience'))return;
  const s=this.context.createBufferSource(),g=this.context.createGain(),f=this.context.createBiquadFilter();s.buffer=this.buffers.get('ambience');s.loop=true;s.playbackRate.value=[1,.83,.72][biome];f.type='lowpass';f.frequency.value=[2200,3700,1100][biome];g.gain.value=.12*this.volume;s.connect(f);f.connect(g);g.connect(this.effects);s.start();this.ambient=s;
 }
 tension(active){
  if(!active||!this.enabled||!this.context){this.nextBeat=0;return;}
  const now=this.context.currentTime;if(now<this.nextBeat)return;
  this.play('impact',.16,0,.48,180);this.nextBeat=now+.96;
 }
 stopAmbience(){if(this.ambient){try{this.ambient.stop();}catch{}this.ambient=null;}}
 destroy(){this.stopAmbience();this.stopVoice();this.context?.close();}
}

