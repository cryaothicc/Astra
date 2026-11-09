# Cohesive hooded elite bosses, revision 4

The bosses were redesigned as compact masked anime-chibi elite soldiers in the same visual family as the regular biome enemies. Existing map assets remain unchanged. The new sprites use the built-in image generation tool; no generated image pixels were edited with code.

## Atlas contracts

`public/assets/boss-unified-v4.png`: 1774×887 RGBA, 6 columns × 3 rows. Rows are Warden, Frost, Cinder. Columns are neutral standing; left-contact walk; passing walk; right-contact walk; attack windup; attack release. All face right. Warden is a dark hooded shield captain with baton and red visor; Frost is a pale fur-hooded masked knight with cyan spear; Cinder is a rust-hooded respirator guard with a compact industrial hammer and small vent backpack. No giant horns, crowns, fantastical monster anatomy or baked aura.

`public/assets/boss-deaths-v4.png`: 1448×1086 RGBA, 4 columns × 3 rows, same exact row identities. Columns are upright recoil; kneeling; collapsing onto an elbow; prone defeat. Do not normalize each collapse frame independently to a standing height. Use a fixed scale per row derived from the upright recoil frame, maintaining the ground baseline while the body gets lower.

All nominal internal column and row boundary lines were decoded and checked: zero pixels with alpha >40, and corner alpha0, in both final PNGs. Upright alpha>40 reference heights are live `[206,202,200]` and death recoil `[274,267,277]` for Warden/Frost/Cinder respectively. Use separate source-atlas normalization to preserve the same rendered actor height when switching between live and death sheets. Death source pose heights naturally fall as the figure collapses; preserve that progression.

The 6-column live schema was already generated before an optional request for an 8-column alternative arrived; the parent instructed preserving the 6-column schema in that situation.

## Inputs and selected outputs

Style/proportion references: existing `enemies.png`, `enemies-snow.png`, `enemies-foundry.png`. Older Warden/Frost/Cinder art was visually inspected for contrast but not supplied as generation reference, to avoid carrying over incompatible giant monster silhouettes.

Generated source directory: `C:/Users/Itrbf/.codex/generated_images/01a1b9ec-d591-7b60-9c7e-892528ecf7a8/`.

- Initial live atlas: `exec-72b60842-e1d9-4b08-8b59-800da0c5cd93.png`.
- Selected live atlas after padding/background cleanup: `exec-930629a1-0cf1-4245-b1e3-e560242c39aa.png`.
- Selected matching death atlas: `exec-550a922c-e3a8-45c7-bc63-96c1509a41f7.png`.

The live atlas was cleaned to give wide transparent gutters and remove diffuse background contamination. The final death atlas was generated directly from that cleaned live design, then visually checked for the same armor, hoods, masks and weapons across states. Small emissive accents on eyes/crystal/vent details remain; there is no broad character aura baked into the art. Renderer-owned aura/effects can be kept separate.

## Live generation

```text
Use case: identity-preserve.
Asset type: production transparent 2D anime-chibi tactical enemy animation atlas.
Input image 1 is the industrial masked grunt style/proportion reference. Input image 2 is the snow hooded scout/heavy style reference. Input image 3 is the rusty foundry masked scout/heavy style reference. Create THREE NEW boss variants of those same regular enemy families, in exactly the SAME anime chibi rendering style, similar head-to-body ratio, modest armor detail and grounded compact silhouettes. They must look like elite troops belonging beside those grunts, not another game's oversized fantasy monsters.

OUTPUT: one true transparent PNG, exactly SIX equal columns and THREE equal rows, aspect ratio 2:1 (ideally 1920x960). EIGHTEEN separate full-body sprites. Every cell same square dimensions. No background, floor, shadow ellipse, text, grid lines, borders, labels, checkerboard or watermark. Keep 30px or more transparent empty space around each complete sprite including its entire weapon. No neighboring-cell overlap. Feet sit at 84% down each square cell. All 18 characters face SCREEN RIGHT in three-quarter side view, never left. Uniform body/head scale across all six frames in a row. Compact body about 2.5 heads tall, like the masked hooded regular enemies. These should display at only ~150px height in game. Keep arm/knee articulation clear, outlines crisp and shaded detail readable.

ROW 1: WARDEN, an elite tactical SHIELD CAPTAIN derived from the dark hooded red-eyed grunt. Same oversized dark hood, narrow glowing RED VISOR over black angular face mask, compact dark-gray layered combat armor and boots, small crimson rank patch, a short dark red shoulder cape ending at thigh. Carries a rectangular dark riot shield with narrow red stripe, plus short practical baton in free hand. A little heavier armor than grunt, but NOT huge. No horns, crown, skull-face, giant flowing cape or elaborate gothic axe.
ROW 2: FROST, an elite pale HOODED MASKED KNIGHT derived from the snow heavy. Same blue-gray hood with white fur trim, ivory face mask and narrow CYAN VISOR, compact pale silver/blue-gray plate armor, sturdy boots, short fur-edged cloak. Carries a practical medium-length spear with a small luminous cyan crystal tip. Spear fits entirely within the cell. No exposed human face, flowing white hair, crown, giant scythe or huge robe.
ROW 3: CINDER, an elite armored HOODED FURNACE GUARD derived from the foundry heavy. Rust-brown protective hood, black respirator mask with two AMBER round lenses, compact soot-dark armor, small furnace backpack with only two tiny orange vent slits, short ragged brown work-coat hem, heavy boots. Carries a chunky industrial metal hammer about shoulder width. No flaming giant core, giant cape, smokestack fire, horns, monster anatomy or exaggerated gigantic body.

COLUMN 1 NEUTRAL: grounded ready stance, feet separated and both down, weapon held naturally ready; shield captain keeps shield ahead.
COLUMN 2 WALK CONTACT LEFT: left foot planted forward/rightward, right leg trailing, torso and shoulders counterrotate subtly, elbows and cloth move with the step, weapon weight carried believably.
COLUMN 3 WALK PASSING: weight over one planted foot, other knee bent passing under body, subtle downward compression, arms/shoulders follow through; visibly a distinct natural walking pose.
COLUMN 4 WALK CONTACT RIGHT: opposite foot forward/rightward, previous leading leg now trailing; opposite torso/shoulder twist and cloth lag. The walk cannot be three duplicate static body poses.
COLUMN 5 ATTACK WINDUP: weight shifts back, knee bend, clear intent. Warden retracts baton behind raised shield. Frost draws spear back. Cinder lifts hammer back above shoulder, entire weapon stays inside cell.
COLUMN 6 ATTACK RELEASE: grounded weight transfer into attack toward the RIGHT. Warden lunges baton and shield forward, Frost thrusts spear right, Cinder completes heavy downward hammer strike at his front-right. No embedded hit flashes or particles.

No baked aura, ambient glow cloud, projectile, smoke, flame, speed lines, sparks or ground effect. Tiny emissive eyes/crystal/vent accents only, no halo extending from character. Keep identities and proportions EXACTLY consistent across all frames. No character grows/shrinks during walk or attack. All weapons and boots fully visible and well inside their square. Clean transparent padding is essential for animation crop safety.
```

## Live padding/transparency cleanup

```text
Use case: background-extraction and precise-object-edit.
This is an existing SIX-column × THREE-row boss sprite atlas. Preserve every character design, outfit, weapon, identity, direction and pose. Preserve exact 6×3 layout. Change ONLY padding and background cleanup.

1. Scale each complete sprite including its weapon down to about 72% of its current size within its nominal cell, so every cell has broad clear transparent margins. Uniform body scale per row. Center the character body at the cell horizontal center with feet baseline at 83% of cell height. Keep all weapons, cloaks and boot soles inside their own cell, with at least 30px transparent empty margin.
2. REMOVE ALL background content. Every white/gray/color smudge, red/cyan halo, faint cloud and stray particle outside the actual soldier/weapon must become alpha ZERO. Use a genuinely transparent PNG, not a black, white, checkerboard or solid-color background. Keep only the precisely cut-out character art, tiny emissive eyes and colored weapon crystal/vent detail ON the objects. No halo or glow cloud at all.
3. All SIX poses of each row stay right-facing and keep the same compact anime chibi style as the input. No horns, monsters, crowns, added aura or new props. Do not change the hooded masked soldier designs or the baton/shield, spear or hammer.
4. Preserve the neutral first pose, the three distinct walking poses in columns2–4, and attack anticipation/release in columns5–6. Character height/width must not change across frames except natural attack articulation. No frame touching any other frame. Keep exact wide 2:1 canvas aspect, 6 equal columns×3 equal rows. This is production sprite cleanup, not new composition.
```

## Matching death generation

```text
Use case: identity-preserve.
Asset type: matching defeat-animation sprite atlas for the three exact bosses in the reference.
The reference is the FINAL approved design atlas: row1 Warden dark hood/red visor/riot shield/baton, row2 Frost fur-trim blue hood/ivory face mask/cyan visor/crystal spear, row3 Cinder rust hood/respirator amber lenses/compact furnace backpack/industrial hammer. Preserve these THREE EXACT character designs, compact 2.5-head chibi proportions, armor detailing, color palettes, weapons, hood and mask shapes. Do not use older monster boss designs.

Create ONE transparent PNG, FOUR equal columns × THREE equal rows, aspect ratio 4:3. Twelve full character defeat poses. Uniform square cells. All right-facing three-quarter view. Same body scale and head size across every frame in a row: a collapsed body becomes lower and wider; do NOT enlarge it to fill the cell. The grounded contact baseline is at 84% of each cell height for boots/knees/body respectively. Every complete body and dropped weapon fits inside its square with a generous at least 30px fully transparent margin on all sides. No background, floor, cast shadow, labels, grid, frames, text, checkerboard, aura or watermark. Exact row order Warden, Frost, Cinder.

Column1 RECOIL: still nearly upright, a clear backward flinch from a final hit; knees soften, shoulders recoil, weapon starts to lower. No wound/blood.
Column2 KNEEL: one knee contacts the ground, body leans forward heavily, head lowered. Warden props himself on lowered shield, Frost lowers spear, Cinder lowers hammer. Same scale as column1.
Column3 COLLAPSE: tipping forward/right onto supporting hand/elbow, exhausted limp weight, weapon touches ground next to him; center of mass dropping naturally. Same scale as columns1–2.
Column4 PRONE: completely defeated and lying on side/front on the ground facing right, mask/head clearly present and body relaxed. Shield/spear/hammer remain recognizable laid beside the body, all fully inside cell. No hovering, no standing shortened character, no disappearing limbs. Same anatomy scale as prior columns.

Exactly the same anime-chibi masked-soldier art style as the reference. Carefully preserve hoods, mask details, boots, gloves, armor, pouches and each signature weapon in all frames. Small eye/crystal/vent accents may dim gradually; no particle dissolve or glow clouds baked into the image. No gore or dismemberment. Fine clean edges on true alpha transparency. Do not change the requested 4×3 layout or repeat identical poses.
```
