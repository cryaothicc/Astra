# Additional walking transition poses

Generated with the built-in image_gen.imagegen tool; no CLI fallback or programmatic raster editing. The generated image was copied intact into the project. Existing boss/enemy sprite sheets were preserved.

## Final asset and schema

- File: public/assets/walk-transitions.png
- Dimensions: 1774 x 887 pixels, RGBA PNG
- Grid: four columns by two rows; nominal cell size 443.5 x 443.5 pixels
- Top row: Warden; Frost Revenant; Cinder Titan; original night hooded grunt
- Bottom row: snow scout; snow heavy; foundry scout; foundry heavy
- One additional grounded transition walking pose per identity, facing right.
- The three boss figures were reduced inside their cells during cleanup so their weapons/capes do not cross cell boundaries. Normalize frame bounds/feet anchors using the existing renderer rather than assuming equal visible figure heights.
- Approximate planted-foot source Y: top bosses 382, top grunt 422; bottom sprites 857.

## Inspection

Visually checked all eight identities, full bodies, ordering, right-facing poses, and weapon/cape containment. The final image has genuine alpha transparency: inspected canvas corner, row/column gaps, and outer margin samples were alpha0. A sampled faint cyan edge pixel by the Frost crown is alpha1 (near invisible), not an opaque background. No raster post-processing was applied.

Final generated source: C:/Users/Itrbf/.codex/generated_images/01a1b4f8-90d6-7640-b9dc-ba65465d1819/exec-45ae0db0-664a-473b-8996-3b2378cc4f1b.png

## Reference images

1. .sites-runtime/asset-backups/bosses-first-atlas.png — the three boss identities.
2. public/assets/enemies.png — original hooded night soldier.
3. public/assets/enemies-snow.png — snow scout and heavy variants.
4. public/assets/enemies-foundry.png — foundry scout and heavy variants.

Current individual boss sheets were also inspected to confirm that the identities agree with the retained boss atlas.

## Exact initial generation prompt

Use case: stylized-concept. Asset type: one transparent extra-walking-frame atlas for an existing anime tactical game. REFERENCES: Image1 contains three BOSS identities, left column WARDEN, middle FROST REVENANT, right CINDER TITAN. Image2 is the original dark hooded NIGHT GRUNT. Image3 is SNOW SCOUT (upper two rows) and SNOW HEAVY (lower two rows). Image4 is FOUNDRY SCOUT (upper two rows) and FOUNDRY HEAVY (lower two rows). Preserve each identity exactly: facial/helmet design, armor, costume colors, weapon, body proportions, and detailed smooth painted anime chibi style. Create EXACTLY EIGHT isolated full-body sprites, ONE new transition walking pose for EACH character. STRICT output atlas: 4 equal columns × 2 equal rows, landscape 2:1 aspect ratio, intended 2048×1024, each equal cell512×512. ROW0 (top), columns0..3: WARDEN / FROST REVENANT / CINDER TITAN / NIGHT GRUNT. ROW1 (bottom), columns0..3: SNOW SCOUT / SNOW HEAVY / FOUNDRY SCOUT / FOUNDRY HEAVY. Absolutely no additional characters or duplicates. Each sprite faces RIGHT in matching three-quarter view. Draw a distinct PASSING-STRIDE transition frame, not a repeated broad step: weight sits above a firmly planted forward boot, opposite bent knee moves through close to planted leg, trailing heel just leaving ground with toe contact. Body upright at stable height; feet grounded, no floating or bounce; cape/coat settling near the body, hair slightly settling. Hold the existing weapon ready in a relaxed carried walking position, not attacking. For each boss retain iconic weapon: Warden red-black poleaxe and skull-horn helmet/tattered burgundy cape; Frost Revenant silver-haired cyan-eyed crowned female with ice scythe and violet layered cape; Cinder Titan massive dark furnace armor, orange core and giant hammer. Keep entire weapons and capes inside each cell. Generous empty padding on EVERY cell side, at least40px; same relative boot baseline y450 of512, all figures centered horizontally. Match existing character scales/proportions rather than changing into tiny cute dolls. CRITICAL transparency: genuinely transparent alpha=0 in ALL space outside each clean character silhouette. NO background, checkerboard, floor, ground shadow, smoke, fog, aura, halo, blue speckles, sparks, muzzleflash, trails, flame particles, lighting effects, text, labels, gridlines, UI or health bars. Glowing eye/core colors can remain INSIDE the character surfaces only. Smooth crisp non-pixel outlines and painted shading. Do not crop any foot, weapon, crown, horn, backpack or cape.

## Exact cleanup prompt

Use case: precise-object-edit. The supplied 4-column by 2-row transparent walking sprite atlas is the EDIT TARGET. Preserve EXACTLY the eight character identities, their current walking transition poses, smooth painted style, left-to-right ordering, the 2:1 landscape canvas, and the 4×2 equal-cell grid. Make only these two production cleanup corrections. (1) Reduce the size of ONLY the first THREE top-row BOSS figures by about20%, uniformly, and recenter each inside its own equal cell while preserving a common planted-boot baseline within the row. Their weapons/capes must be fully enclosed with at least35 pixels genuine transparent clearance to every cell boundary; no weapon crosses a column divider. Do not change the fourth top-row grunt or the four bottom-row soldiers except cleaning transparency. (2) Remove ALL OUTSIDE effects around every character, especially the Frost Revenant's cyan/blue speckled aura and the Cinder Titan's flames/smoke. Outside the solid hair, clothing, armor and weapon silhouettes every pixel must be fully TRANSPARENT alpha0. Keep ice-blue colors ON the physical crown/scythe and orange colors INSIDE Cinder's furnace armor surfaces only. No glow halos, particles, wisps, shadows, smoke, fire, noise or fog. No checkerboard background, no black opaque background. This is atlas cleanup, not a redesign. Exactly eight sprites, no text, no new objects, all feet and weapons fully visible.

