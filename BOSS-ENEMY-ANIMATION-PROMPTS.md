# Boss walking and enemy death animation assets

Created with the built-in image_gen.imagegen tool. No CLI fallback and no programmatic raster edit were used. Final generated PNGs were copied intact into public/assets. Existing boss and enemy atlases were retained; renderer integration is separate.

## Boss walk cycles

File: public/assets/boss-walk-cycles.png

Dimensions: 1774 x 887, 8-bit RGBA PNG. Grid: 6 columns x 3 rows. Use width/6 and height/3 for nominal cells (approximately295.6667 square).

Rows: 0 Warden, 1 Frost Revenant, 2 Cinder Titan. Columns: left contact, down/weight transfer, passing, opposite contact, up/push, opposite passing. Every character faces right. New cels include leg/knee changes, shoulder/weapon-angle changes and cloak follow-through.

Use fixed per-row pixel scale and feet anchors rather than individually scaling each frame's bounding height. At alpha>=32, observed source-pixel grounded bottom by row/column:

- Warden: [264,264,265,265,264,266]
- Frost: [561,562,563,563,562,563]
- Cinder: [855,855,855,855,851,855]

Alpha inspection decoded the final PNG scanlines. Every solid sprite (alpha>=32) fits inside its nominal grid cell, minimum gutter9 pixels. The canvas corner is alpha0. 54.01% of total pixels are alpha0; 14.67% are faint alpha1..31 (mostly antialias/fringe pixels, especially the generator's Frost-colored edges). No opaque aura surrounds the physical character; rendering should ignore near-transparent fringe pixels if a strict clean silhouette is required. Broad bright-looking cyan/white areas in some image previews sampled at alpha1..7.

Final generated source: C:/Users/Itrbf/.codex/generated_images/01a1b4f8-90d6-7640-b9dc-ba65465d1819/exec-ff3be895-d7ed-4f04-b585-a137ab2f722a.png

References: public/assets/boss-warden.png, boss-frost.png, boss-cinder.png.

### Exact initial prompt

Use case: stylized-concept. Asset type: production 2D anime game WALK-CYCLE sprite atlas, drawn animation cels, not a character pose sheet. INPUTS are IDENTITY/STYLE references only: Image1 WARDEN (horned skull helmet, black layered armor, burgundy torn cape, red-black poleaxe); Image2 FROST REVENANT (silver-haired cyan-eyed anime woman, ice crown, violet/black layered cloak, icy scythe); Image3 CINDER TITAN (bulky charcoal furnace armor, orange chest core, iron helmet, huge hammer). Copy those exact identities, costumes, weapons, head proportions, and smooth painted anime chibi rendering. Ignore their existing pose layout and all glow/smoke/aura in the references. Generate ONE transparent landscape atlas, 6 equal columns × 3 equal rows = EXACTLY18 separate full-body sprites, intended3072×1536, each cell512×512. Row0 is Warden, row1 is Frost Revenant, row2 is Cinder Titan. Every character faces RIGHT, same three-quarter camera and same scale within its row. EACH ROW is ONE coherent six-frame walking loop, all six silhouettes visibly distinct: column0 left-heel CONTACT forward, right toe trailing; column1 DOWN weight transfers onto bent left knee, hips settle slightly, opposite shoulder rotates forward; column2 PASSING right knee comes through past planted left leg, torso counter-rotates, hands/weapon shift naturally; column3 opposite CONTACT right heel forward and left toe trailing, shoulders and cloak reverse; column4 UP right leg pushes body ahead, left knee bends behind with trailing heel raised, arms counter-swing; column5 opposite PASSING left knee moves through under torso and returns smoothly toward frame0. Natural planted boot ground line, no airborne hopping and no artificial bounce. Animate knees, hips, shoulder counter-rotation, elbow/hand position, carried weapon angle, loose hair and cape follow-through, not just moving feet under a rigid torso. SAME head/torso size across all six frames. Weapons are carried while walking, never attacking. Feet share baseline y460 in each cell; keep entire bodies, crowns, weapons, capes and boots inside their cell with at least40px fully transparent gutter on every edge, no overlaps or clipping. The Frost scythe is physical silver/blue metal with a hard clean silhouette, NOT surrounded by magic. Cinder chest/hammer can have colored orange seams INSIDE solid metal only; no flames or smoke outside. NO baked aura, halos, glow clouds, sparks, mist, fire, foot shadows, floor, scenery, trails, text, gridlines, labels or UI. TRUE alpha0 transparency everywhere outside the clean sprite silhouettes. Never paint a checkerboard or black background. Prioritize coherent convincing motion with stable anatomy and clean atlas registration.

### Exact layout/transparency cleanup prompt

Use case: precise-object-edit. Edit the attached 6-column by3-row BOSS WALKING ATLAS for production layout only. Keep its EXACT 1774×887 pixel canvas size, 18 existing walking poses, three character identities, smooth anime painting and exact frame ordering. Do NOT invent new poses or change weapons/outfits. Divide the canvas mathematically into6 equal columns and3 equal rows. Each cell is295.6667×295.6667 pixels. Uniformly reduce each existing sprite by15% within its OWN cell, recenter horizontally at its cell center, and place each grounded boot baseline at local y270 of295.6667. The first three frames of every row and the last three must keep equal body/head scale. This should create clear fully transparent gutters of at least15px at all cell boundaries, including every poleaxe/scythe/hammer tip and cloak. No sprite touches any grid border. Strip away all residual non-character transparency haze: especially around Frost, outside actual hair/crown/clothing/scythe silhouette must be alpha0; no white/cyan aura, fog, halo, background or shadow. Keep the physical icy scythe/crown colors but remove their outside glow. Preserve the six actual walking motions and body counter-rotation, not replace them with duplicates. All18 fullbody sprites faceRIGHT and fit fully inside their designated cells. Actual transparent PNG, no drawn grid or text.

## Enemy death cycles

File: public/assets/enemy-deaths.png

Dimensions: 1122 x 1402, 8-bit RGBA PNG. Grid: 4 columns x 5 rows. Nominal cell width280.5 and height280.4.

Rows: 0 night grunt, 1 snow scout, 2 snow heavy, 3 foundry scout, 4 foundry heavy. Columns: recoil, kneel, collapse, grounded prone pose for runtime fading/dissolve. Every character faces right. Death poses are non-graphic and preserve identity.

IMPORTANT: Keep a fixed pixel scale from the standing/recoil pose across a row. Do not resize each collapsed frame to the standing height; it must get shorter as it reaches the floor. Align grounded baselines only. Source alpha>=32 bottom positions by row:

- Night grunt: [267,276,272,272]
- Snow scout: [526,532,532,531]
- Snow heavy: [785,792,788,789]
- Foundry scout: [1045,1048,1047,1047]
- Foundry heavy: [1307,1312,1308,1308]

Alpha scan verified all solid sprites stay inside their nominal cells (minimum gutter3 pixels). Canvas corner alpha0; 77.67% alpha0 pixels and4.39% faint alpha1..31. All weapons and bodies are visible in final cells.

Final generated source: C:/Users/Itrbf/.codex/generated_images/01a1b4f8-90d6-7640-b9dc-ba65465d1819/exec-9b38dee3-fb0e-4d87-8776-918a62605c98.png

References: public/assets/enemies.png, enemies-snow.png, enemies-foundry.png.

### Exact initial prompt

Use case: stylized-concept. Asset type: transparent sprite atlas of sequential DEATH ANIMATION cels for five existing enemy identities. Input1 is NIGHT GRUNT (black hood, red eyes, black tactical armor and rifle); input2 has SNOW SCOUT in upper rows and SNOW HEAVY in lower rows (fur-lined blue hood, white mask/cyan eyes, regular vs heavy frost armor); input3 has FOUNDRY SCOUT in upper rows (burnt-orange hazmat hood, gasmask amber lenses) and FOUNDRY HEAVY lower rows (bulky furnace helmet/armor and backpack). Preserve exact identity, costumes, weapons, chibi body proportions and smooth detailed painted anime style. Generate ONE transparent portrait atlas, EXACTLY4 equal columns ×5 equal rows =20 distinct full-body sprites, intended2048×2560. ROW0 NIGHT GRUNT; ROW1 SNOW SCOUT; ROW2 SNOW HEAVY; ROW3 FOUNDRY SCOUT; ROW4 FOUNDRY HEAVY. Each row is one coherent four-cel defeat/death sequence facing RIGHT: COL0 RECOIL hit reaction, head and chest tilt back, knees buckle, rifle hand loosens; COL1 KNEEL, drops on one knee, shoulders sag, torso folds forward, gun lowers; COL2 COLLAPSE, body falls onto side, one supporting hand failing, torso nearly horizontal, cape and backpack settling; COL3 GROUNDED final defeated pose lying fully on the floor plane, limbs naturally folded, weapon resting beside the body, no hovering. Final pose will fade/dissolve in the game renderer, so draw a clean grounded body WITHOUT any dissolution particles. Distinct anatomical poses, not the same standing sprite rotated or scaled. Maintain each character's head size and outfit proportions across row; actual natural compression of pose as falling. Baseline (ground contact) must be at the SAME relative y460 within every512px cell even for kneeling and fully prone poses; leave extra transparent empty room ABOVE collapsed characters rather than vertically recentering them. Keep entire weapons/feet/backpacks inside each cell with at least35px true transparent margins, no overlaps. Gentle non-graphic game defeat: no blood, no wounds, no dismemberment. NO ground shadow, floor, background, fog, aura, glow, fire, smoke, sparks, scattered fragments, text, labels, gridlines, healthbars or UI. ONLY solid clean character silhouettes; outside must be genuine alpha0 transparency, not painted black or checkerboard. Firing flashes absent, all weapons inactive. Crisp anti-aliased anime art, NOT pixel art.

### Exact layout/transparency cleanup prompt

Use case: precise-object-edit. Production atlas layout correction. The attached image has20 enemy DEATH ANIMATION cels in4columns×5rows. Preserve the exact20 characters, poses, outfits, weapons, smooth anime style, facingRIGHT and ordering: each row same identity, col0 recoil, col1 kneel, col2 collapse, col3 fully prone. Reflow them into a STRICT UNIFORM4×5 grid with exactly equal cell widths/heights. Use portrait4:5 aspect ratio. Uniformly reduce each sprite by15% while retaining the same head/body scale across all four poses within a row. Position each cell's physical ground-contact bottom at90% of that cell's height, leaving10% completely transparent below the boots or prone body. Center each sprite horizontally; kneeling and collapsed poses must remain close to that common ground baseline with more empty space ABOVE them. At least8% of cell width transparent on both sides. NO boots, weapon, cape or body may touch/cross into another cell. Especially row0 must fit entirely within the first20% of total image height, row1 in20%-40%, row2 in40%-60%, row3 in60%-80%, row4 in80%-100%. Keep final grounded poses lying entirely on their side, no floating or upright recovery. Outside clean character silhouettes use true alpha0; remove all glow, mist, sparkles, aura, shadows or detached noise. No background, grid, text or labels. This edit must preserve identities/poses and only correct frame padding, registration and transparency.

