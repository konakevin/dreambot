#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/moonwell_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MOONWELL KEEPER ACTION descriptions for FaeBot's moonwell-keeper path. Each entry is what a guardian of a sacred moon-pool is DOING — tending the water, channeling moonlight, divination, ritual maintenance. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific lunar-water-magic action.

━━━ CATEGORIES TO COVER ━━━
- Cupping silver water in her hands and lifting it toward the moon, light streaming between her fingers
- Tracing a fingertip across the water's surface, constellations forming in the ripples behind her touch
- Pouring liquid moonlight from a crystal vessel into the pool, the water brightening where it lands
- Clearing fallen leaves from the pool's surface with careful sweeps of her hand
- Standing waist-deep in the glowing water, arms raised, drawing moonbeams down through her palms
- Placing crystals around the pool's edge in a precise pattern, each one catching and focusing light
- Leaning over the water reading the future in the reflection, her face lit from below
- Skimming the water's surface with a silver bowl, collecting the brightest layer of moonlight
- Submerging her hands to the wrists, the glow traveling up her arms like liquid light
- Breaking ice on a frozen moonwell with a stone, releasing trapped moonlight in a burst
- Washing silvered stones in the pool, arranging them on the bank to dry and charge
- Walking the perimeter of the pool at midnight, her footsteps leaving glowing prints in the mud

━━━ BANNED ━━━
- Sitting / lying passively / sleeping / meditating with eyes closed
- "Posing", "modeling", looking at the camera
- Aggressive or combat magic

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + moonlight interaction (channeling/collecting/reading/tending).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
