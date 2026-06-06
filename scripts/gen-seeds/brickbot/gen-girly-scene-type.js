#!/usr/bin/env node
/**
 * BRICKBOT_GIRLY_SCENE_TYPE — pastel-cute scene category for ultra-cute path.
 * Audit 2026-06-05: 72 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_girly_scene_type.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SCENE-TYPE entries for BrickBot's girly path — each entry names a pastel-cute scene archetype for a candy / fairy / unicorn / boutique / castle / mermaid LEGO MOC diorama. Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC sweet scene archetype (CANDY CASTLE / BALLET STUDIO / MERMAID LAGOON / FASHION BOUTIQUE / FAIRY MEADOW / CUPCAKE BAKERY / TEA PARTY / etc.) AND describes the brick build in 25-40 words including structural details (curved walls, SNOT-curved domes, glitter-flag accents, lollipop-stick gardens, mini-doll cast). Reads ULTRA-CUTE.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 PALACE / CASTLE: candy castle, pastel coronation hall, princess-court, fairy-tale castle, royal-stable
- ~4 BAKERY / CAFE: cupcake bakery, ice-cream parlor, candy-shop, macaron cafe, fairy-tea-house
- ~4 BOUTIQUE / SHOP: dress-boutique, hat-shop, jewelry-store, perfume-salon, makeup-counter
- ~3 STAGE / PERFORMANCE: ballet studio, recital stage, music-box stage, opera-house, ballroom
- ~3 MERMAID / OCEAN: undersea palace, coral grove, shell-pavilion, pearl-treasure cove
- ~3 UNICORN / PEGASUS: unicorn-stable, pegasus-meadow, rainbow-corral, starlight-stable
- ~3 GARDEN / OUTDOOR: rose-garden gazebo, butterfly-greenhouse, fairy-meadow, tea-party lawn
- ~3 SPA / SLUMBER: spa-pavilion, nail-salon, slumber-party loft, dressing-room
- ~3 PARTY / CELEBRATION: birthday-party, garden-party, slumber-bash, sweet-sixteen, confetti-room
- ~2 FAIRY / FAE: faerie-grove, pixie-cottage, dragonfly-bower, mushroom-cottage
- ~2 SCHOOL / ACADEMY: pastel-academy, princess-school, fairy-classroom
- ~2 SEASONAL: spring-blossom festival, winter-snow-princess hall, autumn-pumpkin patch (cute)
- ~1 CHURCH / WEDDING-CHAPEL: pastel wedding chapel
- ~1 PASTEL-CARNIVAL: cotton-candy fairground

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated/spaced words), em-dash, 25-40 word body. Body must include brick-build structural detail + cast hint. Touchpoints:
"CANDY CASTLE — a pastel-pink brick castle with SNOT-curved turrets topped in round-dome candy-builds, lollipop-stick gardens of bar-elements, heart-tile windows, princess mini-doll on the front balcony"
"ICE-CREAM PARLOR — a mint-and-pink brick parlor with a swirl-cone sign of stacked round-plates, a counter of glass-dome sundae-builds, checker-tile floor, mini-doll customers seated at outdoor tables"
"FASHION BOUTIQUE — a chic lavender brick boutique with a display-window of dress-builds on mini-doll stands, a tile-rack of outfit-elements, a mirror-wall, mini-doll customers browsing"

━━━ BANS ━━━
- NO masculine vocab
- NO photoreal vocab
- NO grim / dark / harsh
- NO licensed franchise IP
- NO duplicating scene archetypes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
