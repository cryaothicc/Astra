# Operator combat atlas, revision 3

`public/assets/operators-combat-v3.png` is a 1122×1402 RGBA, 4-column × 5-row transparent combat atlas generated with the built-in image generation tool. Nominal cells are 280.5×280.4 pixels. It restores illustrated weapon effects and retains the character/weapon references supplied by the user. No image pixels were edited with code.

Rows: Ash, Bastion, Kestrel, Lumen, Suture. Columns: windup, release, followthrough, recovery. All operators face right. The sprites are grounded; body/head scale and foot baseline remain approximately consistent within each row. Lumen retains the dark elongated crescent/teardrop head encasing a purple orb; circular shapes outside that frame are the designed magic orbital rings.

Inputs:

- Original user FX reference: `C:/Users/Itrbf/AppData/Local/Temp/codex-clipboard-c8565051-6a97-4304-9929-8b63736a367c.png`.
- Existing identity and idle weapon reference: `public/assets/operators-idle.png`.

Selected generated source: `C:/Users/Itrbf/.codex/generated_images/01a1b9ec-d591-7b60-9c7e-892528ecf7a8/exec-89651e14-00a2-4266-8886-f0622da54627.png`.

The first pass had excessive pose/effect extents. Two focused edits scaled poses into separated cells and tightened diffuse weapon halos. The selected final was visually checked for character ordering, rightward attacks, all 20 poses, transparent gutters, the restored illustrated FX, and Lumen's retained ornate weapon. The corner alpha is zero. Each of the 15 internal nominal vertical boundaries (x280, x561, x842, checked independently for every row) has zero pixels with alpha greater than 40. As with other generated atlases, use the renderer's transparent-gutter and feet registration to account for approximate cell alignment. Recovery column 3 can serve as the row's body-scale reference; effect extents should not determine body scale.

## Initial generation

```text
Use case: identity-preserve.
Asset type: production 2D chibi anime operator combat sprite atlas, revised from the attached sprite designs.
Input image 1 is the ORIGINAL WEAPON-EFFECTS reference: five columns (Ash, Bastion, Kestrel, Lumen, Suture) and four poses. Input image 2 is the CURRENT CORRECT IDENTITY/WEAPON reference: the same five operators, three idle poses. Preserve exact character designs, face/hair colors, outfit details and weapon silhouettes from these references. Recompose them into the NEW layout described below; do NOT preserve the input grid order.

Output ONE genuine transparent PNG, portrait aspect ratio exactly FOUR to FIVE, ideally 1536 x 1920 pixels. Precisely FOUR equal columns and FIVE equal rows: 20 square cells. NO borders, separators, labels, text, scenery, solid background, floor, shadows, watermarks or checkerboard baked into the image. Every character and every glowing effect must fit wholly inside its own cell, with a clear transparent gutter at least 28px around all edges. Keep body/head size consistent across every frame within the row. All boot soles on a consistent baseline about 82% down each cell; full body visible. Leave generous head clearance. Entire weapon and every last effect particle must remain at least 28px away from cell edges.

ALL FIVE CHARACTERS FACE AND ATTACK TOWARD SCREEN RIGHT, including crossbow and medical gun. The visual identity of input characters must remain unchanged. Detailed smooth painterly anime chibi linework matching the references; NO pixel art, no vector simplification.

Exact ROW order:
ROW 1: ASH — white-haired golden-eyed cat-eared woman, orange scarf, dark combat outfit, long black-and-silver spear.
ROW 2: BASTION — tousled dark-brown-haired man, dark heavy armor with small gold accents, tall rectangular dark riot shield bearing pale shield emblem.
ROW 3: KESTREL — deep red high ponytail, goggles on head, dark tactical outfit, intricate dark crossbow with warm brass details.
ROW 4: LUMEN — lavender-haired braided woman, glasses, long white/black coat, ornate dark staff. CRITICAL INVARIANT: her staff head is the same elongated ornate teardrop/crescent dark-metal frame as image 2, encasing a luminous PURPLE ORB with thin purple ORBITAL RINGS. It is NOT a flat closed round shield, NOT a circle disk, NOT a tennis racket. The same crescent head must visibly persist at different angles in ALL four poses.
ROW 5: SUTURE — short mint hair, warm brown skin, amber eyes, gold hoop earrings, white medic coat and white medical backpack, chunky dark medical gun with luminous cyan muzzle.

Exact COLUMN order for EVERY row:
COL 1 WINDUP: grounded anticipatory pose. Ash draws spear back; Bastion braces shield; Kestrel aims crossbow right; Lumen draws staff back, small purple orbital charge; Suture aims gun right, small cyan ring.
COL 2 RELEASE: strongest action pose, weight transferred onto front foot, expressive determined face. Ash thrusts spear right with a compact bright golden triangular streak at spear tip. Bastion punches shield forward with an illustrated sharp gold-white impact spark on outer shield edge. Kestrel crossbow fires right with compact gold-white starburst flash at bolt rail. Lumen thrusts the ORIGINAL CRESCENT STAFF rightward with bright purple orbital rings wrapped around its PURPLE ORB and a compact violet magical burst immediately in front of the crescent head; clearly keep the actual ornate dark-metal teardrop head visible within the light. Suture fires right with a luminous cyan pulse ring and small cyan medical plus glyphs, matching reference design.
COL 3 FOLLOWTHROUGH: real followthrough pose, knee flex and torso lean, garments/hair follow the motion. Weapon FX shrink and dissipate: a few golden sparks, purple orbital arcs, or cyan healing motes. Every effect still wholly inside the square cell.
COL 4 RECOVERY: grounded return to ready pose, feet planted; original weapon designs intact. Lumen's violet orb and tiny orbital rings remain softly glowing. Suture's cyan muzzle softly glows. No large burst.

The illustrated energy and hit flashes are intentional parts of the sprites: restore this designed weapon animation rather than omitting it. Make FX readable at small game size but compact enough not to touch neighboring cells. Characters do not float. No duplicated fingers, extra limbs, cropped boots, staff reshaping, extra weapons, or giant opaque blast clouds. Strong consistent identity and exact 4-column by 5-row production layout.
```

## Scale and gutter cleanup

```text
Use case: precise-object-edit.
Edit this operator combat atlas ONLY to make it safe for exact-grid sprite cropping. Keep the same four columns, five rows, row identities, rightward orientation, weapon designs, 20 poses and illustrated weapon effects. Do not add or remove poses.

The current figures are TOO LARGE and some effects and hair cross the cell borders. Scale DOWN every complete figure WITH its weapon AND all of its glow/effects to about 68 percent of its current size. Center each complete pose inside its exact nominal cell. Preserve proportional body scale across four poses of the same row. Each cell MUST have an obvious empty TRANSPARENT margin of at least 38px on all four sides. Feet baseline at 82 percent of cell height. The entire sprite INCLUDING every faint glow pixel must be inside the square cell's 38px inset. No alpha ink at any column boundary or row boundary. All twenty figures must be visually separate islands with wide clean horizontal and vertical transparent gutters. Same transparent portrait 4:5 canvas, FOUR equal columns × FIVE equal rows, ideally 1536×1920.

Tighten weapon FX falloff: keep the golden spear thrust, shield impact star, crossbow flash, purple orbital rings and cyan healing ring, but make them compact around the weapon so they do not extend into adjacent cells. Remove the big clouds of diffuse glow and retain clean sharp illustrated effects with small luminous halos only. Fully transparent background, no floor or shadow.

Keep Lumen's original tall ornate teardrop/crescent dark metallic staff head encasing the purple orb. In the release and follow-through frames the frame must still look elongated/teardrop-shaped at an angle, NOT a flat closed round disk. Her magic orbital rings may be round but the solid metal staff head must retain its elongated crescent/teardrop silhouette. Everything else unchanged.
```

## Final effect falloff cleanup

```text
Use case: precise-object-edit.
This is the final padding correction for an existing transparent sprite atlas. Keep ALL character bodies, faces, 20 poses, weapons, identity, row/column layout, and body sizes exactly unchanged. Preserve four columns and five rows.

Change ONLY the colored weapon-effect halos so they fit inside the exact square cells with clean transparent gutters. In particular:
- ROW 4 COLUMN 2, Lumen release: remove the LARGE diffuse blue/pink cloud around the purple spell. Retain the original dark elongated crescent/teardrop staff head, the purple orb, and one or two COMPACT crisp purple orbital rings right around the staff head. No extended aura/cloud. The effect ends just a few pixels beyond the crescent head, well before the boundary between columns 2 and 3.
- ROW 3 COLUMN 2, Kestrel release: keep the golden muzzle starburst but make it a compact flash at the crossbow tip, remove distant red/orange halo.
- ROW 5 COLUMN 2, Suture release: preserve the bright cyan ring and tiny medical plus glyphs, reduce the outer diffuse cyan halo so it remains well before the column boundary.
- All other poses: preserve current art, simply ensure no isolated glow speck or very faint alpha extends outside the appropriate cell.

Every nominal cell edge and an approximately 24px-wide band inside it must be pure alpha zero. No hard rectangular clipping of effects: naturally taper each small glow to zero before that empty margin begins. Foot baseline and body proportions unchanged. Leave the full background genuinely transparent, not black pixels. No new shadows, content, text, framing, captions or separators. Lumen's solid metal head remains elongated and crescent/teardrop-shaped, never a flat circular disk.
```
