#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/storm_surface.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} OCEAN STORM DRAMA descriptions for OceanBot. Towering waves, raw power, ships as tiny specks against walls of water, atmospheric chaos on the open ocean.

Each entry: 15-25 words. One specific storm scene.

━━━ CATEGORIES (mix across all) ━━━
- Towering rogue waves with spray tearing off crests in hurricane winds
- Lightning splitting the sky over churning open ocean at night
- Ships as tiny specks against 50-foot walls of green-black water
- Hurricane seas with foam streaks and horizontal rain
- Waterspouts forming between thunderheads and dark ocean surface
- Typhoon swells rolling across endless grey expanse
- Storm-break light piercing through after the worst passes
- Cross-seas creating chaotic checkerboard wave patterns
- Fishing vessels climbing near-vertical wave faces
- Dawn breaking through storm clouds over still-violent seas
- Whitewater avalanches cascading down wave faces
- Green water crashing over bows of vessels in heavy weather

━━━ RULES ━━━
- RAW POWER — scale, violence, atmospheric drama
- Ships when present are TINY against the ocean's scale
- Specific weather phenomena, not generic "stormy ocean"
- No repeats — every entry a unique storm moment
- Vivid, cinematic language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
