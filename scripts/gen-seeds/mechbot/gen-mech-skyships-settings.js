#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mech_skyships_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SKY+ENVIRONMENT descriptions for MechBot's mech-skyships path. Each describes the SKY (always) and the GROUND BIOME below (when applicable), 14-22 words. The sky is the canvas; the biome below is for context and depth.

━━━ SETTING CATEGORIES — SKY OVER EACH MECHBOT BIOME ━━━
Most entries (~70%) should be: sky over one of MechBot's other biomes. Tilt the camera up, OR tilt down to show ships passing over the world below. Either angle.

- Sky over titan-warzone city (broken skyline silhouettes at frame bottom, smoke columns rising)
- Sky over industrial complex (refinery flare-stacks low, conveyor lines, distant machinery)
- Sky over rust-wasteland (cracked desert / canyon / dust storm beneath, scavenger trails)
- Sky over alien biomech biome (alien fungal-fronds / coral structures / hive forms below)
- Sky over mecha-pilot launch field (hangar towers low, deployment platforms below)
- Sky over power-armor tactical zone (squad silhouettes on a ridge / orbital drop zone)

━━━ PURE-SKY CATEGORIES (~30%) ━━━
- Cloud-canyon (gigantic cloud architecture, layers like cathedrals)
- Atmospheric layer at altitude (visible curvature, thinning air, blue-violet gradient)
- Storm front (wall of cumulonimbus, lightning veining, weather drama)
- Dawn / dusk cloud-cathedral (sun rays piercing, gold-and-violet color story)
- Twilight haze (dust-orange post-sunset, ships silhouetted)
- Aurora-strewn polar sky (green/violet curtains, cold star-field above)
- Rain-blown sky (sheets of rain, low cloud ceiling, ships punching through)

━━━ TURNED UP TO 11 — NON-NEGOTIABLE ATMOSPHERIC LAYERS ━━━
Every entry must include atmospheric drama. Stack:
- Multi-layer cloud depth (foreground / mid / far)
- Volumetric god-rays / sun-shafts
- Color gradient (dawn / dusk / storm / aurora / twilight)
- Weather element (wind, rain, lightning, heat-shimmer, ice-glitter)
- Scale staging (huge cloud structures, distant fleet specks, ground micro-detail)

━━━ ABSOLUTE BAN — NO MODERN AIRCRAFT REFERENCES ━━━
NEVER mention: airport, runway, jet trail, contrail (acceptable as "vapor trail"), aircraft, military base. The world is sci-fi, not modern Earth.

━━━ EXAMPLES (write fresh) ━━━
- "Sky over a destroyed-city warzone, broken skyline silhouettes at frame bottom, smoke columns rising into a storm-front cloud-cathedral with lightning veining"
- "Cloud-canyon at dawn, gigantic cumulonimbus layers like architecture, gold sun-shafts piercing the gaps, distant fleet-specks at vanishing point"
- "Sky above a refinery complex, flare-stacks low, dust-orange twilight haze, ships descending through volumetric light, vapor trails crisscrossing"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: biome-below (or pure-sky-type) + cloud-layer composition + light direction + weather element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
