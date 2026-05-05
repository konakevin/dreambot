#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/polar_seas.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} POLAR OCEAN descriptions for OceanBot — BLOWN UP to AI-impossible levels. Arctic and Antarctic ocean scenes — towering icebergs, whales in ice water, aurora over polar seas, frozen ships, ice caves at waterline, compounded with stacked extreme phenomena.

Each entry: 28-40 words. One specific polar ocean scene with 3+ stacked extreme phenomena.

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ CATEGORIES (mix across all) ━━━
- Towering icebergs with electric-blue interiors + cathedral-scale aurora overhead + bioluminescent plankton in dark water
- Humpback whales surfacing through pack ice + multi-moon sky + sunpillar shooting up from horizon
- Frozen pre-1850 sailing ship locked in ice + aurora rippling overhead + lightning in distant storm cell
- Aurora borealis reflecting on dark polar water + galaxy-arm visible above + impossible 6-color sky-gradient
- Ice caves at waterline with turquoise light filtering through + caustic patterns + bioluminescent foreground
- Penguin colonies on ice shelf + dark ocean + sunset on one side + storm wall on the other
- Calving glacier face + house-sized chunks crashing into sea + double-rainbow forming in spray-mist
- Narwhal pods surfacing + aurora + multi-moon sky + iceberg-cathedral towers in background
- Underwater iceberg view + vast blue mass + caustic light + bioluminescent abyssal glow below
- Polar bear on ice edge + dark water + orcas below + storm wall + rainbow co-existing
- Tabular iceberg stretching to horizon + cloud-leviathan drifting + impossible color stacking
- Midnight sun + polar waters in gold and pink + aurora above + bioluminescent foam at edges
- Under-ice cathedral with luminescent jellyfish gardens + electric-blue ice stalactites + caustic light dancing
- Ice arch with surf rolling through + spray-pillar + sun blasting through + rainbow refraction

━━━ RULES ━━━
- ICE + OCEAN — always both elements present
- Scale and color of ice (blue, white, turquoise, crystal) compounded with AI-impossible sky stacking
- 3+ stacked extreme phenomena per entry
- Specific polar phenomena and wildlife, not generic "icy water"
- No repeats — every entry a unique polar ocean moment
- Vivid, specific language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
