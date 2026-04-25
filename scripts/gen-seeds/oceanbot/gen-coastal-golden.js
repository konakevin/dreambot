#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/coastal_golden.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} GOLDEN COASTAL WAVE/SUNSET descriptions for OceanBot. Pretty turquoise water with golden light shining through, sunset reflections on wet sand, small perfect waves backlit by golden hour. NOT location-specific.

Each entry: 15-25 words. One specific golden coastal moment.

━━━ CATEGORIES (mix across all) ━━━
- Turquoise wave with golden sunlight shining through the translucent face
- Sunset reflections on wet sand as thin foam sheets recede
- Small perfect waves backlit by golden hour, spray catching fire
- Foam patterns on dark sand reflecting peach and copper sky
- Wave breaking in slow motion with golden mist hanging in the air
- Last light turning shallow water to liquid amber over white sand
- Sun-star flare through a curling wave lip at magic hour
- Golden hour shore break with spray creating rainbow prisms
- Receding wave leaving mirror-wet sand reflecting entire sunset
- Silhouette of gentle surf against a molten orange horizon
- Turquoise shallows fading to deep blue with golden cloud reflections
- Backwash meeting incoming wave, creating golden interference patterns

━━━ RULES ━━━
- GOLDEN LIGHT is the hero — sunrise/sunset, warm tones, backlit water
- Turquoise + gold color palette dominant
- NOT location-specific — universal coastal beauty
- Small to medium waves, not monster surf
- No repeats — every entry a unique golden coastal moment
- Vivid, warm language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
