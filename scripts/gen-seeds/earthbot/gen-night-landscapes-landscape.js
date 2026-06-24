#!/usr/bin/env node
/**
 * EarthBot night-landscapes — LANDSCAPE axis (the pretty VISIBLE hero).
 *
 * The whole point of this path: a beautiful, detailed, genuinely VISIBLE real
 * Earth landscape that happens to sit under a gorgeous night sky — NOT a flat
 * black silhouette under a dominant sky (that was the old throwaway path's
 * "sky sovereign, land silent" minimalism Kevin is moving away from).
 *
 * So every entry describes a RICH, dramatic, pretty landscape with real
 * structure, depth and detail the night light can reveal — peaks + tarns,
 * fjords, canyons + spires, sea stacks, forested valleys, glaciers, dunes,
 * volcanic fields, terraced hills. Region/geology described in PROSE, never a
 * tourist viewpoint name (Flux pigeonholes "Half Dome" / "Tunnel View" to stock
 * photos — playbook CRITICAL LESSON 7). No people, no buildings, no sky/light/
 * weather words (those are other axes — axis-clean discipline).
 *
 * MVP-25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/night_landscapes_landscape.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LANDSCAPE entries for EarthBot's night-landscapes path. Each entry is ONE beautiful, dramatic, DETAILED real-Earth landscape — the kind of scene a landscape photographer travels for — described so it reads RICH and VISIBLE, never a flat empty silhouette. A separate axis adds the night sky + light; YOUR job is ONLY the land: its geology, structure, depth, and natural detail.

━━━ THE BAR — A PRETTY, DETAILED, VISIBLE LANDSCAPE ━━━

Real geology with genuine structure and depth: a layered foreground, a dominant landform, distance. The kind of land that looks gorgeous when moonlight or twilight reveals it. Think Marc Adamus / Max Rive composition — but described as the REAL most-magnificent version, never "hyperreal" or "otherworldly." It must NOT be a barren flat plain or a bare silhouette — give it shape, layers, and natural texture (trees, water, rock detail, snow, foliage) the night light can pick out.

━━━ AXIS-CLEAN — LAND ONLY ━━━

Describe ONLY the landscape geology + natural surface detail. NO sky, NO stars, NO moon, NO Milky Way, NO aurora, NO time of day, NO weather, NO lighting words, NO colors-of-light. Those are other axes. (You may note snow / water / forest / rock as PHYSICAL land features — just never how they're lit.)

━━━ ABSOLUTELY BANNED ━━━

- NO people, hikers, figures, tents, campsites
- NO buildings, cabins, roads, fences, bridges, ruins, docks, trails/paths
- NO tourist viewpoint or landmark names ("Half Dome", "Tunnel View", "Delicate Arch", "Skógafoss", "X Overlook/Point/View") — describe the GEOLOGY in prose instead
- NO sky / stars / moon / aurora / lighting / weather / color-of-light words
- NO "hyperreal", "otherworldly", "alien", "fantasy", "glowing", "neon"

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

JSON array of STRINGS. Each 16-30 words. Lead with the landform; pack in 2-3 concrete natural details (a tarn, a waterfall thread, scattered conifers, talus, foliage) that give it depth.

━━━ SPAN THESE LANDSCAPE TYPES (rotate hard — variety is the job) ━━━

- Glacier-carved fjord: sheer cliffs to a still inlet, snow-dusted peaks, a far waterfall thread
- Alpine cirque: a granite amphitheatre cradling a mirror tarn, scattered larch, talus fans
- Sandstone canyon: banded vermilion walls and slender spires, a braided river, juniper on the rims
- Reflective mountain lake: a sharp peak doubled in glassy water, boulder shoreline, pine fringe
- Sea cliffs + stacks: basalt towers off a dark headland, surf-worn arches, a curving cobble beach
- Autumn river valley: a winding river through gold-and-rust forest, low ridges layering into distance
- Volcanic field: glossy black lava flows and cinder cones, a steaming fumarole vent, sparse hardy grass
- Glacier + moraine: a blue-white icefall tumbling between dark rock walls, a meltwater pool below
- Desert mesa country: layered buttes and a natural rock arch over a cracked-and-cobbled wash, sage
- Terraced hillside: stepped emerald paddies curving down a misted valley, a thread of stream
- Boreal lake shore: dark spruce ranks around a calm lake, granite shelves, scattered erratic boulders
- Highland moor + tarn: heather-and-grass slopes, a dark lochan, a rocky outcrop crowning a ridge
- Dune sea: long sculpted sand ridges with knife-sharp crests, ripples raking the lee faces
- Limestone karst: jagged forested pinnacles rising from a river bend, mist pooling between towers
- Waterfall gorge: a tall plunge into a deep pool, mossy basalt walls, ferns and a boulder apron

━━━ EXAMPLES ━━━

✓ "Glacier-carved fjord, sheer dark cliffs plunging to a mirror-still inlet, snow-dusted peaks ringing the water, a thin waterfall threading the far wall"
✓ "Granite cirque cradling a glassy alpine tarn, scattered larch along the shore, talus fans sweeping down beneath jagged ridgelines"
✓ "Banded vermilion sandstone canyon, slender hoodoo spires packed in tiers, a braided river on the floor, juniper clinging to the rims"
✓ "Basalt sea stacks standing off a dark headland, surf-worn arches, a curving cobble beach below sheer cliffs draped in coastal grass"
✓ "Winding river through a gold-and-rust autumn forest valley, low layered ridges receding into distance, a gravel bar mid-bend"
✓ "Blue-white glacier icefall tumbling between dark rock walls, a still meltwater pool at its base scattered with stranded ice"

✗ BAD — silhouette/empty: "A flat dark plain stretching to the horizon" (too minimal — give it structure + detail)
✗ BAD — tourist name: "Half Dome above the valley" (banned — describe the geology)
✗ BAD — sky leak: "Snowy peak under a starry sky" (sky belongs to another axis)
✗ BAD — buildings: "A lone cabin by the lake" (banned)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Pretty, detailed, varied landscapes. Land only. No preamble, no markdown, no keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
