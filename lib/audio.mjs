const EFFECTS=['step1','step2','ambience','snow1','snow2',...['slash1','slash2','shot','impact1','impact2','arrow-hit','armor-hit','body-hit','magic-cast','magic-hit','heal','boss-hit','boss-hit2','boss-warning','gate-in','gate-out','ui-select','deploy'].map(s=>'v2/'+s)];
const VOICES=['start','victory','ash','ash-skill','bastion','bastion-skill','kestrel','kestrel-skill','lumen','lumen-skill','suture','suture-skill'];
const MUSIC=['menu','night','shrine','foundry','victory','defeat'];

// Local recordings and pre-rendered Japanese AI dialogue. No runtime speech API.
export class Soundscape {
 constructor(){this.enabled=false;this.voicesEnabled=true;this.musicEnabled=true;this.musicSource=null;this.musicKey=null;this.context=null;this.buffers=new Map();this.pending=new Map();this.last=new Map();this.active=new Map();this.ambient=null;this.voiceSource=null;this.voiceToken=0;this.nextBeat=0;this.volume=.72;}
 async enable(value){
  this.enabled=value;
  if(!value){this.stopAmbience();this.stopVoice();this.stopMusic();return;}
  try{
   if(!this.context){
    this.context=new(window.AudioContext||window.webkitAudioContext)();
    this.master=this.context.createDynamicsCompressor();this.master.threshold.value=-12;this.master.knee.value=12;this.master.ratio.value=4;this.master.attack.value=.005;this.master.release.value=.2;this.master.connect(this.context.destination);
    this.effects=this.context.createGain();this.effects.gain.value=1;this.effects.connect(this.master);
   }
   await this.context.resume();await Promise.all([...EFFECTS,...VOICES.map(v=>'voices/'+v),...MUSIC.map(v=>'music/'+v)].map(name=>this.load(name)));this.play('v2/ui-select',.12);
  }catch{this.enabled=false;}
 }
 async load(name){
  if(this.buffers.has(name))return this.buffers.get(name);
  if(this.pending.has(name))return this.pending.get(name);
  const request=(async()=>{try{const r=await fetch('/assets/audio/'+name+(name.startsWith('music/')?'.ogg':'.wav'));if(!r.ok)return;const buffer=await this.context.decodeAudioData(await r.arrayBuffer());this.buffers.set(name,buffer);return buffer;}catch{return;}finally{this.pending.delete(name);}})();
  this.pending.set(name,request);return request;
 }
 play(name,volume=.2,pan=0,rate=1,lowpass=0){
  if(!this.enabled||!this.context||!this.buffers.has(name))return;
  const now=this.context.currentTime,key=name.replace(/[12]$/,''),heal=name==='v2/heal';
  if(now-(this.last.get(key)??-10)<(heal?.6:name.includes('gate')?.3:.085)||(this.active.get(key)||0)>=(heal?1:3))return;this.last.set(key,now);
  const s=this.context.createBufferSource(),g=this.context.createGain();s.buffer=this.buffers.get(name);s.playbackRate.value=rate;g.gain.value=volume*this.volume;
  this.active.set(key,(this.active.get(key)||0)+1);s.onended=()=>this.active.set(key,Math.max(0,(this.active.get(key)||1)-1));
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
 music(scene){
  if(!this.context||!this.enabled||!this.musicEnabled){this.stopMusic();return;}
  const key='music/'+scene,result=scene==='victory'||scene==='defeat';
  // Stop the combat loop immediately, even when a result cue is still loading.
  if(key!==this.musicKey){
   this.stopMusic(!result);
   const buffer=this.buffers.get(key);if(!buffer)return;
   const source=this.context.createBufferSource(),gain=this.context.createGain();
   source.buffer=buffer;source.loop=!result;source.loopStart=0;source.loopEnd=buffer.duration;
   source.playbackRate.value=1;gain.gain.value=0;source.connect(gain);gain.connect(this.master);
   this.musicSource=source;this.musicGain=gain;this.musicKey=key;
   source.onended=()=>{if(this.musicSource===source)this.musicSource=null;};
   source.start();
  }
  // Keep the completed result key: animation frames must never restart its cue.
  if(!this.musicSource)return;
  const volume={menu:.34,night:.25,shrine:.25,foundry:.24,victory:.42,defeat:.38}[scene]*this.volume*(this.voiceSource?.55:1);
  this.musicGain.gain.setTargetAtTime(volume,this.context.currentTime,result?.05:this.voiceSource?.1:.5);
 }
 stopMusic(fade=false){
  if(this.musicSource){const source=this.musicSource;source.onended=null;try{if(fade){const now=this.context.currentTime;this.musicGain.gain.cancelScheduledValues(now);this.musicGain.gain.setTargetAtTime(0,now,.15);source.stop(now+.6);}else source.stop();}catch{}}
  this.musicSource=null;this.musicKey=null;
 }
 ambience(active,biome=0){
  if(!active||!this.enabled){this.stopAmbience();return;}
  if(this.ambient||!this.buffers.has('ambience'))return;
  const s=this.context.createBufferSource(),g=this.context.createGain(),f=this.context.createBiquadFilter();s.buffer=this.buffers.get('ambience');s.loop=true;s.playbackRate.value=1;f.type='lowpass';f.frequency.value=[2200,3700,1100][biome];g.gain.value=.075*this.volume;s.connect(f);f.connect(g);g.connect(this.effects);s.start();this.ambient=s;
 }
 tension(active){
  if(!active||!this.enabled||!this.context){this.nextBeat=0;return;}
  const now=this.context.currentTime;if(now<this.nextBeat)return;
  // Quiet, widely spaced authored low impacts support the boss, without the
  // synthetic heartbeat produced by pitching ordinary hits down an octave.
  this.play('v2/boss-hit2',.055,0,1,280);this.nextBeat=now+3.4;
 }
 stopAmbience(){if(this.ambient){try{this.ambient.stop();}catch{}this.ambient=null;}}
 destroy(){this.stopAmbience();this.stopVoice();this.stopMusic();this.context?.close();}
}

