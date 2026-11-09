# Combat audio revision 2

Prepared 18 sample-based WAV assets under `public/assets/audio/v2`. No game code changed in this asset task. Expose `assets/audio/v2/CREDITS.txt` from the game's credits UI when integrating.

The main change is material-specific impact samples and authored spell sounds in place of the repeated metallic strike and bell used for unrelated actions. Existing natural bow and cloth sources remain useful. New source packs were published in 2018 and 2015, respectively; these are authored library effects, not new AI generations.

## Sources and licenses

| Source | License | Used for |
| --- | --- | --- |
| [Fleshy Fight Sounds — Will Leamon](https://opengameart.org/content/fleshy-fight-sounds) | [OGA-BY 3.0](https://static.opengameart.org/OGA-BY-3.0.txt) | Sword/body/arrow/armor impacts and boss hammer blows |
| [Magic SFX Sample — ViRiX Dreamcore (David Mckee)](https://opengameart.org/content/magic-sfx-sample) | [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/) | Cast, spell impact, heal, wind gates and boss warning |
| [Battle Sound Effects — artisticdude](https://opengameart.org/content/battle-sound-effects) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Swish variants and bow shot |
| [RPG Audio — Kenney](https://kenney.nl/assets/rpg-audio) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Soft tactile UI and deployment |

Author credits and modification notices are in the shipped `CREDITS.txt`. Original downloaded packs and preparation script are kept in `.sites-runtime/sfx-v2-sources`, outside the public build.

## Integration map

All files are mono PCM16 WAV, 44.1 kHz and peak-normalized to -5 dBFS. Gains below are start values before the global SFX bus; keep playback rate at 1.0 or within 0.98–1.02. Alternate actual variants instead of heavily pitch-shifting one sample.

| File | Cue | Suggested gain |
| --- | --- | ---: |
| `slash1.wav`, `slash2.wav` | Melee swing release, alternate | 0.22 |
| `shot.wav` | Crossbow release | 0.26 |
| `impact1.wav`, `impact2.wav` | Unarmored melee contact, alternate | 0.18 |
| `arrow-hit.wav` | Projectile contact, not the release | 0.14 |
| `armor-hit.wav` | Armored target only; don't layer a clang on every attack | 0.13 |
| `body-hit.wav` | Enemy body blow or defeat contact | 0.17 |
| `magic-cast.wav` | Caster release | 0.19 |
| `magic-hit.wav` | Spell contact with target | 0.20 |
| `heal.wav` | Heal pulse; at most one voice, 600 ms cooldown | 0.16 |
| `boss-hit.wav`, `boss-hit2.wav` | Boss ground contact, alternate | 0.42 |
| `boss-warning.wav` | Anticipation/phase transition, once per event | 0.38 |
| `gate-in.wav`, `gate-out.wav` | Entry/exit wind cues | 0.21 / 0.25 |
| `ui-select.wav` | Selection tactile click | 0.14 |
| `deploy.wav` | Deployment cloth/gear movement | 0.24 |

Use a master compressor/limiter gently and cap each frequent impact family at three overlapping voices. At 2x speed, avoid doubling the frequency of footsteps and long spell tails. Trigger swing/release and target impact at their respective animation events; do not play the whole layered attack at animation start. Pan modestly with the battlefield position. Voice lines should duck the SFX bus slightly rather than compete at full volume.

## Processing and checks

Original source transients preserved. Removed silence/DC offset; converted to mono; resampled 48 kHz sources to 44.1 kHz; normalized peaks; added brief click-free fades. Spell tails shortened for repeated combat. The entry wind and boss anticipation clips reverse authored source excerpts. No oscillators, artificial bell substitutions, or extra reverb were added.

`manifest.json` records exact original filenames, durations, SHA-256 hashes, licensing, suggested gains, cooldowns and concurrency limits. Every WAV was decoded again and checked for finite samples, sample rate, and output peak below 0.57. These are technical checks, not a claim of a completed audible in-game mix review.

## Reference research

The [original Arknights official site](https://arknights.global/) and [Yostar official video channel](https://www.youtube.com/@ArknightsOfficialYostar/videos) were located as references. The browser text tools could not expose an audible original-game combat segment, so this pass does not claim to have auditioned or matched Arknights audio. No copyrighted game audio was downloaded or extracted. The integration guidance above is a sound-design recommendation based on the requested tactical combat feel and the actual free library material, not a factual description of a particular Arknights recording.
