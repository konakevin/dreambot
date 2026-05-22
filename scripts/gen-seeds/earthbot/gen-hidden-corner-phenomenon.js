#!/usr/bin/env node
/**
 * EarthBot hidden-corner — PHENOMENON axis (conditional 25%-gate).
 *
 * Real-Earth optical events at intimate scale. Rainbow droplet, light
 * ray piercing canopy, drifting pollen, mist roll, butterfly cloud,
 * spider-web dew constellation.
 *
 * HARD ban on bioluminescent / aurora / nacreous / sun-dogs / fire-rainbow.
 *
 * R0 = 30.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/hidden_corner_phenomenon.json';
// Append mode — scale R0 30-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PHENOMENON entries for EarthBot hidden-corner. Each entry names ONE signature optical / atmospheric event woven naturally into the intimate scene. Real Earth ONLY. Hard ban on supernatural-drift triggers.

━━━ THE BAR — ONE INTIMATE-SCALE REAL-EARTH OPTICAL EVENT ━━━

A small-scale optical / atmospheric event that adds magic to the secret pocket. Light ray piercing through canopy gap, dew constellation on spider web, drifting petals or pollen on a sunbeam, dragonfly cloud, mist rising from a still pool, droplet ripples breaking surface tension.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "description": "<one intimate optical event, 14-22 words>" }

Bare strings acceptable.

━━━ PHENOMENON TYPES ━━━

- LIGHT RAY THROUGH CANOPY — single shaft piercing through dense leaves into the pocket
- DEW CONSTELLATION — spider web dew drops catching light in scattered points
- DRIFTING PETALS — pink/white blossoms carried slowly on a faint breath of air
- POLLEN DRIFT — golden pollen suspended in a sunbeam
- DRAGONFLY HOVER — single dragonfly caught motionless in air over the pool
- MIST RISING — soft mist curling up from a still pool surface
- DROPLET RIPPLES — concentric water rings from a single dripping point
- BUTTERFLY GATHERING — small group of butterflies clustered on a single bloom
- STEAM FROM SPRING — warm steam curling slowly above a hot/cold contrast
- WET-STONE RAINBOW — small prismatic flash in a wet surface catching sunlight
- LEAF FALL — slow-motion fall of a single colored leaf through the frame
- DUST IN SUNBEAM — golden dust suspended in a single light shaft

━━━ EXAMPLES ━━━

✓ { "description": "A single dramatic light ray piercing through a gap in the canopy and striking the foreground stone in a soft golden circle" }

✓ { "description": "A dew-glittered spider web strung between two ferns at the midground, every droplet catching the dappled light in scattered points" }

✓ { "description": "A drift of pink fallen blossoms carried slowly across the pool surface on a faint breath of air, surface ripples chasing each petal" }

✓ { "description": "A golden pollen drift suspended motionless in a single sunbeam piercing down through the canopy gap above" }

✓ { "description": "A single emerald dragonfly hovering still over the foreground pool, iridescent wings catching the filtered light from the canopy" }

━━━ ABSOLUTELY BANNED ━━━

- Bioluminescent / phosphorescent / glowing-fungi (HARD BAN — legacy trigger)
- Aurora / nacreous / iridescent clouds / sun-dogs / fire-rainbow / double-rainbow
- Sci-fi / fantasy / portal / cosmic / mystical
- Sun pillar / single beam of light alone (use as part of "shafts plural" framing)
- Lightning / storm-event
- Snowflakes / ice crystals (legacy drifted ice; pocket is warmer biome)
- Cross-supernatural — must be a REAL Earth optical event
- "Fire" as a noun

━━━ OUTPUT ━━━

JSON array of ${n} entries. ONE intimate-scale real-Earth optical event per entry. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
