#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_architectural_anchor.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ARCHITECTURAL ANCHOR entries for a MangaBot samurai-era keyframe. Each entry is the MONUMENTAL SCALE-PROVER for the scene — one specific historical-Japan structure that DWARFS the human figure(s) and anchors the composition.

Each entry: 14-26 words. ONE specific architectural element. MUST imply MASSIVE scale.

DO write (each anchor must read as DWARFING the figure):
- Towering vermilion-red torii arch stretching three stories above the path, weathered wood and rusted iron
- Looming five-tier pagoda silhouette rising above the tree-line, dark-wood with curved tile-eaves
- Massive stone-and-tile temple gate with iron-bound doors, dwarfing any figure approaching
- Colossal seated stone Buddha twenty feet tall, mossy patina, eyes half-closed in meditation
- Cliffside hilltop castle keep with whitewashed walls and tiered black-tiled roofs catching the light
- Great wooden bridge arching across a misty gorge, weathered planks with iron stays, posts capped in lanterns
- Hilltop shrine complex with cascading orange-red torii lining the climbing stone stair
- Imposing temple bell-tower with massive bronze bell visible inside, beams thicker than a man's torso
- Soaring three-story watchtower of a clan castle, banner-pennants whipping from the highest beam
- Massive stone lantern-column twice human-height, weathered carvings, mossy base, lit candle inside

DO NOT write:
- Small / domestic / human-scale objects (a single tea-house, a small lantern by itself, a regular gate)
- Modern structures (skyscrapers, telephone poles, paved infrastructure)
- Foreign-architecture (European castles, Chinese imperial palaces) — Japan-specific only
- Generic "old building" — every anchor must be visually specific
- Multiple anchors per entry — ONE monumental anchor only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
