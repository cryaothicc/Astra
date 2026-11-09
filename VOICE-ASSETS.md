# Japanese operator voices — revision 2

Twelve original Japanese deployment, skill, operation-start and victory lines are bundled as 24 kHz WAV files. They now use the free VOICEVOX engine in place of Kokoro. Ash uses a sweet style for deployment and a sharper style for her skill; the other roles use their own voice assignments, expressive punctuation and per-line prosody. These are still synthesized voices; subjective naturalness is for the player to assess.

The reproducible renderer is `scripts/render-voicevox.py`. Official VOICEVOX CORE 0.17.1, CPU ONNX Runtime, Open JTalk dictionary and VVM 0/4 models live in ignored `.sites-runtime/voicevox/`. Only finished WAVs, the manifest, and credits are deployed. `scripts/render-japanese-voices.py` is the older Kokoro renderer and should not overwrite these files.

A new line replaces the previous line. Speech ducks combat effects. VO and subtitle toggles are independent. Every line is triggered by an actual start, deployment, skill or victory action; no browser speech synthesis is used. All twelve WAVs were decoded and their durations/sample rates checked. There is no claim of a human listening test.

## Required credit and reuse

SECTOR 01 — JAPANESE VOICE CREDITS

Original game dialogue synthesized locally with VOICEVOX CORE 0.17.1.
Character names below identify the licensed voice libraries, not these game's original operator designs.

Ash: VOICEVOX:ずんだもん (sweet deployment / tsun skill)
Lumen and command: VOICEVOX:四国めたん (normal / tsun / sweet styles)
Kestrel: VOICEVOX:春日部つむぎ
Suture: VOICEVOX:雨晴はう
Bastion: VOICEVOX:玄野武宏(CV:ガロ)

VOICEVOX software and voice-model terms:
https://voicevox.hiroshiba.jp/term/
https://github.com/VOICEVOX/voicevox_vvm/blob/main/TERMS.txt
Individual voice-library terms:
https://zunko.jp/con_ongen_kiyaku.html
https://tsumugi-official.studio.site/rule
https://amehau.com/rules/amehare-hau-rule
https://www.virvoxproject.com/voicevoxの利用規約

The generated voice files remain subject to these voice-library terms.
Anyone reusing or redistributing these files must preserve the applicable VOICEVOX character credits and comply with the linked terms; the same obligations must accompany further redistribution. These voices are synthetic, not recordings of the operators' fictional actors.

Output: 24 kHz mono PCM WAV. Script, styles, speaking speed, intonation and pauses were tailored for these lines. No runtime speech service or voice model is downloaded by the game. Exact words, voice styles and durations are in manifest.json.
