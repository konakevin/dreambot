#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mecha_pilot_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PILOT+MECH pairing descriptions for MechBot's mecha-pilots path. Each describes a specific pilot AND their specific mech in a single 14-22 word phrase.

Each entry: pilot biology + pilot signature gear + mech archetype + mech signature silhouette.

━━━ PILOT VARIETY (spread across all entries) ━━━
- ~50% human (any gender, any age, any species — humans of all kinds)
- ~20% cyborg (mechanical eye / port-augmented / partial-prosthesis pilots)
- ~15% alien (non-human species — varied morphologies)
- ~10% android (synthetic person)
- ~5% hybrid / unusual (twin-bonded / hive-linked / child prodigy)

━━━ MECH VARIETY (spread across all entries) ━━━
- Bipedal Heavyframes (humanoid combat mechs)
- Quadrupedal walkers
- Hexapedal scout-class
- Aerial-frame VTOL mechs (jet thrusters, transforming)
- Light-frame fast-attack
- Heavy artillery platforms
- Ceremonial / officer mechs
- Industrial-converted-to-combat mechs

━━━ EXAMPLES (write fresh, do not copy) ━━━
- "Veteran human ace in matte-black bodysuit and cracked-visor helmet, climbing into a crimson Heavyframe with arc-cannon shoulders"
- "Cyborg pilot with chrome temple-port and burn-scarred face, slumped in the open cockpit of a battered teal quadruped scout-mech"
- "Insectoid Vesh-Talari pilot in pressurized exo-vest, perched on the shoulder of a cobalt VTOL aerial-frame with vector thrusters folded"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: pilot biology + mech silhouette class + signature accent (color/weapon/condition).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each entry 14-22 words.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
