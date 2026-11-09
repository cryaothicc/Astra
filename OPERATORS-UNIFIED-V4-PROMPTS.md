# Unified operators v4 — prompts and provenance

Generated 2026-11-09 using the built-in image_gen tool, transparent_background=true. No CLI fallback. Both source references and existing operators-idle.png were visually inspected. Final asset copied without resampling or pixel processing.

Final: public/assets/operators-unified-v4.png

- PNG RGBA, 1374 × 1145 pixels. Six equal columns × five equal rows; 229 × 229 pixels per cell.
- Rows: Ash, Bastion, Kestrel, Lumen, Suture.
- Columns: rest open eyes, rest closed-eye blink, anticipation/windup, attack release, follow-through, rest/recovery.
- All characters face right. The original clean hair silhouettes, costumes and weapons are retained. Lumen uses an elongated staff cage throughout. Persistent staff core/ring is attached to the head.
- Foot bottoms are consistent within each row to approximately 1–2 pixels. Local alpha>=32 bottom positions: Ash 212–213, Bastion 206–207, Kestrel 199–200, Lumen 193–195, Suture 190. Runtime should register each row to its own foot baseline and use one consistent scale per operator.
- Transparent pixels: 896,114 / 1,573,230 (56.96%) have exact alpha 0. Another 209,633 pixels have alpha 1–31. All 30 cells have zero alpha>=32 pixels on any cell boundary. Faint low-alpha glow fringe remains; do not mistake the preview's vivid fringe RGB for opaque painted backgrounds.
- Requested 2400 × 2000; built-in generator returned 1374 × 1145. The file is not artificially upscaled.
- Padding is substantially increased in the second pass; some attack poses approach the requested 10% gutters more closely than others (smallest opaque left margin is 7 px for Lumen release). No opaque boundary crossing was found.

Source references:

1. C:/Users/Itrbf/AppData/Local/Temp/codex-clipboard-7162c29f-c7d2-4faf-bbc5-df9d10d0b229.png — master character/idle designs
2. C:/Users/Itrbf/AppData/Local/Temp/codex-clipboard-c8565051-6a97-4304-9929-8b63736a367c.png — original action pose reference
3. C:/Users/Itrbf/Documents/Codex/2026-11-07/can/work/public/assets/operators-idle.png — existing asset inspected, visually matches master

First generation output:
C:/Users/Itrbf/.codex/generated_images/01a1b4f8-90d6-7640-b9dc-ba65465d1819/exec-51637d6d-e6ee-4022-a257-d25dc7b07680.png

Final spacing-correction output:
C:/Users/Itrbf/.codex/generated_images/01a1b4f8-90d6-7640-b9dc-ba65465d1819/exec-53e3d964-4856-4224-a152-312793948576.png

## Exact generation prompt

Use case: stylized-concept.
Asset type: one production transparent anime chibi game sprite atlas, preferably 2400 x 2000 pixels, 6 equal columns by 5 equal rows, exactly 30 separate full-body sprites, no labels or grid lines.
Inputs: Image 1 is the MASTER design reference: original clean elegant idle characters. Image 2 is pose/action reference only. Preserve Image 1's exact faces, hair shape, proportions, outfit, armor, weapons and restrained detailed cel-painted rendering. Do not thicken or fluff up the hair.
Primary request: Rebuild these SAME five character identities in one consistent unified animation atlas. EVERY sprite faces RIGHT, including the red ponytail crossbow girl and mint-haired medic (mirror their reference orientation). Across a row, the head size, body scale, hairstyle, weapon design and foot baseline remain identical. All 30 isolated sprites have true alpha transparency, at least 10% empty padding within every cell including effects, with no spill into adjacent cells.

Row 1 (top), ASH: exact slim silver-white long flowing hair and black triangular ear ornaments, amber eyes, orange scarf, black tactical outfit/boots, long black-and-steel spear of original reference. Hair falls in elegant tapering strands, never bulky rounded volume.
Row 2 BASTION: original short tousled dark-brown hair, amber eyes, black layered heavy tactical armor, large tall rectangular dark riot shield with original simple pale shield emblem.
Row 3 KESTREL: original red high ponytail and goggles on crown, slim clean silhouette, black tactical outfit and crossbow. Aim to the RIGHT. Keep ponytail length and goggles identical throughout.
Row 4 LUMEN: original long lavender-purple braid, glasses, white and dark coat, slender staff. EXACT SAME STAFF IN ALL SIX CELLS: a long shaft topped by the reference's elongated pointed crescent/teardrop-shaped open curved cage with a small violet glowing core and delicate purple elliptical ring wrapped around that head. It is NOT a circular disc or round shield. Core and ring always attached to and rotate with this exact staff head. Facing RIGHT.
Row 5 SUTURE: original short mint/turquoise hair, warm tan skin, amber eyes, hoop earring, white medical coat, dark tactical clothes/backpack, original compact arm-mounted medic cannon. Faces and fires RIGHT.

Six animation columns in EACH row, read left to right:
Column 1: REST, eyes fully open, grounded relaxed combat-ready stance. Match the reference idle pose, adapted to right-facing.
Column 2: BLINK, closed eyelids. Otherwise exactly column 1: identical head location, foot location, body height, weapon angle and hair silhouette; only eyelids and an imperceptible hair tip shift. No bounce.
Column 3: WINDUP, physically convincing small arm/torso anticipation with bent knee, planted feet, preparing character-specific attack: spear draw-back, shield tuck, crossbow aim, staff draw-back, cannon brace. No projectile and no release effects.
Column 4: RELEASE, spear thrust / shield bash / crossbow shot / forward staff cast / cannon healing discharge. Visible arm and torso action, readable weight transfer and clean face. Small restrained orange spear spark, shield impact spark, crossbow muzzle spark, violet staff-head cast ring, cyan medic discharge respectively, anchored to the weapon endpoint and wholly within cell.
Column 5: FOLLOW THROUGH, strike settles with trailing spear/scarf and recoil; only a very small decaying weapon-end effect. For Suture the discharge is finished, no second shot. Lumen retains SAME elongated staff and small core/ring.
Column 6: RECOVERY to exactly Column 1 rest pose, eyes open. Match column 1 positioning, scale, hairstyle and weapon.

Style: polished high fidelity hand-painted/cel-shaded 2D anime chibi sprite illustration matching original idle reference, crisp fine linework, small natural hair strands, precise anatomy, 3-head-tall proportion. No pixel art. No background, floor, cast shadow, oval base, aura surrounding bodies, text, labels, numbers, UI or borders. Keep toes grounded on consistent horizontal cell baseline at 88% height. Everything isolated, evenly spaced. Idle motion must come only from blink, no hovering/bobbing/squash/stretch. Character design and staff continuity have priority over decorative effects.

## Exact spacing correction prompt

Use case: precise-object-edit. Edit target: the attached unified 6 columns by 5 rows transparent sprite atlas. This is a technical spacing correction ONLY.
Preserve exactly every character identity, face, hairstyle, delicate hair strands, costume, weapon design, staff shape, row order, frame order, poses, colors and painted anime art. Preserve the same RIGHT-facing direction everywhere, and preserve the dedicated closed-eye blink second column.
Fix only the inadequate cell padding: uniformly reduce each individual full sprite plus its attached effects to 76% of its present size, within its OWN cell. Give each cell a clean fully transparent 12% margin on its left and right, 10% above, and 10% below. Place grounded feet at the identical 88% cell-height baseline, same head/body scale for all six frames of a character. Do not rescale differently by animation frame. Do not let the Ash spear, scarf or Lumen spell rings cross any cell boundary. No pixels whatsoever from neighboring sprites inside a cell. Empty gutters must have actual alpha=0, without white/cyan/magenta fringe haze. Keep the blank area truly transparent. Preserve 6 columns and 5 rows EXACTLY, 30 sprites, no border or divider lines or words.
Preserve Lumen's elongated curved teardrop staff head with its small purple core and ring in all six frames, not a new round disc staff. Only compact weapon discharge in release frame4 and fading effect in followthrough5; no extra aura around bodies. Column6 is exact rest return. Render largest high resolution possible, ideally 2400 x 2000, landscape 6:5 aspect. The sole change is reduced sprite occupancy and clean transparent separation; do NOT redesign the sprites.

