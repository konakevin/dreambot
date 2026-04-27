#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/frost_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} FROZEN / HIGHLAND ANCIENT CIVILIZATION scene descriptions for AncientBot. Each entry is 25-40 words describing a specific cold-weather or high-altitude ancient scene. Pre-600 BC ONLY.

These are civilizations in HARSH COLD environments — mountain fortresses, frozen highland plateaus, snow-dusted stone monuments, winter storms over ancient cities. The cold is a character in every scene.

━━━ SCENE TYPES (mix across all) ━━━
- Urartu mountain fortresses (Armenian highlands, massive stone citadels perched on volcanic ridges, snow-capped peaks behind, iron-cold air)
- Winter over Mesopotamian cities (rare snowfall on ziggurats, frost on glazed brick, breath visible in cold temple corridors)
- Highland trade routes (mountain passes with caravan shelters, frozen streams, pack animals on narrow stone paths, distant peaks)
- Snow-dusted megalithic sites (Stonehenge in winter frost, Carnac stones in morning ice, Gobekli Tepe hilltop in cold rain)
- Frozen harbors (ice forming around moored ships, frost on rigging, cold dawn over still water)
- Mountain sanctuary retreats (high-altitude shrines, thin air, prayer smoke rising straight in still cold, panoramic views)
- Catalhoyuk in Anatolian winter (rooftop-entry houses with snow on flat roofs, smoke from roof-holes, cold starlight)
- Hittite Hattusa in mountain cold (lion gates with frost, massive stone walls against grey winter sky)
- Nomadic highland camps (felt/hide shelters, central hearth, bronze weapons stacked, breath-fog, stars above treeline)
- Frozen river crossings (armies or caravans crossing ice, distant fortress on opposite bank)

━━━ RULES ━━━
- Each entry is ONE specific cold/highland scene with civilization baked in
- COLD must be felt — frost, snow, ice, breath-fog, grey sky, pale light, frozen water
- Include specific period details (stone masonry, bronze fittings, wool and felt, cedar smoke)
- 25-40 words
- NO medieval castles, NO Greek/Roman, NO fantasy ice-magic
- These are REAL ancient places in REAL cold weather

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
