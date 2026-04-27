#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/druid_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DRUID ACTION descriptions for FaeBot's druid path. Each entry is what a druid woman is DOING — channeling nature magic, performing rituals, commanding the forest. VISIBLE magic effects. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific nature-magic action.

━━━ CATEGORIES TO COVER ━━━
- Raising her staff as green lightning arcs from it into the canopy above
- Drawing a circle of glowing runes on the ground with a bare foot
- Commanding roots to erupt from the earth, forming a living barrier
- Pressing both hands into the soil, a pulse of green energy spreading outward
- Calling a storm by spinning her staff overhead, clouds gathering impossibly fast
- Healing a wounded tree by placing her hands on the bark, golden light flowing in
- Shape-shifting mid-transformation, half-woman half-wolf, caught between forms
- Summoning a wall of thorns from the earth with a sweeping arm gesture
- Meditating in mid-air, levitating slightly above a glowing ritual circle
- Pouring water from a cup onto barren ground, wildflowers erupting instantly
- Chanting with arms raised as the entire forest canopy sways in unison
- Striding through fire unburned, her cloak of living leaves untouched by flame

━━━ BANNED ━━━
- Sitting passively without magic / idle without purpose
- "Posing", "modeling", looking at the camera
- Second figures

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: magic type (growth/storm/healing/transformation) + prop (staff/hands/ground/sky).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
