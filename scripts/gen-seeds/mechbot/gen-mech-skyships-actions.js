#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mech_skyships_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for MechBot's mech-skyships path. Each describes what the skyship is DOING in the air, 12-18 words. Mid-motion, dynamic, cinematic.

━━━ ACTION CATEGORIES (spread across all) ━━━
- Cresting / breaking through cloud layer (cloud parting, vapor cones)
- Banking hard through atmospheric canyon (afterburner glow, contrail spiraling)
- Firing main weapon at off-screen target (muzzle bloom, recoil shockwave through hull)
- Locked in mid-combat with another skyship (point-blank weapons trade, hulls scarring)
- Taking damage (one engine smoking, hull-plate spiraling away, fluid trail)
- Deploying drop-pods / strike-craft / smaller mechs from a launch bay
- Decelerating into a hover (vector thrusters flaring, dust kicked from below)
- Punching through a storm front (lightning-stroked hull, rain-blown wings)
- Riding above a ground battle (shadow on the terrain, weapons firing downward)
- Banking to evade (afterburner cones, debris trail behind)
- Drifting silent through dawn / dusk (slow majestic, light raking the hull)
- Skimming low over a biome (terrain whipping past, foliage / sand / waves disturbed)
- Mid-launch from below (vertical-rising, ground crew tiny at base)
- Caught mid-fall after critical hit (smoking, tilting, ground rushing up)

━━━ ABSOLUTE BAN — NO MODERN MILITARY TERMS ━━━
NEVER use: aircraft, jet, helicopter, fighter, bomber, gunship, missile (use "lance" / "plasma-bolt" / "energy-arc" instead). Stay in sci-fi vocabulary.

━━━ EXAMPLES (write fresh) ━━━
- "Cresting through cloud layer at speed, vapor cone exploding from arrow-bow prow, sunlight catching blade-fins"
- "Locked in point-blank weapons-trade with another skyship, both hulls scarring, debris ribbons spiraling between them"
- "Decelerating into hover above a ridgeline, vector thrusters flaring blue, dust kicking outward in a ring below"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary verb + atmospheric byproduct (vapor / contrail / shockwave / debris) + interaction (with cloud / with ground / with another ship).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
