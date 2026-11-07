# Japanese operator voices

Twelve original Japanese dialogue files are now bundled under `public/assets/audio/voices/`. All five operators have deployment and skill lines; command has operation-start and victory lines. They use locally rendered Kokoro Japanese AI voices, with no browser speech fallback or live service requirement. Runway speech was unavailable on the connected plan, so no paid generation was used.

The source script is `scripts/render-japanese-voices.py`. Its model, voice data, and Python dependencies stay in ignored `.sites-runtime/voice-tts/`. Run it using a Python 3.12 interpreter. It expects Kokoro v1.0 ONNX, voices-v1.0.bin, kokoro-onnx, soundfile, Misaki Japanese dependencies (the Windows-compatible pyopenjtalk fork), and unidic-lite. The generated manifest records the exact words and voice assignment.

Playback is tied to real deployment, skill, start, and victory events. A new line replaces the previous line, effects duck during speech, and the separate VO toggle controls voices. The sound control mutes all audio. No actor impersonation or franchise dialogue recordings are used.

SECTOR 01 — JAPANESE AI VOICE CREDITS

Original dialogue written for this game and rendered locally with Kokoro-82M.
These are synthetic preset voices; no Arknights audio or character voice actors were copied.

Model: hexgrad/Kokoro-82M, Apache License 2.0
https://huggingface.co/hexgrad/Kokoro-82M
Voice inventory and source attribution:
https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md

Ash and command: jf_alpha
Bastion: jm_kumo; source voice data Kumonoito, Koniwa (CC BY)
https://github.com/koniwa/koniwa/blob/master/source/tnc/tnc__kumonoito.txt
Kestrel: jf_tebukuro; source voice data Tebukurowokaini, Koniwa (CC BY)
https://github.com/koniwa/koniwa/blob/master/source/tnc/tnc__tebukurowokaini.txt
Lumen: jf_gongitsune; source voice data Gongitsune, Koniwa (CC BY)
https://github.com/koniwa/koniwa/blob/master/source/tnc/tnc__gongitsune.txt
Suture: jf_nezumi; source voice data Nezuminoyomeiri, Koniwa (CC BY)
https://github.com/koniwa/koniwa/blob/master/source/tnc/tnc__nezuminoyomeiri.txt

Runtime used for offline rendering: kokoro-onnx (MIT)
https://github.com/thewh1teagle/kokoro-onnx
Japanese phonemization: Misaki (Apache 2.0)
https://github.com/hexgrad/misaki

Output: 24kHz mono PCM WAV; gentle peak normalization and edge fades.
The game bundles only generated audio and license notices, not model weights.
Exact lines, voice IDs, durations and sample rates: manifest.json.

