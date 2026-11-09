# Complete battlefield backgrounds, revision 3

These are complete, coherent illustrated scenes, replacing the previous world-under-overlay approach. Each final PNG is 1672×941. They were generated with the built-in ImageGen tool, using exact code-native SVG geometry guides rasterized with Sharp. No generated map pixels were edited or composited in code. Existing old maps and material atlas were not used as composited layers.

## Assets and layout

- `public/assets/map-night-v3.png`: rainy industrial loading yard; generated source `exec-5d679ff9-c803-4cfb-abb3-d5409f4a1575.png`.
- `public/assets/map-shrine-v3.png`: frozen ruined sanctuary; generated source `exec-12cfd0bf-cc7b-46ed-a792-9e7c689342e7.png`.
- `public/assets/map-foundry-v3.png`: molten smelting works; generated source `exec-2327e16b-179b-4fed-a892-59812ee00c67.png`.

Generated sources reside in `C:/Users/Itrbf/.codex/generated_images/01a1b9ec-d591-7b60-9c7e-892528ecf7a8/`. Exact intermediate geometry blueprints are in ignored `.sites-runtime/map-v3-blueprints/`, SVG and PNG per biome.

All guides were derived from `lib/missions.mjs`: 12×6 board, ground centers `(238+108*c, 187+84*r)`, 108×84 cells, high-ground top offset -34px. High platforms have physical corner paint/engraving. Guides treated every non-road/non-platform/non-pit cell as blocked connected architecture, and retained the exact mission route shapes.

Night routes: `[[0,1],[4,1],[4,3],[8,3],[8,2],[11,2]]`; `[[0,4],[2,4],[2,3],[8,3],[8,2],[11,2]]`. High: `[[3,2],[5,2],[6,4],[8,1],[9,3],[1,2]]`. Pits: `[[5,4],[7,2],[10,4],[10,5]]`.

Shrine routes: `[[0,1],[4,1],[4,4],[10,4],[10,2],[11,2]]`; `[[11,0],[8,0],[8,2],[6,2],[6,4],[10,4],[10,2],[11,2]]`. High: `[[3,2],[5,3],[7,3],[9,3],[9,1],[4,5]]`. Pits: `[[1,3],[2,3],[7,5],[8,5],[0,5]]`.

Foundry routes: `[[0,1],[5,1],[5,3],[10,3],[10,1],[11,1]]`; `[[0,4],[3,4],[3,3],[10,3],[10,5],[11,5]]`. High: `[[4,2],[6,2],[7,4],[9,2],[9,4],[2,2]]`. Pits: `[[1,0],[2,0],[6,5],[7,5],[8,5],[11,3]]`.

## Validation and integration notes

Visually checked all three images against their guide: route connectivity and centers, six platform positions, pit arrangements, distinct biome setting, clear light routes vs blocked terrain, and absence of characters/UI/gate markers. The road centerlines fit the existing mission geometry without a proposed path offset. Small hand-painted edge irregularities and 1–5px local edge shifts are possible; the images are illustrations rather than exact collision masks.

All top strips are dark through y60. Foundry's lower dark strip begins at about y710. Night and shrine have decorative perimeter scenery extending to about y750 and y743 respectively; keep the game's existing battlefield clip at y713 so that this decoration does not intrude into the operator-card footer. The playable board itself stays at the intended bounds. No change to source mission paths or renderer code was made by this asset task.

## References

Urban/industrial style: user's `codex-clipboard-80d6b76d-01df-4f08-b9b0-9e0661dd200a.png`.

Shrine/ruins style: user's `codex-clipboard-fd474287-a399-4452-8cea-8334ddfb7209.png`.

The first input to every generation was that biome's exact geometry blueprint. The second input was the relevant user-supplied game screenshot, used only for environment presentation style.

## map-night-v3

```text
Use case: sketch-to-render.
Asset type: complete illustrated 2D tactical-game battlefield background.
Image 1 is an EXACT GEOMETRY BLUEPRINT and is the edit target. Image 2 is style inspiration only: emulate its coherent detailed 3D-like anime game battlefield environment and readable built-in terrain, not its UI or exact scene.

Paint a polished entire battlefield over image 1, preserving its exact pixel geometry, footprint, cell positions, route widths, raised platform positions, pit positions and overhead camera. This is a complete NEW environment, not a board over an unrelated old scene. Keep canvas 1672 x 941 (same as image 1). The playable/environment zone is x0..1672, y61..710; retain blank near-black top strip y0..60 and bottom strip y711..940. No UI, text, characters, enemies, gates, entry/base holograms or icons.

CRITICAL GEOMETRY: Board is 12 columns × 6 rows. Cell ground centers are x=238+108*c, y=187+84*r, c0..11,r0..5. A normal ground tile is 108 wide ×84 high. Board footprint x184..1480, y145..649. Light gray blueprint cells are WALKABLE roads/corridors: keep EVERY one clear of buildings, debris, trees and walls, and keep their exact ground-center alignment and connected shape. The lighter off-white square tops with four small corner marks are SIX deployable HIGH-GROUND platforms: keep their EXACT positions, dimensions and height34px, with the subtle four corner marks physically painted/engraved on their tops. Dark charcoal areas are BLOCKED raised terrain: turn them into coherent connected machinery/architecture instead of blank flat repeated tiles; never move their edges onto the routes. Very dark outlined square holes are PITS: preserve their exact outlines and positions and render believable depth. Group adjoining blocked cells into convincing large environment masses; do not add arbitrary checkerboard tiles. Roads are lighter and clearly distinguishable from blocked terrain, with subtle consistent square slab seams matching the blueprint. Raised geometry has visible front faces and soft contact shadows, but no giant objects overhanging road centerlines. Maintain nearly orthographic tactical camera, with only the same shallow front-face depth as the blueprint; do not rotate or skew the grid.

Build rich contextual environment outside board bounds and along its outer walls in y61..710 while leaving all route entrances/exits open exactly where the blueprint paths meet the side. Use detailed painterly anime game environment art, realistic material wear, atmospheric lighting, strong readable value hierarchy, fine subtle detail. No pixel art, flat texture atlas, neon rainbow grids, text labels, road arrows, perspective receding trapezoid grid, random extra paths, character sprites or UI framing.

Scene: rainy industrial loading yard at blue hour/night. Roads are worn pale-gray wet concrete slabs with rain sheen and faint puddles, not deep black asphalt. Blocked masses are old factory utility housings, ventilation machinery, broad shipping/storage structures and grated service sections, dark cool blue-gray metal, rusty steel with sparse warm amber work lights. The six high-ground squares are concrete-and-steel loading plinths with flat clear tops and restrained worn cream corner paint. Pits are recessed dark drainage/maintenance openings, bordered by industrial steel. Exterior: chainlink fences, electrical conduits, stacked crates and distant factory walls at the margins. Sparse atmospheric drizzle and amber/cyan reflected light, somber but playable ground remains readable. Route shape must be identical to the exact blueprint, including both west approaches, central merge, one raised-platform ring and east exit.
```

## map-shrine-v3

```text
Use case: sketch-to-render.
Asset type: complete illustrated 2D tactical-game battlefield background.
Image 1 is an EXACT GEOMETRY BLUEPRINT and is the edit target. Image 2 is style inspiration only: emulate its coherent detailed 3D-like anime game battlefield environment and readable built-in terrain, not its UI or exact scene.

Paint a polished entire battlefield over image 1, preserving its exact pixel geometry, footprint, cell positions, route widths, raised platform positions, pit positions and overhead camera. This is a complete NEW environment, not a board over an unrelated old scene. Keep canvas 1672 x 941 (same as image 1). The playable/environment zone is x0..1672, y61..710; retain blank near-black top strip y0..60 and bottom strip y711..940. No UI, text, characters, enemies, gates, entry/base holograms or icons.

CRITICAL GEOMETRY: Board is 12 columns × 6 rows. Cell ground centers are x=238+108*c, y=187+84*r, c0..11,r0..5. A normal ground tile is 108 wide ×84 high. Board footprint x184..1480, y145..649. Light gray blueprint cells are WALKABLE roads/corridors: keep EVERY one clear of buildings, debris, trees and walls, and keep their exact ground-center alignment and connected shape. The lighter off-white square tops with four small corner marks are SIX deployable HIGH-GROUND platforms: keep their EXACT positions, dimensions and height34px, with the subtle four corner marks physically painted/engraved on their tops. Dark charcoal areas are BLOCKED raised terrain: turn them into coherent connected machinery/architecture instead of blank flat repeated tiles; never move their edges onto the routes. Very dark outlined square holes are PITS: preserve their exact outlines and positions and render believable depth. Group adjoining blocked cells into convincing large environment masses; do not add arbitrary checkerboard tiles. Roads are lighter and clearly distinguishable from blocked terrain, with subtle consistent square slab seams matching the blueprint. Raised geometry has visible front faces and soft contact shadows, but no giant objects overhanging road centerlines. Maintain nearly orthographic tactical camera, with only the same shallow front-face depth as the blueprint; do not rotate or skew the grid.

Build rich contextual environment outside board bounds and along its outer walls in y61..710 while leaving all route entrances/exits open exactly where the blueprint paths meet the side. Use detailed painterly anime game environment art, realistic material wear, atmospheric lighting, strong readable value hierarchy, fine subtle detail. No pixel art, flat texture atlas, neon rainbow grids, text labels, road arrows, perspective receding trapezoid grid, random extra paths, character sprites or UI framing.

Scene: a ruined frozen cathedral/shrine at moonlit dawn. Roads are pale worn limestone slabs, thin frost on edges with a cleared central walking surface. Blocked masses are coherent collapsed chapel masonry, broken stone walls and low architectural terraces; blue-gray snow and frost in recesses. The six high-ground squares are broad flat ancient marble pedestals exactly matching guide, tops clear and marked only by subtle engraved corner brackets. Pits are deep dark-blue ice fissure openings with precise square ruin borders. Contextual perimeter: broken gothic arches, candle niches, sparse violet frozen vegetation, snowdrifts and a few cool blue crystal glints; avoid placing big ornaments in road cells. The layout is a compact intricate ruin with two opposing approaches; north-east road follows the guide. Quiet cold atmosphere, readable icy-white roads against darker blocked architecture. No red/blue gate markers or temple doors at unrelated positions.
```

## map-foundry-v3

```text
Use case: sketch-to-render.
Asset type: complete illustrated 2D tactical-game battlefield background.
Image 1 is an EXACT GEOMETRY BLUEPRINT and is the edit target. Image 2 is style inspiration only: emulate its coherent detailed 3D-like anime game battlefield environment and readable built-in terrain, not its UI or exact scene.

Paint a polished entire battlefield over image 1, preserving its exact pixel geometry, footprint, cell positions, route widths, raised platform positions, pit positions and overhead camera. This is a complete NEW environment, not a board over an unrelated old scene. Keep canvas 1672 x 941 (same as image 1). The playable/environment zone is x0..1672, y61..710; retain blank near-black top strip y0..60 and bottom strip y711..940. No UI, text, characters, enemies, gates, entry/base holograms or icons.

CRITICAL GEOMETRY: Board is 12 columns × 6 rows. Cell ground centers are x=238+108*c, y=187+84*r, c0..11,r0..5. A normal ground tile is 108 wide ×84 high. Board footprint x184..1480, y145..649. Light gray blueprint cells are WALKABLE roads/corridors: keep EVERY one clear of buildings, debris, trees and walls, and keep their exact ground-center alignment and connected shape. The lighter off-white square tops with four small corner marks are SIX deployable HIGH-GROUND platforms: keep their EXACT positions, dimensions and height34px, with the subtle four corner marks physically painted/engraved on their tops. Dark charcoal areas are BLOCKED raised terrain: turn them into coherent connected machinery/architecture instead of blank flat repeated tiles; never move their edges onto the routes. Very dark outlined square holes are PITS: preserve their exact outlines and positions and render believable depth. Group adjoining blocked cells into convincing large environment masses; do not add arbitrary checkerboard tiles. Roads are lighter and clearly distinguishable from blocked terrain, with subtle consistent square slab seams matching the blueprint. Raised geometry has visible front faces and soft contact shadows, but no giant objects overhanging road centerlines. Maintain nearly orthographic tactical camera, with only the same shallow front-face depth as the blueprint; do not rotate or skew the grid.

Build rich contextual environment outside board bounds and along its outer walls in y61..710 while leaving all route entrances/exits open exactly where the blueprint paths meet the side. Use detailed painterly anime game environment art, realistic material wear, atmospheric lighting, strong readable value hierarchy, fine subtle detail. No pixel art, flat texture atlas, neon rainbow grids, text labels, road arrows, perspective receding trapezoid grid, random extra paths, character sprites or UI framing.

Scene: abandoned molten smelting works, dim smoky industrial night. Roads are broad worn gray iron floor plates with subtle grating/seams and restrained orange reflections, clearly light enough to distinguish the two entrances, center conveyor-like corridor and two exits. Blocked masses are coherent dark soot-black furnace foundations, heavy mechanical equipment, large metal housings and pipe runs, contained exactly inside blueprint blocked cells. The six high-ground squares are metal maintenance platforms with clear tops and subtle cream/yellow corner paint, height34px. Blueprint pits are dark smelting channels with glowing orange magma deep below, square metal borders; do not add lava outside specified holes or across walkable routes. Exterior: furnace walls, massive pipes, dim orange furnace apertures, smoke and embers around the perimeter. High-contrast fiery ambience, detailed believable cohesive scene, no excessive bright lava that distracts from roads. Keep all exact guide paths and endpoints open.
```
