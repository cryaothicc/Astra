from pathlib import Path
import sys, json
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'.sites-runtime/voice-tts/python'))
import numpy as np
import soundfile as sf
source=ROOT/'.sites-runtime/audio-source-packs/impact/Audio'
out=ROOT/'public/assets/audio'
report={}
for name,file in {'snow1':'footstep_snow_000.ogg','snow2':'footstep_snow_002.ogg','metal':'impactMetal_light_000.ogg','ice':'impactGlass_medium_002.ogg','heavy':'impactMetal_heavy_004.ogg'}.items():
    data,rate=sf.read(source/file,dtype='float32',always_2d=True)
    x=data.mean(axis=1);peak=float(np.max(np.abs(x)))
    if peak:x*=.75/peak
    n=min(int(rate*.012),len(x)//4)
    x[:n]*=np.linspace(0,1,n);x[-n:]*=np.linspace(1,0,n)
    sf.write(out/(name+'.wav'),x,rate,subtype='PCM_16')
    report[name]={'source':file,'author':'Kenney','license':'CC0','duration':round(len(x)/rate,3)}
(out/'biome-audio-manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))
