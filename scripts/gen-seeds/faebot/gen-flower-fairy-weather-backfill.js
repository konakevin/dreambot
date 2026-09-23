#!/usr/bin/env node
// BACKFILL for faebot_flower_fairy_weather — the three weather registers the pool has NONE of.
//
// MEASURED 2026-09-22 (independent bucket counts over all 200 entries):
//   petals/blossom 64%   mist 16%   rain 24%   snow/frost 17%   dew 16%   wind 13%   pollen 12%
//   sun-shafts 0%        storm-light 0%        rainbow/prism 0%
// So it is a WEATHER axis that cannot roll sunlight, a storm, or a rainbow, and two thirds of it is
// drifting petals (which are not really weather at all). This ADDS the missing registers rather
// than deleting anything: +60 entries takes petals from 64% to ~49% share with zero risk to any
// entry that already works, and it is revertible by dropping the tail.
//
// NOT CHANGED THIS ROUND, deliberately: every existing entry says "painted" an average of 4.2
// times in a 23-word entry (max 8). That is real stuffing and the path prefix already establishes
// painted-fantasy, but de-stuffing would change how every live FaeBot flower render looks, which
// is a SECOND variable. It needs its own shadow round. New entries here use "painted" once or
// twice, the way a human would write it, instead of copying the stack.
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/faebot_flower_fairy_weather.json',
  total: 260,
  batch: 20,
  append: true, // grow-to-N. WITHOUT this, generatePool OVERWRITES the pool.
  metaPrompt: (n) => `You are writing ${n} WEATHER + AIR entries for FaeBot's flower-fairy scenes — painted-fantasy illustration of a fairy in a garden of oversized blooms. This axis supplies the WEATHER and what the AIR is doing.

Each entry: 18-30 words, comma-separated phrases, ending with a short colour/temperature cue. Match the house voice of the pool: a weather event, then what it does to the blooms, then the palette.

━━━ WHAT TO WRITE — THE POOL IS MISSING THESE THREE ENTIRELY ━━━
Split your entries roughly evenly across these three registers. The pool already has plenty of petals, mist, rain, snow, dew and pollen, so do NOT write those.

1. SUNLIGHT AND SHADOW (the biggest gap — zero entries exist)
   Shafts of light through a canopy, dappled leaf-shadow moving across petals, late-afternoon slanting gold, backlit translucent petals glowing, a hot bright noon with hard little shadows, sun breaking through after rain, light pooling in a clearing, lens-warm haze low on the horizon, silhouetting rim-light behind a bloom.

2. STORM AND WEATHER DRAMA (zero entries exist)
   Bruised purple thunderheads massing, the strange green-yellow light before a storm, wind flattening the flower-heads one way, the first heavy drops striking wide leaves, distant sheet-lightning lighting the garden violet for an instant, the sudden hush and dropped pressure, rain-curtain advancing across the far beds, petals torn loose and tumbling, the washed brilliant clarity just after it passes.

3. RAINBOWS, PRISMS AND REFRACTED LIGHT (zero entries exist)
   A full arc over the garden, a fragment of rainbow in spray, sun-dogs, light splitting through a dew-lens, prismatic edges on a wet petal, an oil-slick shimmer on a puddle skin, iridescent scatter in mist, a halo ring around a low sun, colour banding in a waterdrop hanging off a bud.

━━━ RULES ━━━
- This is a PAINTED FANTASY ILLUSTRATION, not a photograph. You may use the word "painted" ONCE or twice where it reads naturally. Do NOT stack it into every clause.
- The weather serves a garden of OVERSIZED blooms and a small fairy. Keep the scale cue alive where it fits (a leaf big enough to shelter under, a drop the size of her head).
- No people, no named characters, no fairy ANATOMY or wings described — this axis is weather only.
- Name a palette or temperature at the end (warm gold, cool pearl-grey, bruised violet, washed clean blue-green).
- No text, no signage, no lettering.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Hard shafts of afternoon light cutting down through the canopy, striking single blooms into glowing lanterns while the beds between fall into cool shadow, warm gold against deep green."
- "Bruised violet thunderheads stacking over the garden wall, the light gone strange and greenish, every flower-head turned the same way by the pressure-drop, tense sulphur-and-slate palette."
- "A rainbow fragment caught in the spray off a wet leaf, colour banding across the petal-edge in a thin prismatic rim, cool silver with a flare of spectrum."
- "Sheet-lightning flashing somewhere beyond the hedge, lighting the whole bloom-garden lilac for a heartbeat before the dark settles back, electric violet over ink."
- "Sun breaking through directly after rain, every surface still beaded and blazing with reflected light, steam lifting off warm stone, brilliant washed blue-green."

━━━ DEDUP ━━━
Vary the register, the time of day, and the specific optical event. Do not write two entries about the same kind of light.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
