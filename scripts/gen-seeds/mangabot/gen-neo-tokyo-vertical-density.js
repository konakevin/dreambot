#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_vertical_density.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} VERTICAL-DENSITY entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry describes the OVERHEAD CLUTTER that fills the upper frame zone — sky-fills, criss-crosses, suspended elements. neo-tokyo sky is NEVER empty. This axis enforces the vertical-stack chaos.

Each entry: 14-26 words. ONE specific cluster of overhead/sky-zone elements (multiple elements grouped to fill the upper frame).

VERTICAL-CLUTTER ELEMENTS to mix:
- Tangled power-lines (criss-cross black cable nests, transformer-boxes, sparks)
- Fire-escape staircases (rusty zig-zag iron stairs clinging to building faces)
- Hanging noren / paper-lantern strings (over yatai stalls, red kanji-lit cloth)
- Criss-cross neon-strip lighting (suspended LED tubes between buildings)
- Suspended walkways (glass-tube pedestrian bridges at multiple levels)
- Hovering drone traffic (small drones in distance flock-pattern)
- Antenna-forests on rooftops (TV antennas, satellite dishes, lightning rods clustered)
- Festooned electrical cable (sagging power-and-data cables drooping in catenary arcs)
- Hanging plant-vines from abandoned levels (organic invasion of upper floors)
- Suspended advertising banners (vertical kanji cloth banners hanging from upper levels)
- Maglev / hovercar light-trail arcs (streaks of light from passing traffic above)
- Air-conditioner unit walls (banks of HVAC bolted to building faces, dripping condensation)
- Rooftop shanty-shacks (improvised tin-shacks at megabuilding tops, antennas)
- Hanging laundry-lines (cyberpunk-residential — clothes drying between fire-escapes)

DO write (each entry combines 2-4 vertical elements):
- Tangled power-line nests criss-crossing the alley above with hanging red lantern-strings and dangling air-conditioner units between fire-escapes
- Suspended glass-tube sky-bridges connect three megabuildings overhead with hovering drones in formation between them
- Sagging festooned cables drape from antenna-forests on the rooftops down past hanging laundry-lines and HVAC unit walls
- Criss-cross neon-strip lighting tubes connect the alley walls at multiple heights, hanging plant-vines spilling down from upper-floor planters
- Hovercar light-trails arc through the upper frame past suspended advertising banners with red kanji and a rooftop antenna-forest

DO NOT write:
- Empty sky (the WHOLE point of this axis is to fill it)
- Single isolated elements — combine 2-4 per entry for density
- Pastoral / nature elements (clouds without context — neo-tokyo sky is cluttered)
- Historical elements (no torii — those are samurai-era)
- Architectural anchors (separate axis)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
