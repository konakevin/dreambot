#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} BEACH ATMOSPHERIC DETAIL descriptions for BeachBot.

Each entry: 6-14 words. One specific beach atmospheric element.

━━━ CATEGORIES ━━━
- Sand-blow across beach in breeze
- Sea-spray misting in sun
- Mist-over-water at dawn
- Palm-frond-shadow on sand
- Seagull-drift in sky
- Sunlight-sparkle on water-surface
- Foam-patterns on wet-sand
- Wave-crest-white spray
- Pelican-flight-line distant
- Fishing-boat distant silhouette
- Wind-ripples on tide-pool
- Kelp-strand drift in current
- Sand-crabs tiny-burrowing tracks
- Sea-grass-cover waving
- Pollen-haze warm-sunbeam
- Salt-spray on rocks
- Driftwood-patterns on sand
- Shell-trail along tide-line
- Ocean-mist lifting backlit
- Scattered-coconuts on beach
- Palm-debris fallen
- Tropical-storm-bark littered
- Wave-echo-pattern on sand
- Sun-dapples under-palm-shade
- Turtle-tracks in wet-sand
- Swallow-flight arcing
- Shore-bird prints in damp sand
- Crystal-salt crust on rocks
- Water-sheen on sand
- Golden-dust-particles in sunbeam
- Sand-sculpture wind-carved
- Smooth-river-rocks polished
- Driftwood-bleached white
- Wave-lines slowly moving

━━━ RULES ━━━
- Beach-specific atmospheric variety
- Visual / renderable

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
