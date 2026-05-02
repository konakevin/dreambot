#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/mech_archetypes.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `Write ${n} INDIVIDUAL mech-toy archetypes for ToyBot's mech-toy-rampage path. Each entry = ONE specific mech with class + signature feature + weapon. Non-IP, archetype only. 8-18 words per entry.

━━━ HARD ANTI-BIAS RULES ━━━
- MAX 25% pure humanoid-mechas (Sonnet's training default — keep restrained).
- HEAVY variety across mech classes:
  • Humanoid: samurai-armor, paladin-knight, ninja-stealth, gladiator, crusader, monk-templar, executioner, valkyrie-winged, pharaoh, gunslinger
  • Transforming: car-to-robot, jet-to-robot, motorcycle-to-robot, semi-truck-to-robot, train-to-robot, ship-to-robot, plane-to-robot
  • Beast-form: lion-mech, tiger-mech, wolf-mech, dragon-mech, scorpion-mech, eagle-mech, panther-mech, rhino-mech, snake-mech, mantis-mech, gorilla-mech, shark-mech, octopus-mech, t-rex-mech
  • Powered-armor exosuit: heavy-tank-armor, scout-light-armor, sniper-stealth-armor, bomber-flight-armor, deep-sea-dive-armor, space-vacuum-armor
  • Combiner-megazord-style: 5-vehicle-combine, 3-beast-combine, 7-element-combine
  • Specialty: medic-mech, engineer-mech, sapper-bomb-mech, signal-corps-mech, kamikaze-suicide-mech, support-shield-mech, drone-controller-mech
- Vary chrome / paint / weathering: pristine-chrome, battle-scarred, panel-line-wash, faded-paint, freshly-deployed, rusted-veteran, ceremonial-gold-trim, midnight-stealth-matte, neon-accent-trim.
- Vary weapons: energy-sword, plasma-rifle, beam-cannon, missile-pod, shield, war-hammer, harpoon, chain-whip, gauntlet-blade, twin-pistols, particle-beam, flamethrower, electromagnetic-rail-gun, gravitational-claw.

━━━ FORMAT ━━━
Each entry is ONE mech, 8-18 words, comma-separated phrases. Always reference 1/144-scale or articulated or chrome or transformation-seam:
- "1/144 samurai-armor humanoid mech with chrome shoulder-pauldrons, energy-katana, panel-line-wash"
- "Articulated lion-form beast-mech with chrome-mane, clawed paws, retractable plasma-claws"
- "Transforming jet-to-robot mech mid-fold, snap-on missile-pods, chrome-canopy cockpit"
- "Powered-armor heavy-tank exosuit with chest-reactor glow, twin shoulder-cannons, rusted-veteran paint"

━━━ BANNED ━━━
- IP-named (Optimus / Megatron / specific Gundam designations)
- Real military / real robots
- Identical entries
- "Generic mech" or "default mech" descriptions

━━━ DEDUP RULE ━━━
- No two entries share MECH-CLASS + WEAPON (e.g., only one "samurai-mech with energy-katana").
- Vary across the 200 entries.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
