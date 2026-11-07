# Sector 01 audio assets

## Included audio

The game now has file-based CC0 sound samples instead of oscillator tones. All final files below are mono PCM16 WAV at 44,100 Hz, compatible with browser audio decoders. Downloaded source packs were removed after selecting and preparing the needed samples.

| File in `public/assets/audio/` | Use | Original source file | Duration |
| --- | --- | --- | --- |
| `shot.wav` | Bow/crossbow release | artisticdude, `Bow.wav` | 0.352 s |
| `slash.wav` | Spear/blade swish | artisticdude, `swish_2.wav` | 0.250 s |
| `impact.wav` | Heavy shield/armor hit | Kenney Impact Sounds, `impactMetal_heavy_002.ogg` | 0.117 s |
| `heal.wav` | Quiet sampled bell accent for healing | Kenney Impact Sounds, `impactBell_heavy_002.ogg` | 0.542 s |
| `deploy.wav` | Equipment rustle on deployment | Kenney RPG Audio, `clothBelt2.ogg` | 0.591 s |
| `step1.wav` | Concrete footstep variant | Kenney Impact Sounds, `footstep_concrete_000.ogg` | 0.106 s |
| `step2.wav` | Concrete footstep variant | Kenney Impact Sounds, `footstep_concrete_002.ogg` | 0.113 s |
| `death.wav` | Muted body/gear impact | Kenney Impact Sounds, `impactSoft_heavy_001.ogg` | 0.572 s |
| `warning.wav` | Low bell warning accent | Kenney Impact Sounds, `impactBell_heavy_001.ogg` | 1.358 s |
| `latch.wav` | Mechanical click / UI confirmation | Kenney RPG Audio, `metalLatch.ogg` | 0.228 s |
| `ambience.wav` | Loopable dark wind and dripping-water bed | JaggedStone, `dungeon_ambient_1_0.ogg` | 20.000 s |

Short effects had outer silence trimmed, tiny click-prevention fades applied, and peak level limited to 0.8 before PCM conversion. The ambience uses a 22-second source excerpt with a 2-second equal-power overlap at the loop boundary, producing a 20-second loop; its peak level is 0.55. No synthesized oscillator tones, voices, or music were added. Recommended in-game playback levels: ambience 0.08–0.14, footsteps 0.05–0.10, healing 0.10–0.18, combat 0.18–0.28, warning 0.16. Limit concurrent repeated attacks/footsteps so the mix stays clear.

`audio-manifest.json` records final durations, sizes and formats. Files were decoded successfully and checked for nonempty PCM audio, finite samples, valid RIFF headers and safe peak levels. An auditory review was not available in the agent's audio input environment.

## Sources and licenses

All included audio is used under **CC0 1.0**: https://creativecommons.org/publicdomain/zero/1.0/ . Attribution is not required by CC0; the authors are credited here voluntarily.

- **Kenney — Impact Sounds (1.0)**: https://kenney.nl/assets/impact-sounds . The official page and included `License.txt` both identify CC0. Original license retained as `public/assets/audio/LICENSE-KENNEY-IMPACT.txt`.
- **Kenney Vleugels — RPG Audio**: https://kenney.nl/assets/rpg-audio . The official page and included `License.txt` both identify CC0. Original license retained as `public/assets/audio/LICENSE-KENNEY-RPG.txt`.
- **artisticdude — Battle Sound Effects**, submitted by Ogrebane: https://opengameart.org/content/battle-sound-effects . The author-provided page offers CC0 among its license choices; this project uses that CC0 option. Source archive: https://opengameart.org/sites/default/files/battle_sound_effects_0.zip .
- **JaggedStone — Loopable Dungeon Ambience**: https://opengameart.org/content/loopable-dungeon-ambience . Author-provided page identifies CC0 and describes wind/water-drip ambience. Source file: https://opengameart.org/sites/default/files/dungeon_ambient_1_0.ogg .

Kenney now uses a same-page signed download endpoint; temporary signed URLs are intentionally not persisted. The official canonical asset pages above remain the provenance links.

## Japanese voiceovers

The game now includes twelve locally rendered Japanese AI voice files. Runway could not generate speech on its connected plan; the completed alternative uses the freely licensed Kokoro model. No purchase was made. See VOICE-ASSETS.md and public/assets/audio/voices/manifest.json for the delivered lines, voices and provenance.
