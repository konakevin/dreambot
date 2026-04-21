#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/toy_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} TOY LANDSCAPE descriptions for ToyBot's toy-landscape path — NO characters. Pure landscape rendered entirely in a toy medium. Landscape is hero, toy-ness is the art.

Each entry: 15-30 words. One specific landscape in a specific toy medium.

━━━ CATEGORIES (rotate MEDIUM across entries — LEGO-heavy but mix claymation + vinyl) ━━━
- LEGO brick waterfall (transparent-brick water cascading)
- LEGO brick mountain range (snow-white-brick peaks)
- LEGO desert canyon (tan-brick cliffs with red-brick accents)
- LEGO tropical island (green-brick palms + blue-brick sea)
- LEGO arctic landscape (white-brick tundra + blue-brick ice)
- LEGO forest (green-brick trees dense)
- LEGO volcano with lava-brick flow
- LEGO river delta
- LEGO meadow (green studs + flower-pieces)
- LEGO beach (tan-brick sand + blue-brick surf)
- LEGO canyon with stepped bricks
- Clay mountain-range (stop-motion valley)
- Clay winter-forest (grey clay-trees with white-snow-clay)
- Clay-autumn-hills (orange + brown clay rolling hills)
- Clay-alpine-valley
- Clay-volcanic-plateau
- Vinyl-coast (smooth-sculpted figurine-style coast)
- Vinyl-dessert-landscape (pastel-colored smooth hills)
- LEGO savanna grassland
- LEGO bamboo-forest
- LEGO ocean-reef (transparent-brick water + coral)
- LEGO frozen-lake
- LEGO cherry-blossom field
- LEGO maple-autumn forest
- LEGO moss-covered ruins overgrown
- Clay-jungle canopy
- Clay-crater-moon surface
- Clay-rolling-farmland
- Vinyl-mountain with matte finish
- Vinyl-iceberg in glossy-blue sea
- LEGO lavender-field (purple-brick rows)
- LEGO cornfield in autumn
- LEGO geyser field
- LEGO rock-arches desert
- LEGO mangrove-swamp
- LEGO coral-reef from above water
- LEGO misty-marsh
- LEGO foggy-pine-forest
- LEGO glacial-fjord
- LEGO red-desert mesas

━━━ RULES ━━━
- NO characters
- Medium clearly visible (LEGO = bricks, clay = thumbprints, vinyl = smooth)
- LEGO-weighted mix (60%+ LEGO)
- Landscape is hero

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
