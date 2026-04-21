#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/avant_garde_concepts.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} AVANT-GARDE CONCEPT descriptions for GlamBot's avant-garde path — Met-Gala-meets-AI impossible fashion. Fashion as spectacle. Still gorgeous, never ugly.

Each entry: 15-30 words. One specific avant-garde fashion concept.

━━━ CATEGORIES ━━━
- Butterfly-dress (dress made entirely of thousands of rendered butterflies)
- Smoke-gown (dress appearing to be formed of billowing smoke)
- Crystal-architecture dress (faceted geometric crystal forming garment)
- Liquid-mercury outfit (flowing mirror-silver)
- Rose-petal couture (dress made of thousands of petals)
- Feathered-bird dress (covered in massive feather plumage)
- Spider-web gossamer gown
- Flame-gown (dress appearing to burn)
- Ocean-wave dress (moving water as garment)
- Glass-orchid couture (flowers made of glass)
- Paper-crane armor-gown (thousands of origami cranes)
- Pearl-cascade dress (layers of pearls flowing)
- Lightning-contained gown (electric arcs as fabric)
- Moth-wing translucent couture
- Moss-and-vine living-garden dress
- Holographic-foil sculpture dress
- Chrome-bubble architectural gown
- Stained-glass window dress
- Geometric-fractal origami suit
- Spider-silk strands intricately woven
- Living-flowers couture dress
- Cascading-chain metallic armor gown
- Mushroom-cap skirt structure
- Coral-and-pearl underwater couture
- Silver-thread architectural tower dress
- Peacock-train drape gown
- Ivy-overgrown statue dress (moss + ivy + stone)
- Snowflake architectural dress
- Cloud-and-sky cape flowing
- Wing-shaped shoulder-structure gown
- Nebula-printed flowing silk
- Copper-circuit-board couture
- Dragonfly-wing translucent layers
- Cactus-spike bodice (gentle spikes)
- Cracked-porcelain ceramic dress (actual shards)
- Bubble-wrap transparent couture
- Sequin-rain cascade (thousands of sequins)
- Ribbon-wrap mummy-style couture
- Multi-length tuxedo deconstruction
- Feathered-fringe flowing skirt + corset

━━━ RULES ━━━
- Impossible / spectacle / gorgeous
- Never ugly (Met-Gala quality)
- High-concept fashion spectacle

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
