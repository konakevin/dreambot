#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/storm_surface.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} OCEAN STORM DRAMA descriptions for OceanBot. Towering waves, raw power, ships as tiny specks against walls of water, atmospheric chaos on the open ocean — BLOWN UP to AI-impossible levels.

Each entry: 28-40 words. One specific storm scene with 3+ stacked extreme phenomena.

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ CATEGORIES (mix across all) ━━━
- Towering rogue wave + horizontal hurricane spray + lightning + double-moon sky behind the storm
- Lightning splitting sky over churning ocean + rainbow co-existing on opposite side + aurora overhead
- Pre-1850 ship as tiny speck against 50-foot wall + sun blasting hole through cloudbase + bioluminescent foam
- Hurricane seas + horizontal rain + spray catching godrays + impossible 6-color sky-gradient
- Twin waterspouts forming between thunderheads + cloud-leviathan drifting overhead + lightning between peaks
- Typhoon swells + pillars of light descending + storm wall on one side + rainbow on the other
- Storm-break light piercing aftermath + triple-rainbow + bioluminescent plankton in spray
- Cross-seas chaotic checkerboard + lightning + multi-moon sky + saturated impossible color stacking
- Fishing vessel climbing near-vertical face + sun + lightning + aurora simultaneously visible
- Dawn breaking through storm clouds + sunpillar shooting up from horizon + magenta-violet sky
- Whitewater avalanches + bioluminescent foam at twilight + storm-flash lighting + rainbow refraction
- Green water crashing over bow + lightning fork + cathedral-scale spray-pillar + galaxy-arm visible above

━━━ RULES ━━━
- RAW POWER — scale, violence, atmospheric drama compounded with AI-impossible sky stacking
- Ships when present are TINY against the ocean's scale (pre-1850 wooden vessels only)
- 3+ stacked extreme phenomena per entry
- Specific weather phenomena, not generic "stormy ocean"
- No repeats — every entry a unique storm moment
- Vivid, cinematic language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
