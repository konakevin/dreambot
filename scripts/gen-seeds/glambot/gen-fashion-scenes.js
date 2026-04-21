#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/fashion_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} FASHION SCENE descriptions for GlamBot — editorial backdrops.

Each entry: 10-20 words. One specific editorial backdrop.

━━━ CATEGORIES ━━━
- Neon-alley at night (wet pavement + reflections)
- White-cyc studio (plain white seamless)
- Rain-street with streetlights
- Mirrored-room (infinite reflection)
- Ornate-ballroom with chandeliers
- Industrial-warehouse with shafts of light
- Rooftop at golden hour city-skyline
- Desert-dune at sunset
- Tropical-beach editorial
- Gothic-cathedral interior
- Abandoned-factory graffiti walls
- Metro-subway platform late-night
- Art-gallery minimalist walls
- Japanese-garden bamboo-grove
- Paris-rooftop with Eiffel visible
- Tokyo-neon-crosswalk
- New-York-rooftop at night
- Alpine-snowy peak
- Ocean-shore with waves crashing
- Cathedral-cloister arches
- Classical-marble-columns ruin
- Rose-garden in full bloom
- Opera-house grand-staircase
- Victorian-library with books
- Minimalist-loft with skyline view
- Jungle-greenhouse tropical
- Arctic-ice-field white landscape
- Lava-volcanic landscape
- Cherry-blossom garden
- Street-market bustling
- Parisian-cafe interior
- Helicopter-pad at dusk
- Sand-dunes Saharan
- Volcanic-black-sand beach
- Rooftop-pool at night
- Ski-lodge cabin interior
- Underground-club strobe-lit
- Amphitheater-Roman ruin
- Subway-tunnel dark
- Rain-soaked rooftop
- Gothic-mansion grand hall
- Desert-oasis palm-trees
- Modern-minimalist architecture
- Neo-deco apartment interior
- Industrial-loft brick-wall
- Ornate-boudoir velvet + chandelier
- Cave-crystal formations
- Underwater-pool submerged
- Glass-walkway skyscraper-edge
- Rose-petal carpeted floor

━━━ RULES ━━━
- Editorial / fashion-shoot aesthetic
- Bold / edgy / dramatic settings
- Named specific scene types

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
