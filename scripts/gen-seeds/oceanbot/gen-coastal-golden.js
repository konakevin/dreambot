#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/coastal_golden.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} GOLDEN COASTAL WAVE/SUNSET descriptions for OceanBot — BLOWN UP to AI-impossible levels. Pretty turquoise water with golden light shining through, sunset reflections on wet sand, small perfect waves backlit by golden hour, compounded with stacked extreme phenomena. NOT location-specific.

Each entry: 28-40 words. One specific golden coastal moment with 3+ stacked extreme phenomena.

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ CATEGORIES (mix across all) ━━━
- Turquoise wave with golden sunlight blasting through translucent face like stained glass + double-rainbow + spray-haze
- Sunset reflections on wet sand + impossible 6-color sky-gradient + sunpillar shooting up from horizon
- Small perfect waves backlit by golden hour + spray catching fire + bioluminescent plankton in foam
- Foam patterns on dark sand reflecting peach and copper sky + galaxy-arm visible at indigo zenith
- Wave breaking in slow motion with golden mist + godrays piercing through + caustic patterns visible
- Last light turning shallow water to liquid amber + storm cell on one side + sun on the other
- Sun-star flare through curling wave lip + triple-rainbow + bioluminescent shoreline at twilight
- Golden hour shorebreak + spray creating rainbow prisms + lightning in distant cloud + impossible color stacking
- Receding wave + mirror-wet sand reflecting entire sunset + multi-moon sky + aurora overhead
- Silhouette of gentle surf against molten orange horizon + cloud-leviathan drifting + spray-particulate thick
- Turquoise shallows fading to deep blue + golden cloud reflections + storm wall + rainbow co-existing
- Backwash meeting incoming wave + golden interference patterns + bioluminescent foam + multi-moon

━━━ RULES ━━━
- GOLDEN LIGHT is the hero — sunrise/sunset, warm tones, backlit water
- Turquoise + gold color palette dominant compounded with AI-impossible sky stacking
- 3+ stacked extreme phenomena per entry
- NOT location-specific — universal coastal beauty
- Small to medium waves, not monster surf
- No repeats — every entry a unique golden coastal moment
- Vivid, warm language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
