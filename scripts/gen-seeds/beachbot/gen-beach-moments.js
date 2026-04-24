#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/beach_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BEACH MOMENT descriptions for BeachBot's beach-moment path — atmospheric beach-object moments. Beach-objects tell the story. NO PEOPLE.

Each entry: 15-30 words. One specific object-centered beach moment.

━━━ CATEGORIES ━━━
- Hammock between palms swaying empty
- Lounge-chair with footprints leading away
- Driftwood and shells arranged
- Beach umbrella + side-table with book
- Sandcastle with tiny-flag in breeze
- Surfboard silhouette against sunset
- Flip-flops-on-sand at dawn
- Straw-hat on towel abandoned
- Book and sunglasses on chair
- Cocktail glass with paper-umbrella (no hands)
- Sea-glass collection on driftwood
- Shell-arrangement by the tide-line
- Rope-hammock knotted to palms
- Wooden-beach-chair ocean-view empty
- Picnic-blanket with basket and bottle
- Open-book face-down on sand
- Towel laid on sand with sun-shadow
- Pair-of-sandals by water-line
- Fishing-pole leaning against driftwood
- Surfboards lined at beach-entry
- Kayak on sand paddle-in
- Beach-cart with umbrella + cooler
- Cooler + soccer-ball on sand
- Beach-volleyball-net empty
- Lifeguard-tower at dusk
- Tiki-bar-umbrella by water
- Wooden-dock into water empty
- Driftwood-scluptures on beach
- Beach-bonfire circle unlit
- Beach-bonfire lit-at-dusk
- Message-written-in-sand
- Heart-drawn-in-sand at tide-line
- Wet-footprints pattern
- Sea-star-left-on-rock
- Fishing-nets drying on pier
- Lifeguard-buoy on stand
- Oar-paddle stuck in sand
- Kite tangled on driftwood
- Sunglasses-folded on wet-stone
- Single-flip-flop washed-up

━━━ RULES ━━━
- NO HUMANS (not even silhouettes)
- Beach-objects tell the story
- Atmospheric/narrative-implied

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
