#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_rider_scenes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DRAGON IN FLIGHT scene descriptions for DragonBot. Dragons in DYNAMIC MOTION — not posed, not hovering, not static. Every entry must convey a living creature moving through space with weight, speed, and purpose. NO HUMANS anywhere.

Each entry: 15-25 words. One specific moment of a dragon in motion.

━━━ KEY RULE: MOTION AND ENVIRONMENT REACTION ━━━
The dragon is mid-action and the world REACTS:
- Clouds part around wings, water sprays from low passes, trees bend in downdraft
- Wind stretches wing membranes, tail streams behind, body tilts into turns
- Dust kicks up, snow swirls in wake, waves form from wingbeats over ocean
Think BBC nature documentary of a raptor hunting, not a fantasy book cover pose.

━━━ MOTION TYPES (mix broadly) ━━━
- Steep dive toward prey, wings folded, ground rushing up, speed streaks
- Hard banking turn over a river valley, one wing nearly touching water
- Explosive launch from cliff face, rocks crumbling, wings snapping open
- Low-altitude chase over forest canopy, treetops bending in the downdraft
- Climbing through storm, wings beating hard against rain, lightning behind
- Skimming ocean surface at speed, spray trailing, wake cutting the water
- Bursting through cloud layer into sunlight, mist streaming off scales
- Tight canyon threading, wingtips nearly scraping rock walls
- Thermal spiraling high above mountains, lazy circling, surveying territory
- Mid-air combat with rival dragon, tangled, rolling, fire crossing
- Swooping under a stone bridge or through a ruined archway at speed
- Braking hard to land, wings flared wide, dust cloud exploding outward
- Night hunting, silent glide, eyes glowing, moonlit scales

━━━ RULES ━━━
- ABSOLUTELY NO HUMANS — no riders, no people, no figures
- Every entry must describe MOTION, not a static pose
- Describe how the environment reacts to the dragon's movement
- Vary terrain: ocean, mountains, forest, desert, tundra, volcanic, canyon, city ruins
- Vary weather and time of day
- No named dragons
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
