# Sector 01 — Checkpoint

A playable Arknights-inspired tower-defense prototype closely based on the supplied concept image. One industrial battlefield, five operators, and a complete 35-enemy mission.

## Play

- Click an operator portrait, then a teal tile to deploy. Keys 1–5 also select operators.
- Ash, Bastion, and Kestrel begin deployed. Add Lumen and Suture with regenerating DP.
- Select a deployed operator to inspect health, activate a charged skill (Q), or retreat.
- Space pauses/resumes. Escape cancels selection or toggles pause.
- The speed button cycles 1× / 2× / 3×. Audio starts muted; enable it in the bottom toolbar.
- Keep enemies away from the blue exit. Defend against all 35 hostiles with at least one life remaining to win.

## Run locally

Requires Node.js 22.13+.

```
npm ci
npm run dev
```

Open the Local URL printed by the development server. The project uses the provided Vinext/Vite Sites starter.

## Verification

```
node scripts/game-tests.mjs
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

The model tests exercise resource constraints, pause, retreat and redeployment cooldowns, skills, healing, damage, full victory and defeat, and restart. Browser checks cover visible map/card rendering, placement, skill controls, sound toggle, pause/resume, and results.

## Assets and implementation

- `lib/game.mjs`: deterministic combat model and Canvas 2D renderer, separate from React HUD.
- `app/page.tsx`: interactive HUD, roster, operator details, manual, and end screens.
- `public/assets/battlefield.png`: generated clean background plate matching the supplied image.
- `public/assets/operators.png`: generated transparent 5-column, 4-pose operator atlas.
- `public/assets/enemies.png`: generated transparent 4-column, 2-row enemy animation atlas.
- `public/assets/reference.png`: supplied reference, rendered through SVG viewports for the exact original portrait artwork.

Animation includes sprite-based walking and attacks, idle breathing, recoil, hit flashes, death motion/fade, projectile trails, melee slashes, particles, floating damage/healing numbers, skill shockwaves, and deployment effects. Audio uses local Web Audio synthesis. No external asset host or API is required during play.

This is a single-mission browser prototype with generated animation poses, not a pixel-for-pixel recreation of a full commercial game's animation system. All gameplay progress is per run; restarting resets the mission.

See `ASSET-PROMPTS.md` for the built-in image-generation briefs.
