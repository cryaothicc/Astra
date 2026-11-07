"""Render original game dialogue with the local Kokoro model (see VOICE-ASSETS.md)."""
from pathlib import Path
import sys, json
ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / '.sites-runtime' / 'voice-tts'
sys.path.insert(0, str(RUNTIME / 'python'))
import numpy as np
import soundfile as sf
from misaki import ja
from kokoro_onnx import Kokoro

LINES = [
    ('start', '作戦開始。各員、配置について。', 'jf_alpha', 1.02),
    ('ash', 'アッシュ、配置につきます。', 'jf_alpha', 1.10),
    ('ash-skill', '一気に突破する！', 'jf_alpha', 1.12),
    ('bastion', 'ここは俺に任せろ。', 'jm_kumo', .97),
    ('bastion-skill', '誰も通さない！', 'jm_kumo', 1.02),
    ('kestrel', 'ケストレル、射撃位置についた。', 'jf_tebukuro', 1.04),
    ('kestrel-skill', '逃がさない。', 'jf_tebukuro', 1.08),
    ('lumen', '光よ、道を示せ。', 'jf_gongitsune', .98),
    ('lumen-skill', '闇を切り裂け！', 'jf_gongitsune', 1.05),
    ('suture', '大丈夫。すぐに治療する。', 'jf_nezumi', 1.02),
    ('suture-skill', 'まだ諦めないで！', 'jf_nezumi', 1.06),
    ('victory', '作戦完了。全員、よくやった。', 'jf_alpha', 1.0),
]

g2p = ja.JAG2P()
model = Kokoro(str(RUNTIME / 'kokoro-v1.0.onnx'), str(RUNTIME / 'voices-v1.0.bin'))
dest = ROOT / 'public' / 'assets' / 'audio' / 'voices'
dest.mkdir(parents=True, exist_ok=True)
manifest = []
for key, text, voice, speed in LINES:
    phonemes, _ = g2p(text)
    samples, rate = model.create(phonemes, voice=voice, speed=speed, is_phonemes=True)
    # Gentle peak normalization and short edge fades, with no pitch shifting.
    samples = np.asarray(samples, dtype=np.float32)
    peak = float(np.max(np.abs(samples)))
    if peak > 0: samples *= min(2.0, .88 / peak)
    edge = min(int(rate * .008), len(samples) // 4)
    samples[:edge] *= np.linspace(0, 1, edge)
    samples[-edge:] *= np.linspace(1, 0, edge)
    sf.write(dest / f'{key}.wav', samples, rate, subtype='PCM_16')
    item = {'key': key, 'text': text, 'voice': voice, 'seconds': round(len(samples)/rate, 3), 'sampleRate': rate}
    manifest.append(item)
    print(json.dumps(item, ensure_ascii=True), flush=True)
(dest / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
