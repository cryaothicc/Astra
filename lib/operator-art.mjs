// Coordinates in the unified atlas's 229px cells. Keep effects attached to art.
export const WEAPON_TIPS={2:[187,139],3:[146,91],4:[135,129]};
export const BLINK_PATCHES=[
 [[126,110,19,16,122,111],[149,115,12,13,146,114]],
 [[115,99,18,13,114,101],[141,102,11,11,138,104]],
 [[130,103,20,16,123,105],[156,107,12,13,149,109]],
 [[115,88,14,8,109,91],[139,89,7,7,134,93]],
 [[119,80,19,14,114,84],[143,85,12,12,137,89]],
];
export const operatorHeight=y=>118+(y-190)*.07;
export function weaponPoint(unit,facing,frame,reference){
 const [x,y]=WEAPON_TIPS[unit.type]||[114,135];
 const scale=operatorHeight(unit.y)/Math.max(1,reference.bottom-reference.top);
 return {x:unit.x+(x-frame.localPivot)*scale*facing,y:unit.y+(y-frame.bottom)*scale};
}
