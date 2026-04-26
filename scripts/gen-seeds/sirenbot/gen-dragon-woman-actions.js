#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/dragon_woman_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DRAGON-WOMAN ACTION descriptions for SirenBot's dragon-woman path. Each entry is what a half-dragon woman is DOING in her volcanic/mountain territory — going about her life, unaware of being observed. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific draconic action.

━━━ CATEGORIES TO COVER ━━━
- Stretching her wings wide on a cliff edge, catching thermal updrafts
- Breathing a controlled stream of flame to light a brazier in her lair
- Sorting through her treasure hoard, weighing a gold chalice in her clawed hand
- Landing on a mountain peak, wings folding, taloned feet gripping rock
- Sharpening her claws against volcanic basalt with casual efficiency
- Diving from a cliff into a volcanic hot spring, wings tucked
- Inspecting her own scales in a pool's reflection, picking off loose ones
- Roaring into a canyon, the sound echoing for miles
- Curling her tail around a clutch of eggs in a heated nest
- Crouching at a cliff edge, watching prey in the valley far below
- Forging a blade in her own breath-fire, holding raw metal bare-handed
- Emerging from a lava pool, molten rock sliding off her fireproof scales

━━━ BANNED ━━━
- Sitting / lying passively / sleeping
- "Posing", "modeling", looking at the camera
- Second figures / prey rendered in frame

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + element involved (fire/rock/treasure/flight).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
