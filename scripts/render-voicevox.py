"""Render the game's original Japanese dialogue with licensed VOICEVOX voices."""
from pathlib import Path
import sys, json, io, wave

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / '.sites-runtime' / 'voicevox'
sys.path.insert(0, str(RUNTIME / 'python'))
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

engine = RUNTIME / 'engine'
onnx = Onnxruntime.load_once(filename=str(next((engine/'onnxruntime/lib').glob('*.dll'))))
synth = Synthesizer(onnx, OpenJtalk(engine/'dict/open_jtalk_dic_utf_8-1.11'), acceleration_mode='CPU', cpu_num_threads=4)
for model_path in (engine/'models/vvms').glob('*.vvm'):
    with VoiceModelFile.open(model_path) as model:
        synth.load_voice_model(model)

# Short conversational lines, character-specific styles, punctuation and prosody.
# Style 11 is the male Takehiro voice; additional model is required for that role.
LINES = [
 ('start','作戦開始！みんな、準備はいい？',2,1.08,1.25,.02),
 ('ash','アッシュ、いっくよ！',1,1.12,1.35,.02),
 ('ash-skill','一気に、突破するよ！',7,1.13,1.35,.01),
 ('bastion','ここは、俺に任せろ。',11,1.03,1.15,0),
 ('bastion-skill','誰も、通さない！',11,1.1,1.4,0),
 ('kestrel','射撃準備、できたよ！',8,1.1,1.28,.01),
 ('kestrel-skill','そこっ！逃がさないよ！',8,1.13,1.4,.01),
 ('lumen','私の光で、照らすよ。',2,1.04,1.25,.01),
 ('lumen-skill','きらめけ！光の刃！',6,1.12,1.4,.02),
 ('suture','大丈夫！すぐに治してあげる。',10,1.1,1.3,.01),
 ('suture-skill','まだまだ！私がついてるよ！',10,1.12,1.4,.02),
 ('victory','やったね！みんな、お疲れさま！',0,1.09,1.35,.02),
]
dest = ROOT/'public/assets/audio/voices'
manifest=[]
style_names={s.id:m.name for m in synth.metas() for s in m.styles}
for key,text,style,speed,intonation,pitch in LINES:
    if style not in style_names:
        raise RuntimeError(f'Missing voice model for style {style}')
    q=synth.create_audio_query(text,style)
    q.speed_scale=speed
    q.intonation_scale=intonation
    q.pitch_scale=pitch
    q.volume_scale=.9
    q.pre_phoneme_length=.035
    q.post_phoneme_length=.07
    q.output_sampling_rate=24000
    wav=synth.synthesis(q,style)
    (dest/f'{key}.wav').write_bytes(wav)
    with wave.open(io.BytesIO(wav)) as f: seconds=f.getnframes()/f.getframerate()
    item={'key':key,'text':text,'voice':f'VOICEVOX:{style_names[style]}','styleId':style,'seconds':round(seconds,3),'sampleRate':24000}
    manifest.append(item)
    print(json.dumps(item,ensure_ascii=True),flush=True)
(dest/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
