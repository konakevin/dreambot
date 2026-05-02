#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/mech_toy_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `Write ${n} MECH-TOY-RAMPAGE scenes for ToyBot's mech-toy-rampage path. ENSEMBLE BATTLE energy. Saturday-morning anime-toy-line. Non-IP. Each entry 20-32 words.

━━━ HARD RULES ━━━
- 80%+ entries: MULTIPLE mechs (3+) in active combat / coordination.
- 50%+ entries: explicit battle action (mid-clash / mid-volley / mid-melee / mid-siege / mid-rescue / mid-form-up / mid-charge).
- Solo poses MAX 20% — must have clear battlefield context (aftermath, distant battle visible, monumental standoff).

━━━ MECHS ━━━
1/144-to-1/100-scale articulated robot-toys, chrome paneling, transformation seams, glowing cockpit-canopy, panel-line wash, snap-on weapons (energy-sword, plasma-rifle, shield, shoulder-cannon, missile-pod, beam-cannon, war-hammer). Archetypes: humanoid-mecha, transforming-car-mecha, beast-form (lion / tiger / wolf / dragon / scorpion mech), powered-armor exosuit, kaiju-mech, megazord-combiner. Non-IP archetype only.

━━━ EXAMPLE ARCHETYPES (rotate, vary) ━━━
- 5-mech squadron mid-charge across rooftop, energy-blades unified, cockpit-glows synchronized
- Mech siege of fortress — 6 chrome mechs assaulting walls, defenders firing back
- Squad-vs-squad melee — 4 chrome vs 4 dark in chaotic free-for-all, sparks crossing
- Megazord forming — 5 mechs mid-snap-together, electric-arc connections, panels locking
- Aerial dogfight — 6 jet-mechs in furball over megacity, contrails spiraling
- Mech vs giant kaiju — 4 mechs pinning kaiju from multiple angles, claw + energy
- Beach-landing — 5 mechs charging onto resin-water shore, defenders firing from cliff
- Pit-crew servicing battle-mech — 4 smaller mechs swarming damaged hero-mech mid-combat
- Rescue-extraction — 3 mechs extracting downed comrade, 2 covering with weapon-fire
- 1v1 surrounded — duel pair mid-blade-lock, 4 spectator-mechs in shadowed circle
- Squadron parade — 8 mechs in ranks, banners, chrome reflecting parade-light
- Mech maintenance-bay — 5 mechs in scaffolding-cradles, mechanic-mechs swarming with tools

━━━ MUST-HAVE per entry ━━━
- Articulated / Gundam-kit / chrome / 1/144-scale / panel-line language
- Multi-mech ensemble OR solo-with-battlefield-context
- Mid-action verb + specific weapon/feature

━━━ BANNED ━━━
- Solo mid-pose with no battle context (the failure mode — fix it)
- IP-named characters (Optimus / Megatron / specific Gundam designations)
- CGI / illustration / human pilots visible / passive standing.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
