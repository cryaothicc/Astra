# Terrain material atlas

`public/assets/terrain-materials.png` is an original opaque 4-column × 3-row raster atlas generated with the built-in image generation tool. The map renderer should crop by exact equal cells using `image.width/4` and `image.height/3`; the image contains material surfaces only, with no board geometry or labels.

Cell order, left to right:

| Biome row | Road | Raised platform top | Wall top | Pit/grate |
| --- | --- | --- | --- | --- |
| 0 / Industrial night | Damp asphalt | Wet concrete | Dark steel | Drainage grate |
| 1 / Frozen sanctuary | Frosted limestone | Icy marble | Snowy masonry | Dark fractured ice |
| 2 / Cinder foundry | Iron tread plate | Worn warm steel | Scorched brick | Molten crust |

Generated source: `C:/Users/Itrbf/.codex/generated_images/01a1b9ec-d591-7b60-9c7e-892528ecf7a8/exec-9f658170-f877-4cd4-a511-132e7bf9a2e8.png`.

The existing night map was visually inspected for palette continuity; no input reference was passed to the generation call. The final image was visually checked for the requested ordering and flat top-down material treatment. Opposite-edge seamlessness was requested, but exact pixel-perfect edge matching is not claimed. No post-generation raster editing was performed; the generated PNG was copied into the project unchanged.

## Final prompt

```text
Use case: stylized-concept.
Asset type: production tile-material texture atlas for a detailed anime tactical tower-defense game's battlefield renderer.

Create ONE opaque raster texture atlas, canvas aspect ratio exactly 4:3, ideally 1536 x 1152 pixels. Divide the canvas into exactly FOUR equal columns and THREE equal rows, so all TWELVE cells are perfectly square. Each cell fills its entire rectangle to the exact boundaries. NO gaps, borders, text, labels, icons, symbols, frames, margins or visible grid lines separating cells. A hard material change at the cell boundary is correct. This is flat material swatches only, not a rendered board.

Camera: perfectly top-down orthographic planar surfaces. ZERO perspective, ZERO isometric cube sides, no beveled tile edges, no objects projecting above the surface. Each cell is its own tileable seamless texture, with similar details and color values at opposite edges, no localized focal point, no directional cast shadow, no vignette. Fine material detail must remain legible when each swatch is displayed as a 100px battlefield tile. Hand-painted high-quality anime game environment style, restrained realistic wear, layered material texture, not pixel art, not low-poly vector.

EXACT CELL ORDER left to right:
TOP ROW / industrial night, muted cool blue-gray:
1. Dark weathered asphalt road, fine aggregate, faint hairline cracks, subtle damp patches, NO lane markings.
2. Worn wet gray concrete, faint chips and pitting, subtle blue reflected light, NO seams dividing this square into smaller tiles.
3. Dark charcoal steel plating, brushed texture, shallow scratches, small flush rivets sparingly, NO hazard stripes.
4. Dark steel drainage grate pattern with recessed black voids, uniform repeated small square grid, lightly worn metal ribs, top-down.

MIDDLE ROW / frozen sanctuary, pale cool ivory and desaturated ice blue:
1. Pale cracked limestone with frost embedded in thin cracks and tiny icy speckles, subtle worn stone texture.
2. Frosted ivory marble, fine subtle blue-gray veins and crystalline frost, no symbols.
3. Snow-dusted ancient gray masonry surface, stone texture under soft irregular thin snow, no protruding rocks.
4. Deep blue fractured ice surface over a dark crevasse, small ice fissures, cold luminous blue edges, dark navy overall, no tall ice spikes.

BOTTOM ROW / cinder foundry, deep brown-black metal and restrained copper:
1. Worn iron road plating, subtle diamond tread or small embossed repeated texture, dry soot, rusty seams sparse.
2. Warm worn steel plate, copper-gray abrasion and scraped metal, restrained dark orange reflected light, no yellow stripes.
3. Dark scorched furnace brick material, small dark bricks with soot and minimal mortar, low contrast.
4. Molten lava surface, bright orange branching cracks through dark volcanic crust, overhead texture, glowing ember-orange channels, no rocks or flames above surface.

All 12 cells must be equal size, perfectly aligned. Maintain full opacity across the complete image. No transparency. No characters, UI, arrows, warning markings, writing, watermarks or weapons. Material atlas only.
```
