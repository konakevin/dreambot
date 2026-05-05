#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/calm_seas.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MIRROR-FLAT CALM OCEAN descriptions for OceanBot — BLOWN UP to AI-impossible levels. Glass-smooth water, perfect reflections, cinematic stillness, meditative seascapes — compounded with stacked extreme phenomena reflected DOUBLED on the mirror surface.

Each entry: 28-40 words. One specific calm ocean scene with 3+ stacked extreme phenomena (and the mirror water DOUBLES the drama).

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ CATEGORIES (mix across all) ━━━
- Glass-smooth water mirroring impossible 6-color sunrise-sky + storm cell on horizon + galaxy-arm visible at indigo zenith
- Pre-1850 sailing ship silhouette on flat horizon at dawn + double-rainbow + sunpillar shooting up from horizon
- Fog on dead-calm water + bioluminescent plankton glowing through mist + multi-moon sky overhead
- Silver moonpath stretching across mirror-still ocean + aurora reflecting + cloud-leviathan drifting overhead
- Perfect cloud reflections on water so still + lightning fork + rainbow co-existing in same sky
- Twilight calm with Venus + mercury-colored water + bioluminescent shoreline + galaxy visible at zenith
- Morning mist lifting off glassy harbor + sun blasting hole through cloudbase + spray-haze through godrays
- Becalmed sailing ship reflected in windless tropical water + storm wall + rainbow + impossible color stacking
- Sunset painting entire ocean surface in molten gold and copper + sunpillar + aurora overhead reflecting
- Pre-storm calm — eerie glass water + storm cell over distant islands + lightning + sun blasting through
- Dawn breaking over Arctic waters + pink sky doubled in still sea + multi-moon + aurora above
- Infinity-point where sky and ocean merge + galaxy-arm visible + cloud-leviathan drifting + sunpillar
- Mirror water reflecting sky-on-fire (gold + crimson + magenta simultaneously) + bioluminescent foam at edge

━━━ RULES ━━━
- STILLNESS is the subject — mirror water, no waves, perfect reflections (which DOUBLE the stacked phenomena)
- Emphasize color, light, atmosphere, vast emptiness compounded with AI-impossible sky stacking
- 3+ stacked extreme phenomena per entry (DOUBLED by mirror reflection)
- Specific moments and conditions, not generic "calm ocean"
- No repeats — every entry a unique still-water moment
- Vivid, meditative language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
