#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/power_armor_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SETTING descriptions for MechBot's power-armor-infantry path. Each describes WHERE the squad is operating, 14-22 words. Tactical environments where soldiers do soldier work.

━━━ SETTING CATEGORIES ━━━
- Urban rubble street (broken buildings, parked dead vehicles, smoke rising)
- Underground bunker corridor (sodium emergency lights, blast doors)
- Alien jungle floor (bioluminescent fungus, towering fronds, mist)
- Orbital drop zone fresh-landed (drop pods steaming, plasma-melted ground)
- Frozen tundra under storm (snow-blasted, white-out, jagged ice ridges)
- Spaceship interior — boarding action (zero-G corridor, breached hull, debris)
- Ridgeline high ground (soldiers silhouetted, vista of valley below)
- Desert FOB perimeter (sandbag walls, antenna mast, distant heat shimmer)
- Hostile colony ruins (overgrown human habitat, structures partially collapsed)
- Bunker breach interior (just-cleared doorway, tactical light beams cutting smoke)

━━━ ATMOSPHERIC ELEMENTS ━━━
- Volumetric smoke / dust / breath-fog
- Tactical lights cutting visibility
- Tracer rounds / muzzle flashes nearby
- Worn signage / faction insignia / mission-relevant terrain features
- Time-of-day cue (dawn / dusk / night-vision-green / pre-storm overcast)

━━━ EXAMPLES (write fresh) ━━━
- "Urban rubble at dusk, half-collapsed apartment block, dead car burning slowly, distant artillery flashes on the skyline"
- "Underground bunker corridor with sodium emergency lights pulsing red, blast door half-cycled open, cordite haze in the air"
- "Alien jungle floor at high humidity, bioluminescent fronds at chest-height, mist obscuring middle distance, predator-call ambient"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: terrain category + time-of-day + atmospheric hazard.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
