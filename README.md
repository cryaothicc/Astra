# Astra — Tactical Operations

A playable anime chibi tower-defense game inspired by the supplied concept and Arknights-style tactical deployment. Three complete missions with empty starts, directional placement, class-specific tiles, blocking, armor, healing, skills, retreat/redeployment, and saved star ratings.

## Play

1. Choose a mission and press **Begin Operation**. The battlefield starts empty; hostiles arrive after eight seconds.
2. Select a portrait (or press 1–5), choose a valid tile, select a facing direction, then confirm. Ground operators block roads; ranged operators and medics use raised platforms.
3. Selection slows the simulation to quarter speed. A bright gold grid shows attack range; mint shows healing range. Q activates a charged skill. Space pauses/resumes; Escape cancels selection.
4. DP regenerates. Retreat refunds half the deployment cost and triggers a 25-second cooldown. Defeat triggers 35 seconds; subsequent deployments cost more.
5. Clear every hostile while keeping at least one life. No breaches earns three stars. Best mission ratings persist locally on the device.

Use the toolbar for mission selection, route display, Japanese subtitles, Japanese voices, recorded sound effects, the manual, and fullscreen. Mobile play is landscape-only; portrait orientation pauses play and shows a rotate prompt. Fullscreen attempts orientation lock where the browser supports it. Desktop narrow panels retain a fitted landscape battlefield.

## Missions

| Operation | Enemies | Route and environment | Boss |
|---|---:|---|---|
| Nightwatch | 32 | Rainy loading yard, two routes converge | The Warden, armored knight with enraged phase |
| Pale Sanctuary | 36 | Frozen shrine, opposing entries and periodic whiteouts | Frost Revenant, frost pulses slow nearby operators |
| Cinder Works | 40 | Split foundry lanes, two defense points and furnace eruptions | Cinder Titan, hammer attacks splash nearby operators |

## Animation and audio

The high-resolution painted chibi atlases use drawn idle/blink, anticipation, attack and recovery frames in one consistent six-column atlas, registered to a fixed foot baseline. No bouncing or floating idle transform is applied. Enemy designs differ by biome. All three bosses have four-pose walks, anticipation/release/recovery attacks and four-frame collapse sequences, readable attack telegraphs and an enraged phase. The results screen waits for the boss to fall. Operators follow targets visually without changing their chosen firing arc. Projectiles, slashes, impact particles and healing effects are drawn separately from the character sprites. Red entry and blue defense floor markings align with every route endpoint. Rain, snow, mist and embers animate independently.

Audio uses local licensed weapon/foley/ambient samples with level limits; see the bundled attribution files. No oscillator tones or browser speech synthesis are used. Twelve spoken Japanese AI voice lines are bundled locally: deployment and skill lines for each operator, operation start and victory. The VOICES control is independent of subtitles; effects duck under speech. The sound control mutes all audio. Dialogue was generated locally using VOICEVOX; no paid service or browser voice installation is required during play. See VOICE-ASSETS.md and the in-game voice credits for model, voice, license, and reproduction details.

Each stage has 3 lives and a 5-operator limit. Limited DP, armor, block costs, split routes and active skills make deployment order and timing matter. Each stage uses a distinct authored assault schedule, shown before deployment. Suture heals 135 HP every 1.9 seconds; the 650 HP medical skill only affects allies in range and charges over 38 seconds. Foundry vents deal 280 damage to operators and 550 Arts damage to enemies, allowing timed hazard tactics.

Battle music: “Nightfall”, “Tears of a Distant Sun” and “The Encounter” by Scott Buckley, released under CC-BY 4.0: https://www.scottbuckley.com.au. Menu music: “The Restoration” by Scott Buckley (CC-BY 4.0); result cues by FiftySounds. Full source links, changes and licenses are in `public/assets/audio/music/CREDITS.txt`. Victory and defeat immediately stop battle music, play one result cue, then remain silent.

## Development

Requires Node.js 22.13+. Uses the supplied Vinext/Vite Sites starter.

    npm ci
    npm run dev

Open the Local URL printed by the server.

## Verification

    node scripts/tactics-tests.mjs
    node scripts/presentation-tests.mjs
    node node_modules/typescript/bin/tsc --noEmit
    npm run build

Tests cover empty starts, ground/high-ground restrictions, two-step placement, facing arcs, deployment cost and cooldowns, pause, retreat, projectile damage on impact, defeat, healing, skills, boss encounters, hazards, full wins on all three missions, and clean restarts. Presentation tests also verify exact range agreement, animation states and one-shot result music transitions.

## Project files

- components/TacticalGame.tsx — HUD, roster, mission selection, briefing, manual and result screens.
- lib/missions.mjs — map routes, deployment tiles, operator statistics and firing arcs.
- lib/battle.mjs — combat simulation.
- lib/tactics.mjs — Canvas renderer, input, animation registration, particles and weather.
- lib/audio.mjs — recorded-sample playback, Japanese voices, ducking and ambience.
- lib/combat-renderer.mjs — gates, range previews, telegraphs and effects.
- lib/visual-state.mjs — target-facing and animation states.
- public/assets — all map, operator, enemy, boss, portrait and audio assets used in play.
- MAP-PROMPTS.md, REVISION-ASSET-PROMPTS.md — built-in image generation briefs.
- AUDIO-ASSETS.md, VOICE-ASSETS.md — audio provenance, licenses and delivered voice scripts.
- COMBAT-ASSET-PROMPTS.md — final operator and boss sprite generation prompts.

This is a three-mission browser game with original generated battle art and the supplied portrait artwork. It does not include the full commercial Arknights campaign, progression, collection system or original game's voice recordings.
