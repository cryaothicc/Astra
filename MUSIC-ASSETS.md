# Instrumental soundtrack, revision 3

The three battle tracks now share Scott Buckley's cinematic string/percussion palette. This replaces the solo-piano shrine cue and previous JRPG pack battle tracks. The mission-selection cue is now Scott Buckley's The Restoration, a restrained cinematic piano theme from the same Monomyth album as The Encounter. Revision 3 changes only the menu recording; battle and result files are byte-identical to revision 2. Two complete composed orchestral result cues have been added.

| Game cue / file | Recording | License | Recommended gain |
| --- | --- | --- | ---: |
| Mission selection / menu.ogg | The Restoration — Scott Buckley | CC-BY 4.0 | 0.34 |
| Night checkpoint / night.ogg | Nightfall — Scott Buckley | CC-BY 4.0 | 0.28 |
| Frozen shrine / shrine.ogg | Tears of a Distant Sun — Scott Buckley | CC-BY 4.0 | 0.26 |
| Foundry / foundry.ogg | The Encounter — Scott Buckley | CC-BY 4.0 | 0.24 |
| Victory result / victory.ogg | Sfx Triumphant Victory — FiftySounds | FiftySounds License | 0.40 |
| Defeat result / defeat.ogg | Sfx Final Defeat — FiftySounds | FiftySounds License | 0.38 |

The author describes [Nightfall](https://www.scottbuckley.com.au/library/nightfall/) as a dark hybrid of strings, piano and rhythmic backing; [Tears of a Distant Sun](https://www.scottbuckley.com.au/library/tears-of-a-distant-sun/) moves from cello/percussion into driven strings; [The Encounter](https://www.scottbuckley.com.au/library/the-encounter/) builds menacing strings and rhythmic tension. These author descriptions informed the selection. The new material is pre-existing composed music, with no pitch-shifted impacts, generated instrument sketches or franchise recordings.

## Playback integration

Read public/assets/audio/music/manifest.json for exact durations, source ranges, hashes, gains and loop/oneShot flags. Retain music playback rate 1.0 at every game speed. Crossfade mission music over 1.5 seconds. During speech, duck to 55% of the current music level and recover over about 0.6 seconds.

On a mission result, fade/stop the active battle track first, then play the matching victory/defeat cue **once**, with loop = false. Do not restart it when the result view renders again. Do not resume a battle track behind the result panel. Returning to mission selection starts/resumes menu.ogg; retrying starts the current mission's battle music. The root task owns this runtime behavior; this asset task does not change code.

The battle recordings preserve full musical arrangements. They repeat from their natural endings, rather than being cut into short excerpts at arbitrary phrase boundaries. Silence/padding was trimmed and endpoints softened. The result files retain complete, originally composed 5–8-second orchestral cadences. They are not snippets fabricated from hit effects.

## Licenses and provenance

- [The Restoration — Scott Buckley](https://www.scottbuckley.com.au/library/the-restoration/): the author identifies this as a restrained piano rendition of the Monomyth main theme and releases it under CC-BY 4.0. It is a complete existing composition, not an excerpt or generated arrangement.
- Scott Buckley: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/), verified on each recording's official download page. Preserve the exact author credits in CREDITS.txt and expose them through the game's credits UI. Tracks are free for commercial use with attribution.
- [FiftySounds Triumphant Victory](https://www.fiftysounds.com/royalty-free-music/sfx-victory1.html) and [Final Defeat](https://www.fiftysounds.com/royalty-free-music/sfx-defeat1.html): official pages explicitly permit free commercial/noncommercial use; their [license](https://www.fiftysounds.com/music-license.html) expressly covers games and makes attribution optional for sound effects. These are **not CC0**. Use them synchronized in the game; do not distribute them as standalone stock assets. Voluntary attribution is included. The publisher provides a [human-authorship statement](https://www.fiftysounds.com/human-authorship-certification.html).

Downloaded source files, processing code and the previous manifest are preserved in .sites-runtime/music-v2-sources. The old source packs remain in .sites-runtime/music-sources; their obsolete processing script should not be rerun over this revision.

## Processing and checks

All delivered files are 44.1 kHz stereo Ogg Vorbis. Processing is limited to silence/padding trim, global level balancing, endpoint smoothing and encoding. No added instruments, compression, pitch shifts or tempo changes. Every new encoded file is decoded again and checked for finite samples, stereo count, correct sample rate, unchanged intended duration and peak below 0.95. Result cue durations are asserted to be 3–8 seconds. Revision 3 verifies that all five accepted battle/result SHA-256 hashes remain unchanged while replacing only the menu. Menu output is decoded and checked for finite stereo samples, sample rate, duration and peak below 0.95.

These are technical checks and author-description research, not an audible in-game mix review. Final runtime integration should check the transitions and balance at both game speeds.


## Source repository distribution

The menu recording's [CC-BY 4.0 license](https://creativecommons.org/licenses/by/4.0/) permits copying, redistribution and adaptation, including commercially, with attribution, a license link and modification notices. Keep menu.ogg with the complete game source and retain CREDITS.txt plus LICENSE-CC-BY-4.0.txt in the GitHub repository and deployment. The recording remains CC-BY 4.0 even if game code uses another license. This delivery is a synchronized game asset, not a standalone music catalog. Do not claim ownership or submit the recording to fingerprinting services; see the composer's [usage page](https://www.scottbuckley.com.au/library/using-this-music/).
