#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_beach.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY BEACH / COASTAL DIORAMA scene descriptions for TinyBot — handmade-resin-diorama-scale beach + pier + lighthouse + tropical-coast scenes. Cute miniature coastal worlds — sandy shores, weathered piers, lighthouses, surfboards, beach huts, palm trees, sailboats, tide pools, seashells.

Each entry: 15-25 words. ONE specific tiny coastal scene with scale-cue + architectural or natural detail.

━━━ COASTAL CATEGORIES (spread across all 200) ━━━
- Tiny lighthouse on a rocky outcrop with crashing miniature waves at the base
- Weathered wooden pier with matchstick planks extending over turquoise water, fishing boats moored
- Sandy beach with miniature striped umbrellas, beach chairs, and a tiny sandcastle
- Tropical palm-thatched beach hut on stilts over turquoise lagoon, ladder down to water
- Coastal cliff village with stair-cut paths winding down to a hidden cove beach
- Tiny harbor with sailboats moored at thumb-sized docks, lobster pots stacked
- Beach bonfire scene with driftwood logs, miniature flames, marshmallow-sticks
- Tide pools at low tide — miniature starfish, hermit crabs, anemones in glass-clear water
- Beach-side ice-cream parlor with pastel awning, miniature soft-serve cones, beach chairs
- Coral reef diorama beneath glass-clear water — tropical fish, anemones, sea fans
- Tropical island with a single palm tree, sandy beach, a shipwreck silhouette offshore
- Tiny surfboard shack on the beach, racks of pastel surfboards, hammock between palms
- Beach pier at sunset with miniature warm-lit lanterns, fishermen silhouettes, calm water
- Coastal cottage on stilts above the tide line, weathered grey wood, conch shell wind chimes
- Tiny lobster shack with red-and-white striped awning, mussel-shell decoration, weathered planks
- Driftwood beach with bleached logs, scattered seashells, a tiny crab walking sideways
- Boardwalk with carnival booths, ferris wheel miniature, cotton candy stalls, beach behind
- Coral atoll with turquoise lagoon center, ring of sandy beach, palms around the edge
- Cliffside chapel above the sea, white-painted, lighthouse beam crossing the water at dusk
- Beachfront market with pastel-striped tents, fish-on-ice displays, tiny boats unloading
- Coastal grotto with sea-cave carved into pink-rock cliff, lantern-lit fishing-boats inside
- Tidal flats at low tide with tiny rowboats stranded on wet sand, mirror reflections
- Beach treehouse / fort built on a fallen palm trunk, kid-coded miniature furniture
- Coastal botanical garden with miniature succulents, beach grass, weathered shells as planters
- Stilted houses over a clear turquoise lagoon, walkway between them, fishing nets drying
- Tiny island lighthouse keeper's cottage attached to the lighthouse base, white-painted with red roof
- Beach buggy / vintage VW van on the sand with miniature surfboards strapped to the top
- Coastal sunrise pier scene with miniature warm pink-and-gold sky reflected in still water

━━━ SCALE RULE ━━━
Every scene reads as MINIATURE / DOLLHOUSE / DIORAMA scale. Handmade-resin-cast feeling. Include scale cues — "thumb-sized boats," "matchstick pier planks," "thimble-sized umbrellas," "pinhead seashells."

━━━ ATMOSPHERIC VARIETY (rotate widely across the pool) ━━━
- Golden hour beach (warm amber light, long shadows, pink-gold sky reflection in water)
- Bright tropical midday (turquoise water, white sand, deep blue sky, vivid)
- Sunset pier (orange-pink horizon, warm lantern-light, calm water mirror)
- Misty coastal dawn (soft grey-blue mist over water, lighthouse beam cutting through)
- Stormy ocean (white-cap waves, lighthouse beam, dramatic clouds)
- Quiet starlit beach (deep blue night, lighthouse beam, bioluminescent surf)
- Pastel-soft beach (peach + teal + cream, dreamy ambient)

━━━ HARD RULES ━━━
• ALL scenes are EXTERIOR — never interior rooms
• ALL scenes are MINIATURE-SCALE handmade-resin-diorama feel
• ALL scenes are COASTAL — must include water (ocean / lagoon / tide-pool / harbor) AND a beach/pier/lighthouse/coastal-architecture element
• NEVER include humans / human figures (silhouettes acceptable as small accent, no faces)
• Sometimes (~30%) include tiny coastal creatures — chubby crabs, starfish, seagulls, pelicans, tropical fish, dolphins, sea turtles

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: coastal-feature + time-of-day + atmospheric quality. "Lighthouse at sunset" and "lighthouse at golden hour" are TOO SIMILAR. "Striped-red lighthouse on rocky outcrop with crashing surf at sunset" and "white lighthouse keeper's cottage at misty dawn with lantern beam cutting through fog" are distinct.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
