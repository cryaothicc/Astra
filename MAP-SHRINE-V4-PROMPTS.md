# Pale Sanctuary battlefield revision 4

Created with the built-in ImageGen tool; no Python/canvas pixel edits or compositing.

- Final: `public/assets/map-shrine-v4.png`
- Actual output: **1670×941 RGB**, 2,238,417 bytes. ImageGen returned two fewer columns than requested. The existing renderer's full-scene `drawImage(..., 0, 0, 1672, 941)` fits this subpixel geometry difference without a separate bitmap edit.
- Source: `C:/Users/Itrbf/.codex/generated_images/01a1dc07-2b14-7840-9aba-d1a8e6032624/exec-5c8e3652-c966-4aeb-8161-a5a5804cacb1.png`
- Initial draft: `exec-a91cb608-172f-4702-b659-c403199451a4.png` in the same source directory.
- Geometry reference: `.sites-runtime/map-v3-blueprints/map-shrine-blueprint.png` derived from mission grid.
- Style references: accepted `map-night-v3.png` and `map-foundry-v3.png` (unchanged).

The new theme is a frozen industrial chapel service courtyard: cleared concrete routes, dark machinery and stone retaining walls, restrained snow, cool lamps, warm chapel windows. Exact six platform and five pit positions are visually checked against the guide. One upper-right platform shift in the first generated pass was corrected with a second ImageGen edit. Retain normal battlefield clip at y713; lower perimeter decoration extends below the playfield just as in Nightwatch.

## Initial prompt

```text
Use case: sketch-to-render. Asset: complete painted 2D tactical-defense battlefield.
Image 1 is the exact geometry blueprint/edit target. Images 2 and 3 are STYLE references only: match their grounded industrial anime-game materials, shallow orthographic camera, fine detail and restrained coherent composition.
Create a NEW PALE SANCTUARY environment by painting image 1. Same 1672x941 canvas, same world pixel positions. Preserve blank almost-black top y0..60 and bottom y711..940. Battlefield/environment occupies y61..710. No UI, text, symbols, characters, gates, arrows, entry markers or base markers.

Exact geometry invariant: 12 columns x6 rows, ground centers x238+108*c and y187+84*r; ground cell 108x84. Board footprint x184..1480,y145..649. Keep ALL light gray cells as clearly walkable connected corridors, never blocked by props. Keep EVERY marked pale square raised platform in the guide exactly in place, top raised34px from ground, with only subtle physical corner marks. Dark blocked masses must stay dark and within their footprint; group them into coherent low architecture and machinery. Deep almost-black square pits remain exactly in place. Do not skew or rotate the grid or invent additional routes. Preserve six platform tops, all five pits and opposite entrances. Road routes are:
A [(0,1),(4,1),(4,4),(10,4),(10,2),(11,2)]
B [(11,0),(8,0),(8,2),(6,2),(6,4),(10,4),(10,2),(11,2)].
Raised platforms [(3,2),(5,3),(7,3),(9,3),(9,1),(4,5)].
Pit cells [(1,3),(2,3),(7,5),(8,5),(0,5)].

Scene: a frozen industrial chapel service courtyard at cold blue dusk. Grounded and practical, visually in the SAME GAME as the accepted industrial yard and foundry references. Cleared pale-gray frosted CONCRETE slabs form the walkable corridors, continuous clear surfaces with subdued seams, almost no snow on their centers. Dark blocked terrain is weathered blue-gray steel maintenance housings, dark simple stone retaining walls, grates and pipe conduits. Sparse thin snowdrifts collect only on blocked edges and perimeter. Six deployment platforms are concrete and steel plinths, consistent scale and finish with Image2, worn pale corner brackets and unobstructed tops. Pits are square deep maintenance/drainage openings with dark steel frames, a faint icy cold glow deep down, not huge magical fissures.
Use sparse cool blue utility lamps with a few warm amber service windows, controlled nighttime lighting. At the far perimeter only, hint of one simple ruined chapel wall with narrow plain arched windows integrated into industrial infrastructure, muted snow beyond fence. No ornate Gothic tracery, giant arches, candles, purple flowers, crystal formations, excessive snow, fantasy ornaments, blank tiled checkerboard, huge buildings over roads or whitewashed all-over floor. Dark masses and light paths must read immediately, exactly as in the two accepted references. Polished high-resolution painterly tactical anime game environment, rich subtle texture and believable contact shadows, no pixel art. Preserve the exact blueprint framing and geometry over all decorative choices.
```

## Geometry correction prompt

```text
Precise geometry correction to Image 1 (the painted battlefield). Image 2 is exact placement blueprint ONLY. Preserve all artwork, size1672x941, camera, style, paths, all other objects.

ONLY correct the UPPER-RIGHT raised square deployment platform which was incorrectly placed one grid column too far left. In Image1 it is currently centered around x1102,y237, top bounds x1049..1157,y195..279. MOVE THIS SINGLE PLATFORM EXACTLY 108px TO THE RIGHT: correct top bounds x1156..1264, y195..279, center x1210,y237. Its front support face ends y313.
Its former location is part of the vertical WALKABLE corridor from the top-right entrance: replace former platform and its base in x1048..1156,y195..313 with matching unobstructed pale-gray concrete road, connecting the top horizontal road (y145..229) straight down to the east-west road at y313..397. This vertical corridor is required for enemies.
The platform's new location is the darker blocked area immediately right of this corridor, exactly as blueprint. No additional platforms. Keep the other five deployment platforms at their existing positions and all five pits and other roads unchanged. Preserve the frost, concrete, grounded industrial chapel setting, blue lamps and all composition. No UI, text, characters, gate markers or extra routes. Important: This is a ONE-COLUMN SHIFT of ONE SQUARE platform and repairing the road it was obstructing, not a new design.
```

