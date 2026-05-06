#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/titan_war_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for MechBot's titan-war-machines path. Each describes what the titan is DOING mid-combat, 12-18 words.

━━━ ABSOLUTE RULE — ACTIVE WAR ━━━
The titan is ALWAYS in combat. Mid-engagement freeze-frames. Never idle, never passive. War is happening RIGHT NOW.

━━━ ACTION CATEGORIES ━━━
- Firing main weapon (recoil compresses leg actuators / muzzle flash dwarfs city)
- Striding through ruins (foot mid-impact crushing rubble / dust plume erupting)
- Engaged with another titan (grappling / firing point-blank / ramming)
- Shielding the ground forces below (energy bubble deployed / blocking incoming fire)
- Emerging from smoke or rubble (just-revealed silhouette through dust)
- Collapsing mid-stride (knee buckling / smoke from ruptured plates)
- Orbital drop landing (impact crater forming / dust ring expanding outward)
- Leveling architecture (shoulder-checking a tower / fist through skyscraper)
- Calling-down strike (orbital lance painting target with laser designator)
- Wading through water/swamp (legs displacing waves / splash columns rising)

━━━ BANNED ━━━
- NO standing still / posing
- NO peaceful "between battles" idle
- NO repair-bay or hangar (that's mecha-pilots territory)

━━━ EXAMPLES (write fresh) ━━━
- "Firing twin shoulder railguns at distant fortress, electromagnetic discharge crackling along barrels, recoil compressing leg pistons"
- "Stepping through a city block mid-collapse, foot crushing through pavement, dust plume erupting around the calf"
- "Locked grapple with another titan, shoulder cannons close enough to scorch armor, both machines mid-tackle"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action + body part involved + visible violence/effect.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
