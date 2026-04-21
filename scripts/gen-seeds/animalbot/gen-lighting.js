#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for AnimalBot — dramatic named treatments for wildlife photography. The lighting should complement the animal subject and create hero-moment impact.

Each entry: 10-20 words. One specific named lighting treatment.

━━━ CATEGORIES ━━━
- Rim-light backlight (sun behind animal making fur glow, silhouette with hair-light)
- Golden-hour raked (low-angle amber cross-light picking up fur texture)
- Blue-hour afterglow (deep violet-blue sky, silvery cool light on animal)
- Shaft-of-sun spotlight (single beam through canopy lighting just the animal)
- Storm-contrast (dark clouds, single light break hitting subject)
- Dappled sunlight through leaves (mottled light-dark patterns across coat)
- Snow-bounced ambient (cool even light from snow surfaces, no direct sun)
- Fog-diffused soft (everything bathed in luminous fog-light, directional)
- Moonlit silver (full moon, cool silver-blue, stark shadows)
- Predator-hour (last light of sunset, ultra-low amber, long shadows)
- Aurora-cast green (green-violet from aurora, on winter animal)
- Firelight-warm (distant wildfire or sunset igniting background orange)
- Twin-source rim (sun behind, fill-light front — pro wildlife photo setup)
- Monsoon-moody (heavy overcast, flat-saturated tropical light)
- Ice-refracted glittery (sun through ice/snow creating light fragments)
- Puddle-reflection (animal at water-edge, light bouncing up from surface)
- Frost-breath backlit (exhalation lit from behind, steam visible)
- Fog-and-god-rays (shafts piercing mist, animal in beam)
- High-key overcast snow (pure white-gray, minimal shadow)
- Low-key forest depth (deep shadows, dramatic chiaroscuro, single light-pool)

━━━ RULES ━━━
- Named specific lighting treatments — not "nice light"
- Must work for wildlife photography
- Must make the animal pop / heroic / luminous

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
