#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/beach_landscape_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BEACH LANDSCAPE SCENE descriptions for BeachBot's beach-landscape path — wide POSTCARD of any beach + its full context + any weather/time. Multiple-element composition.

Each entry: 15-30 words. One specific wide beach-composition scene.

━━━ CATEGORIES ━━━
- Overlook from cliff down onto crescent bay
- From out in water looking back at shore
- Entire bay with palm-fringed curve
- Through palms to ocean at golden-hour
- Pulled-back sand with mountain backdrop
- Tropical cove from above
- White-sand beach with volcanic-mountains behind
- Pebble beach with lighthouse distant
- Black-sand beach with crashing waves
- Storm-beach with dramatic clouds
- Dawn fog rolling over long beach
- Rainbow after storm across bay
- Moonlit beach with silver path
- Aurora over arctic beach
- Sunset beach with palm silhouettes
- Dusk beach with first-stars
- Rocky-cove at low-tide
- Secluded cove behind cliffs
- Long pristine beach wide-aerial
- Driftwood-strewn beach overcast
- Surf-break beach with wave-lines
- Tide-coming-in beach shimmer
- Post-rain beach puddle-reflection
- Misty-morning beach mysterious
- Aerial of winding coastline
- Palm-tree forest with beach beyond
- Mangrove-fringed beach
- Coral-coast beach crystal shallows
- Pebble-scree beach nordic
- Sand-dune to water transition
- Beach with offshore-island
- Empty Caribbean beach at sunrise
- Cliff-framed Greek beach
- Crescent beach with resort (no people)
- Beach-at-full-moon reflection
- Post-storm-beach with foam-patterns
- Turquoise-water revealing sandbars
- Lagoon-tidal-pool beach shapes
- Lava-meeting-ocean Hawaii coast
- Sea-grass meadow into beach

━━━ RULES ━━━
- WIDE postcard composition
- Beach + surroundings + weather in one frame
- Multi-element scene

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
