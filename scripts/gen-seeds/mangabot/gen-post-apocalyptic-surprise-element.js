#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_surprise_element.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} POST-APOCALYPTIC SURPRISE-ELEMENT entries — small secondary subjects at midground/background that enrich the overgrown ruin world.

Each 10-18 words. Element + placement + post-apocalyptic register. Quiet decay + nature reclaiming, NOT horror.

VARIETY:
- 14% NATURE-RECLAIM (vine cascading down rusted-rail at midground / sapling growing through cracked-concrete / moss-blanket on car-hood / fern-cluster between rails)
- 12% ANIMAL-WILDLIFE (deer grazing in midground concourse / fox peering from doorway / crow on rusted-sign / lizard sunning on engine-block / rabbit darting through ruin)
- 12% SCATTERED-DEBRIS (overturned-shopping-cart in deep distance / collapsed-umbrella half-buried / faded-magazine on floor / cracked-helmet on rubble)
- 10% RUSTED-MECHANISM (vending-machine tipped at midground / rusted-bicycle frame in weeds / abandoned-scooter with deflated tires / old-traffic-light leaning)
- 10% DRIFTING-PARTICLE (dust-motes catching sun-shaft / drifting-pollen in shaft / floating-spore-cloud at midground / drifting-ash from distant smoke)
- 8% FADED-SIGNAGE (peeling konbini-sign in deep background / kanji-billboard with paint-flaking / faded-pachinko-poster on wall / cracked-station-sign)
- 8% WATER-FEATURE (shallow-puddle reflecting sky in foreground-corner / drip-from-pipe with ripple / streamlet through ruin / lapping-tide at edge)
- 6% ANCIENT-MECH-BONE-DETAIL (rusted-mech-fingertip protruding from earth / cable-vine tangle at midground / weathered-armor-plate / corroded-rivet-row)
- 6% PRE-FALL-OBJECT (cracked-snow-globe on shelf / faded-photo in frame / dust-covered-toy / abandoned-shoe on stair)
- 6% LIGHT-PHENOMENON (sun-shaft through shattered-ceiling / pollen-glow in beam / firefly at twilight / lantern-pool at midground)
- 4% DISTANT-FIGURE-OR-CAMPFIRE (distant campfire-smoke on horizon / faint figure-silhouette at far edge — NEVER competing-with-wanderer)
- 4% CELESTIAL (passing-jet contrail / first-stars appearing / aurora-impossibility / red-sun behind haze)

DO write:
- Vine cascading down rusted-rail at midground, catching sunset-amber light
- Fox peering from collapsed-doorway in midground, eyes catching low-amber light
- Overturned shopping-cart in deep distance, rust-orange against grey-concrete
- Vending-machine tipped at midground with weeds growing through coin-slot
- Dust-motes catching sun-shaft through shattered-ceiling at midground
- Peeling konbini-sign in deep background with kanji-paint flaking off
- Sun-shaft through shattered-skylight at midground, pollen-glow drifting in beam

DO NOT: corpses / blood / gore / horror / anything foreground competing with wanderer / multiple per entry / zombies.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
