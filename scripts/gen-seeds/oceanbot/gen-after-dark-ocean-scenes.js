#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/after_dark_ocean_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} AFTER-DARK OCEAN SCENE descriptions for OceanBot's after-dark path — ocean in glowing-dark moments. Bioluminescence + moonlit + twilight + glowing-reef + low-light + luminous atmosphere.

Each entry: 15-30 words. One specific low-light luminous ocean scene.

━━━ CATEGORIES ━━━
- Bioluminescent plankton wave glowing turquoise
- Glowing jellyfish swarm in dark water
- Comb-jelly iridescent cilia-trails
- Firefly-squid swarm on Japanese coast
- Moonlit-silver ocean with path-of-light
- Milky-Way arching over calm mirror-ocean
- Starfield reflection on still sea
- Aurora over sea with reflection
- Twilight-reef with glowing coral bioluminescence
- Sunset-aftermath peaceful mirror-reflection
- Lightning-over-sea single strike
- Dragon-fish with dangling lure-glow
- Deep-sea pyrosome glowing colony
- Anglerfish with illuminated lure in black
- Phosphorescent wave at beach
- Glow-worm cave-ceiling underwater
- Bioluminescent seashell glow
- Jellyfish underside moon-rising
- Moonlit whale surface-breath
- Jellyfish-bloom mid-water column
- Pyrosome bioluminescent-colony
- Silver-moonlight sardine-ball swirling
- Glowing-reef at new-moon
- Silver-Milky-Way over ship
- Lightning-storm from sea
- Dolphin-wake bioluminescent trail
- Shimmer-plankton around ship
- Moonlight through jellyfish
- Starry-sky + glassy sea
- Sunset-to-twilight transition
- Green-flash at sunset over water
- Noctilucent-cloud reflection on water
- Nebula-reflected-sea
- Bioluminescent-bay boat-trail
- Dark-starfish on moonlit-sand
- Moon-halo above ocean
- Aurora-australis over southern ocean
- Bio-cyan trail from boat
- Moonlit-rocks with glowing tidal-pool
- Squid-hunt moonlit
- Whale-song-visualization abstract-light
- Glow-fish school mid-column
- Twilight-reef transition colors
- Lantern-fish ascending at night

━━━ RULES ━━━
- Low-light + luminous atmosphere
- Named natural luminous phenomena
- Peaceful + gorgeous + rare

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
