// Authored, repeatable assaults: each front tests a different deployment decision.
const kinds={G:'grunt',R:'runner',H:'heavy',S:'shooter',B:'boss'};
export const ASSAULTS=[
 [
  {name:'Recon column',units:'GGGRGGGRGG',note:'Build DP on the upper approach.'},
  {name:'Armored pincer',units:'HGSGRHGSGR',note:'Lower entry opens. Pair Arts with a blocker.'},
  {name:'Captain’s escort',units:'HGSRHGSBGSRG',note:'Leave block capacity for the Warden.'},
 ],
 [
  {name:'Opposing patrols',units:'GGRGGSGRGRGG',note:'North patrol joins after the first six hostiles.'},
  {name:'Whiteout rush',units:'RSHGRSHGRSHG',note:'Fast groups arrive during reduced visibility.'},
  {name:'Frozen procession',units:'HSGRHGSBGSRG',note:'Spread support against frost pulses.'},
 ],
 [
  {name:'Split incursion',units:'GGRGGSRGGRGG',note:'Both entries active. Defend the shared conveyor.'},
  {name:'Furnace convoy',units:'HRSGHRSGHRSGRG',note:'Bait armor into the marked vent blasts.'},
  {name:'Overheat',units:'HRGSHRGSGBHSGR',note:'Hammer escort splits toward both defense points.'},
 ],
];
export function assaultSchedule(mission){
 const schedule=[];
 ASSAULTS[mission].forEach((wave,w)=>[...wave.units].forEach((code,i)=>{
  let lane=mission===0?(w===0?0:i%2):mission===1?(w===0?(i<6?0:1):Math.floor(i/3)%2):i%2;
  if(code==='B')lane=mission===1?1:0;
  const delay=i===0?(w===0?8:11):w===0?4.8:mission===0?(i%3===1?1.5:4.6):mission===1?(i%3===0?6:2.2):(i%4===0?6:2.6);
  schedule.push({kind:kinds[code],lane,wave:w+1,delay,name:wave.name});
 }));
 return schedule;
}
