#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/polar_seas.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} POLAR OCEAN descriptions for OceanBot. Arctic and Antarctic ocean scenes — towering icebergs, whales in ice water, aurora over polar seas, frozen ships, ice caves at waterline.

Each entry: 15-25 words. One specific polar ocean scene.

━━━ CATEGORIES (mix across all) ━━━
- Towering icebergs with electric blue interiors glowing through translucent walls
- Humpback whales surfacing through gaps in broken sea ice
- Frozen ships locked in pack ice under northern lights
- Aurora borealis reflecting on dark polar water between ice floes
- Ice caves at waterline with turquoise light filtering through
- Penguin colonies on ice shelves with dark ocean beyond
- Calving glacier face with house-sized chunks crashing into the sea
- Narwhal pods surfacing in leads between pack ice
- Underwater view of iceberg — vast blue mass extending into deep
- Polar bear on ice edge with dark water and orcas below
- Tabular iceberg stretching to the horizon, flat as a runway
- Midnight sun painting polar waters in gold and pink

━━━ RULES ━━━
- ICE + OCEAN — always both elements present
- Scale and color of ice (blue, white, turquoise, crystal)
- Specific polar phenomena and wildlife, not generic "icy water"
- No repeats — every entry a unique polar ocean moment
- Vivid, specific language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
