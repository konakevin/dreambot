#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/tropical_paradise.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TROPICAL OCEAN PARADISE descriptions for OceanBot. Crystal lagoons, turquoise shallows over white sand, palm-fringed atolls, overwater views into impossibly clear water. Maldives/Bora Bora/Seychelles/Fiji/Tahiti energy. NOT named resorts.

Each entry: 15-25 words. One specific tropical paradise scene.

━━━ CATEGORIES (mix across all) ━━━
- Crystal lagoon with white sand bottom visible through turquoise water
- Palm-fringed atoll with shallow reef visible from above
- Overwater view straight down into clear water with fish and coral visible
- Sandbar emerging at low tide surrounded by infinite shades of blue
- Bora Bora energy — volcanic peak rising behind turquoise lagoon
- Seychelles granite boulders on white sand beach with clear water
- Fiji-style soft coral gardens in shallow warm water
- Tahiti black sand beach with turquoise water contrast
- Maldives sandbank barely above water, 360-degree ocean horizon
- Underwater view of white sand ripples with sunbeam patterns
- Split-view half above half below crystal tropical waterline
- Tiny palm island from aerial view surrounded by reef and gradient blues

━━━ RULES ━━━
- CLARITY and COLOR — impossibly clear water, visible bottom, gradient blues
- Tropical warmth and perfection, aspirational beauty
- NOT named resorts or hotels — natural paradise energy
- No repeats — every entry a unique tropical moment
- Vivid, specific language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
