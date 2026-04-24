#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/beach_night_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TROPICAL BEACH NIGHT scene descriptions for BeachBot's beach-night path. Each entry describes a gorgeous tropical beach at night — moonlit, starlit, firelit, lantern-lit, bioluminescent. Warm, magical, romantic, awe-inspiring nighttime beach scenes.

Each entry: 25-40 words. One complete night beach scene with light source, setting, and atmosphere.

━━━ THE CONCEPT ━━━
The most beautiful tropical beaches in the world AT NIGHT. Not dark and scary — MAGICAL. Moonlight on water, tiki torches along the shore, bioluminescent waves, Milky Way overhead, bonfire glow on sand, paper lanterns in palms. Every scene makes you want to be there RIGHT NOW, barefoot on warm sand under the stars.

━━━ LIGHT SOURCES (distribute evenly — this is what makes each scene unique) ━━━

MOONLIT (~25%):
- Full moon casting silver pathway across calm ocean, everything bathed in blue-silver glow
- Crescent moon low over water, gentle celestial light, stars filling the sky
- Moonrise through clouds, copper-orange moon reflecting on wet sand
- Moon behind thin clouds creating soft diffuse glow, halo effect

FIRELIT (~25%):
- Tiki torches lining a shoreline path, warm flickering amber pools on sand
- Beach bonfire crackling, orange firelight casting long shadows, sparks drifting up
- Hurricane lanterns on weathered posts along a dock or boardwalk
- Fire pit ring on sand, glowing embers, warm light on nearby palms and driftwood
- Paper lanterns strung between palm trees, warm amber glow on everything below

STARLIT (~25%):
- Milky Way arcing overhead, dense star field, faint starlight on dark water
- Stars reflected in mirror-still lagoon, sky and water merging
- Shooting star streaking above dark ocean horizon, beach in starlight
- Clear tropical night sky, constellations crisp, Southern Cross visible

BIOLUMINESCENT/SPECIAL (~25%):
- Bioluminescent waves pulsing electric blue-green with each breaking roller
- Phosphorescent plankton glowing in tide pools along rocky shore
- Bioluminescent bay, every ripple and splash lighting up neon blue
- Aurora-like atmospheric glow above tropical horizon (rare atmospheric event)
- Fireflies drifting among coastal vegetation, pinpoints of warm light

━━━ BEACH SETTINGS (vary — always tropical) ━━━
- White sand beach with coconut palms, calm lagoon
- Rocky volcanic cove, tide pools, rugged but beautiful
- Overwater dock or pier extending into calm dark water
- Secluded cove with jungle hillside behind
- Wide open beach with distant headlands
- Tidal flat with mirror-like water reflecting sky
- Beach bar/hut area (structure only, no people) with string lights

━━━ ATMOSPHERE ━━━
- Warm trade winds, sound of gentle surf implied
- Warm sand still holding the day's heat
- Salt air, tropical flowers blooming nearby
- Calm, peaceful, magical energy
- The kind of night that makes you never want to leave

━━━ NO PEOPLE ━━━
No humans, couples, parties, gatherings. Empty paradise — only the beach, the night, and the light sources. Man-made objects OK (torches, lanterns, fire pits, structures).

━━━ DEDUP ━━━
Each entry must feature a DIFFERENT primary light source + beach setting combo. No two entries with the same lighting at the same type of location.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
