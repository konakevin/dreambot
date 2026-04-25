#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/calm_seas.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MIRROR-FLAT CALM OCEAN descriptions for OceanBot. Glass-smooth water, perfect reflections, cinematic stillness, meditative seascapes. The ocean at its most peaceful and vast.

Each entry: 15-25 words. One specific calm ocean scene.

━━━ CATEGORIES (mix across all) ━━━
- Glass-smooth water reflecting an entire sky of pastel sunrise colors
- Lone fishing boat silhouette on a perfectly flat horizon at dawn
- Fog on dead-calm water, visibility fading to nothing in every direction
- Silver moonpath stretching across mirror-still ocean to the horizon
- Perfect cloud reflections on water so still it's impossible to find the horizon
- Twilight calm with Venus hanging over mercury-colored water
- Morning mist lifting off glassy harbor water, boats motionless
- Becalmed sailing ship reflected perfectly in windless tropical water
- Sunset painting the entire ocean surface in molten gold and copper
- Pre-storm calm — eerie glass water under darkening anvil clouds
- Dawn breaking over Arctic waters, pink sky doubled in still sea
- Infinity-point where sky and calm ocean merge into one tone

━━━ RULES ━━━
- STILLNESS is the subject — mirror water, no waves, perfect reflections
- Emphasize color, light, atmosphere, vast emptiness
- Specific moments and conditions, not generic "calm ocean"
- No repeats — every entry a unique still-water moment
- Vivid, meditative language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
